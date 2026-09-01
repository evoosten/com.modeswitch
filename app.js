'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('homey-api');
const DashboardService = require('./lib/dashboard-service');
const crypto = require('crypto');

const SETTINGS_KEYS = {
  CURRENT_MODE: 'current_mode',
  MODE_RULES: 'mode_rules',
  SUB_MODES: 'sub_modes',
  MAIN_MODE_LABELS: 'main_mode_labels',
  ZONE_RULES: 'zone_rules',
  TEMPERATURE_RULES: 'temperature_rules',
  APPLIANCE_RULES: 'appliance_rules',
  APPLIANCE_STATE: 'appliance_state',
  APPLIANCE_HISTORY: 'appliance_history',
  ACTIVITY_RULES: 'activity_rules',
  ACTIVITY_STATE: 'activity_state',
  ACTIVITY_HISTORY: 'activity_history',
  SCHEDULE_RULES: 'schedule_rules',
  AUTO_MODE: 'auto_mode',
  SCHEDULE_STATE: 'schedule_state',
  AUTO_STATE: 'auto_state',
  DISPLAY_SETTINGS: 'display_settings',
  MODE_SWITCH_DEVICE_RULES: 'mode_switch_device_rules',
  KEYPAD_MAPPINGS: 'keypad_mappings',
  CRASH_LOG: 'crash_log',
  CRASH_DIAGNOSTICS: 'crash_diagnostics',
  CRASH_BREADCRUMBS: 'crash_breadcrumbs',
};

const DEFAULT_MODES = ['home', 'sleep', 'away', 'vacation'];
const DEFAULT_SUB_MODES = [
  { id: 'home_tv', parentMode: 'home', label: 'TV kijken' },
  { id: 'home_romantic', parentMode: 'home', label: 'Romantisch' },
  { id: 'home_game', parentMode: 'home', label: 'Game' },
  { id: 'home_movie', parentMode: 'home', label: 'Film kijken' },
];
const POLL_INTERVAL_MS = 2000;
const SCHEDULER_INTERVAL_MS = 60000;
const APPLIANCE_INTERVAL_MS = 10000;
const ACTIVITY_HISTORY_LIMIT = 20;
const APPLIANCE_HISTORY_LIMIT = 20;
const CONTACT_RETRY_DELAYS_MS = [1000];
const ENV_CACHE_TTL_MS = 8000;
const STATIC_CACHE_TTL_MS = 300000;
const MONITORING_ENV_TIMEOUT_MS = 7000;
const MONITORING_SLOW_PHASE_MS = 4000;


class ModeSwitchApp extends Homey.App {
  async onInit() {
    this.appStartedAt = Date.now();
    if (this.homey) this.homey.appStartTime = this.appStartedAt;
    this.motionStateByRule = new Map();
    this.temperatureWindowStateByRule = new Map();
    this.contactRetryTimers = new Map();
    this.modeDelayTimers = new Set();
    this.pollTimer = null;
    this.schedulerTimer = null;
    this.applianceTimer = null;
    this.diagnosticsTimer = null;
    this.polling = false;
    this.appliancePolling = false;
    this.schedulerPolling = false;
    this.environmentCache = null;
    this.environmentCacheTs = 0;
    this.staticCache = null;
    this.staticCacheTs = 0;

    this._registerProcessErrorGuards();

    this.modeChangedTrigger = this.homey.flow.getDeviceTriggerCard('mode_changed');
    this.zoneMotionStartedTrigger = this.homey.flow.getTriggerCard('zone_motion_started');
    this.zoneNoMotionTrigger = this.homey.flow.getTriggerCard('zone_no_motion');
    this.applianceStartedTrigger = this.homey.flow.getTriggerCard('appliance_started');
    this.applianceReadyTrigger = this.homey.flow.getTriggerCard('appliance_ready');
    this.applianceReadyReminderTrigger = this.homey.flow.getTriggerCard('appliance_ready_reminder');
    this.applianceRunningCondition = this.homey.flow.getConditionCard('appliance_is_running');
    this.applianceReadyCondition = this.homey.flow.getConditionCard('appliance_is_ready');
    this.applianceWaitingResetCondition = this.homey.flow.getConditionCard('appliance_waiting_reset');
    this.activityStartedTrigger = this.homey.flow.getTriggerCard('activity_started');
    this.activityStoppedTrigger = this.homey.flow.getTriggerCard('activity_stopped');
    this.activityUpdatedTrigger = this.homey.flow.getTriggerCard('activity_updated');
    this.activityRunningCondition = this.homey.flow.getConditionCard('activity_is_running');
    this.activityStandbyCondition = this.homey.flow.getConditionCard('activity_is_standby');

    this.isModeCondition = this.homey.flow.getConditionCard('is_mode');
    this.zoneHasMotionCondition = this.homey.flow.getConditionCard('zone_has_motion');

    this.setModeAction = this.homey.flow.getActionCard('set_mode');
    this.processKeypadInputAction = this.homey.flow.getActionCard('process_keypad_input');
    this.zoneLightsOnAction = this.homey.flow.getActionCard('zone_lights_on');
    this.zoneLightsOffAction = this.homey.flow.getActionCard('zone_lights_off');
    this.runZoneRulesAction = this.homey.flow.getActionCard('run_zone_rules');

    this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });
    this.dashboardService = new DashboardService({ app: this });

    this._registerFlowRunListeners();
    this._registerFlowArgumentAutocomplete();
    this._registerModeAndSwitchFlowCards();
    this._registerModeWidgetSettings();
    this._ensureDefaultSettings();
    this._recordStartupRecoveryIfNeeded();
    this._markDiagnostics('app_init', { version: this.homey.manifest && this.homey.manifest.version });
    this._startDiagnosticsHeartbeat();
    this._startMotionPolling();
    this._startSchedulerPolling();
    this._startAppliancePolling();

    this.log(`Mode Switch app v${this.homey.manifest?.version || '3.1.0'} is ready`);
  }


  _registerModeWidgetSettings() {
    try {
      if (!this.homey.dashboards || typeof this.homey.dashboards.getWidget !== 'function') return;
      const widget = this.homey.dashboards.getWidget('mode');
      if (!widget || typeof widget.registerSettingAutocompleteListener !== 'function') return;

      const readChoiceId = value => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (value.id) return String(value.id);
        if (value.data && value.data.id) return String(value.data.id);
        return '';
      };
      const matches = (item, query) => {
        const q = String(query || '').trim().toLowerCase();
        return !q || String(item.name || '').toLowerCase().includes(q) || String(item.id || '').toLowerCase().includes(q);
      };
      const getModeSwitchDevices = () => {
        try {
          const driver = this.homey.drivers.getDriver('mode_switch');
          return driver && typeof driver.getDevices === 'function' ? driver.getDevices() : [];
        } catch (error) {
          this.error('Could not load Mode & Switch devices for widget settings', error);
          return [];
        }
      };

      widget.registerSettingAutocompleteListener('modeSource', async query => {
        const options = [{
          id: 'controller',
          name: this._getHomeyLanguage() === 'en' ? 'Mode Controller' : 'Modus controller',
          description: this._getHomeyLanguage() === 'en' ? 'Main modes and sub modes' : 'Hoofdmodussen en submodussen',
          sourceType: 'controller',
        }];
        for (const device of getModeSwitchDevices()) {
          const data = typeof device.getData === 'function' ? device.getData() : {};
          const sourceDeviceId = String((data && data.id) || (typeof device.getId === 'function' ? device.getId() : ''));
          options.push({
            id: sourceDeviceId,
            deviceId: sourceDeviceId,
            name: typeof device.getName === 'function' ? device.getName() : 'Mode & Switch',
            description: 'Mode & Switch',
            sourceType: 'mode_switch',
          });
        }
        return options.filter(item => item.id && matches(item, query));
      });

      widget.registerSettingAutocompleteListener('modeList', async (query, settings) => {
        const sourceId = readChoiceId(settings && settings.modeSource) || 'controller';
        if (sourceId === 'controller') {
          const item = {
            id: 'controller_main',
            name: this._getHomeyLanguage() === 'en' ? 'Main modes' : 'Hoofdmodussen',
            description: this._getHomeyLanguage() === 'en' ? 'Includes configured sub modes' : 'Inclusief ingestelde submodussen',
          };
          return matches(item, query) ? [item] : [];
        }

        const device = getModeSwitchDevices().find(item => {
          const data = typeof item.getData === 'function' ? item.getData() : {};
          const dataId = String(data && data.id ? data.id : '');
          const homeyId = String(typeof item.getId === 'function' ? item.getId() : '');
          return dataId === sourceId || homeyId === sourceId;
        });
        if (!device) return [];
        const exported = typeof device.exportConfig === 'function' ? device.exportConfig() : { lists: [] };
        return (Array.isArray(exported.lists) ? exported.lists : [])
          .map(list => ({
            id: list.id,
            name: list.name,
            description: `${Array.isArray(list.buttons) ? list.buttons.length : 0} ${this._getHomeyLanguage() === 'en' ? 'modes' : 'modussen'}`,
            isDefault: list.id === exported.defaultListId,
          }))
          .filter(item => item.id && matches(item, query));
      });

      const registerSwitchAutocomplete = settingId => {
        widget.registerSettingAutocompleteListener(settingId, async (query, settings) => {
          const sourceId = readChoiceId(settings && settings.modeSource) || 'controller';
          if (sourceId === 'controller') return [];
          const device = getModeSwitchDevices().find(item => {
            const data = typeof item.getData === 'function' ? item.getData() : {};
            const dataId = String(data && data.id ? data.id : '');
            const homeyId = String(typeof item.getId === 'function' ? item.getId() : '');
            return dataId === sourceId || homeyId === sourceId;
          });
          if (!device) return [];
          const exported = typeof device.exportConfig === 'function' ? device.exportConfig() : { switches: [] };
          return (Array.isArray(exported.switches) ? exported.switches : [])
            .map(button => ({
              id: button.id,
              name: button.name || button.id,
              description: typeof device.getName === 'function' ? device.getName() : 'Mode & Switch',
            }))
            .filter(item => item.id && matches(item, query));
        });
      };
      for (let index = 1; index <= 6; index += 1) {
        registerSwitchAutocomplete(`switchButton${index}`);
      }
    } catch (error) {
      this.error('Could not register Mode widget settings', error);
    }
  }

  onUninit() {
    this._markDiagnostics('app_uninit');
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.schedulerTimer) clearInterval(this.schedulerTimer);
    if (this.applianceTimer) clearInterval(this.applianceTimer);
    for (const timer of this.contactRetryTimers.values()) {
      clearTimeout(timer);
    }
    this.contactRetryTimers.clear();
  }

  _registerProcessErrorGuards() {
    // Store crash details persistently so they survive Homey's automatic app restart.
    if (ModeSwitchApp._processErrorGuardsRegistered) return;
    ModeSwitchApp._processErrorGuardsRegistered = true;

    process.on('unhandledRejection', reason => {
      try {
        this._markDiagnostics('unhandledRejection', { source: 'process' });
        this._recordCrashLog('unhandledRejection', reason, { source: 'process' });
        this.error('Unhandled promise rejection logged', reason);
      } catch (_) {}
    });

    process.on('uncaughtException', error => {
      try {
        this._markDiagnostics('uncaughtException', { source: 'process' });
        this._recordCrashLog('uncaughtException', error, { source: 'process' });
        this.error('Uncaught exception logged', error);
      } catch (_) {}
    });
  }

  _normaliseErrorForLog(error) {
    if (!error) return { message: 'Unknown error' };
    if (typeof error === 'string') return { message: error };
    return {
      name: error.name || 'Error',
      message: error.message || String(error),
      stack: error.stack || '',
      code: error.code || undefined,
    };
  }

  _recordCrashLog(type, error, meta = {}) {
    try {
      const existing = this.getCrashLog();
      const entry = {
        id: `crash_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        ts: new Date().toISOString(),
        type: type || 'error',
        error: this._normaliseErrorForLog(error),
        meta: meta || {},
      };
      const next = [entry, ...existing].slice(0, 25);
      this.homey.settings.set(SETTINGS_KEYS.CRASH_LOG, next);
      return entry;
    } catch (logError) {
      try { this.error('Could not save crash log', logError); } catch (_) {}
      return null;
    }
  }

  getCrashLog() {
    const log = this.homey.settings.get(SETTINGS_KEYS.CRASH_LOG);
    return Array.isArray(log) ? log : [];
  }

  clearCrashLog() {
    this.homey.settings.set(SETTINGS_KEYS.CRASH_LOG, []);
    return [];
  }


  _markDiagnostics(event, meta = {}) {
    try {
      const previous = this.getCrashDiagnostics();
      const ts = new Date().toISOString();
      const next = {
        ...(previous && typeof previous === 'object' ? previous : {}),
        lastEvent: event || 'unknown',
        lastEventAt: ts,
        uptimeMs: Math.max(0, Date.now() - (this.appStartedAt || (this.homey && this.homey.appStartTime) || Date.now())),
        meta: meta || {},
      };
      this.homey.settings.set(SETTINGS_KEYS.CRASH_DIAGNOSTICS, next);
      this._recordBreadcrumb(event || 'unknown', meta || {}, ts);
      return next;
    } catch (error) {
      try { this.error('Could not save diagnostics', error); } catch (_) {}
      return null;
    }
  }

  _recordBreadcrumb(event, meta = {}, ts = new Date().toISOString()) {
    try {
      const existing = this.getCrashBreadcrumbs();
      const entry = {
        ts,
        event: event || 'unknown',
        meta: meta || {},
      };
      this.homey.settings.set(SETTINGS_KEYS.CRASH_BREADCRUMBS, [entry, ...existing].slice(0, 75));
      return entry;
    } catch (error) {
      try { this.error('Could not save breadcrumb', error); } catch (_) {}
      return null;
    }
  }

  getCrashBreadcrumbs() {
    const crumbs = this.homey.settings.get(SETTINGS_KEYS.CRASH_BREADCRUMBS);
    return Array.isArray(crumbs) ? crumbs : [];
  }

  _recordStartupRecoveryIfNeeded() {
    try {
      const previous = this.getCrashDiagnostics();
      if (!previous || typeof previous !== 'object' || !previous.lastEvent) return;
      const lastEvent = String(previous.lastEvent || '');
      const endedCleanly = /(_end|heartbeat|app_init|app_uninit)$/.test(lastEvent);
      const risky = /(_start|condition|activity|appliance|scheduler|motion|poll)/.test(lastEvent);
      if (endedCleanly || !risky) return;
      this._recordCrashLog('startup_after_unclean_stop', new Error('App restarted after an incomplete monitoring step. No uncaught JS exception was captured.'), {
        previousLastEvent: previous.lastEvent,
        previousLastEventAt: previous.lastEventAt,
        previousMeta: previous.meta || {},
      });
    } catch (error) {
      try { this.error('Could not record startup recovery diagnostics', error); } catch (_) {}
    }
  }

  _startDiagnosticsHeartbeat() {
    if (this.diagnosticsTimer) clearInterval(this.diagnosticsTimer);
    this._markDiagnostics('heartbeat_start');
    this.diagnosticsTimer = setInterval(() => {
      this._markDiagnostics('heartbeat', {
        motionPolling: !!this.polling,
        appliancePolling: !!this.appliancePolling,
        schedulerPolling: !!this.schedulerPolling,
      });
    }, 30000);
  }



  async _withTimeout(promise, timeoutMs, label, meta = {}, fallbackValue = undefined) {
    let timer = null;
    try {
      return await Promise.race([
        Promise.resolve(promise),
        new Promise(resolve => {
          timer = setTimeout(() => {
            const error = new Error(`${label || 'operation'} timed out after ${timeoutMs}ms`);
            this._recordCrashLog('monitoring_timeout', error, { label, timeoutMs, ...(meta || {}) });
            this._markDiagnostics(`${label || 'operation'}_timeout`, { timeoutMs, ...(meta || {}) });
            resolve(fallbackValue);
          }, Math.max(1000, Number(timeoutMs) || 5000));
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  _recordMonitoringPhase(phase, startedAt, meta = {}) {
    try {
      const durationMs = Math.max(0, Date.now() - Number(startedAt || Date.now()));
      const memory = typeof process !== 'undefined' && typeof process.memoryUsage === 'function'
        ? process.memoryUsage()
        : null;
      const perf = {
        phase,
        durationMs,
        ...(meta || {}),
        memory: memory ? {
          rss: memory.rss,
          heapUsed: memory.heapUsed,
          heapTotal: memory.heapTotal,
          external: memory.external,
        } : undefined,
      };
      this._markDiagnostics(`${phase}_end`, perf);
      if (durationMs >= MONITORING_SLOW_PHASE_MS) {
        this._recordCrashLog('slow_monitoring_phase', new Error(`${phase} took ${durationMs}ms`), perf);
      }
      return perf;
    } catch (error) {
      try { this.error('Could not record monitoring phase', error); } catch (_) {}
      return null;
    }
  }

  getCrashDiagnostics() {
    const diagnostics = this.homey.settings.get(SETTINGS_KEYS.CRASH_DIAGNOSTICS);
    return diagnostics && typeof diagnostics === 'object' ? diagnostics : {};
  }

  _ensureDefaultSettings() {
    if (!this.homey.settings.get(SETTINGS_KEYS.CURRENT_MODE)) {
      this.homey.settings.set(SETTINGS_KEYS.CURRENT_MODE, 'home');
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.MAIN_MODE_LABELS)) {
      this.homey.settings.set(SETTINGS_KEYS.MAIN_MODE_LABELS, {});
    }

    if (!Array.isArray(this.homey.settings.get(SETTINGS_KEYS.SUB_MODES))) {
      this.homey.settings.set(SETTINGS_KEYS.SUB_MODES, DEFAULT_SUB_MODES);
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.MODE_RULES)) {
      this.homey.settings.set(SETTINGS_KEYS.MODE_RULES, this._createEmptyModeRules());
    }

    if (!Array.isArray(this.homey.settings.get(SETTINGS_KEYS.ZONE_RULES))) {
      this.homey.settings.set(SETTINGS_KEYS.ZONE_RULES, []);
    }

    if (!Array.isArray(this.homey.settings.get(SETTINGS_KEYS.TEMPERATURE_RULES))) {
      this.homey.settings.set(SETTINGS_KEYS.TEMPERATURE_RULES, []);
    }

    if (!Array.isArray(this.homey.settings.get(SETTINGS_KEYS.APPLIANCE_RULES))) {
      this.homey.settings.set(SETTINGS_KEYS.APPLIANCE_RULES, []);
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.APPLIANCE_STATE)) {
      this.homey.settings.set(SETTINGS_KEYS.APPLIANCE_STATE, {});
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.APPLIANCE_HISTORY)) {
      this.homey.settings.set(SETTINGS_KEYS.APPLIANCE_HISTORY, {});
    }

    if (!Array.isArray(this.homey.settings.get(SETTINGS_KEYS.ACTIVITY_RULES))) {
      this.homey.settings.set(SETTINGS_KEYS.ACTIVITY_RULES, []);
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.ACTIVITY_STATE)) {
      this.homey.settings.set(SETTINGS_KEYS.ACTIVITY_STATE, {});
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.ACTIVITY_HISTORY)) {
      this.homey.settings.set(SETTINGS_KEYS.ACTIVITY_HISTORY, {});
    }

    if (!Array.isArray(this.homey.settings.get(SETTINGS_KEYS.SCHEDULE_RULES))) {
      this.homey.settings.set(SETTINGS_KEYS.SCHEDULE_RULES, []);
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.AUTO_MODE)) {
      this.homey.settings.set(SETTINGS_KEYS.AUTO_MODE, this._createDefaultAutoModeSettings());
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.SCHEDULE_STATE)) {
      this.homey.settings.set(SETTINGS_KEYS.SCHEDULE_STATE, {});
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.AUTO_STATE)) {
      this.homey.settings.set(SETTINGS_KEYS.AUTO_STATE, {});
    }

    if (!this.homey.settings.get(SETTINGS_KEYS.DISPLAY_SETTINGS)) {
      this.homey.settings.set(SETTINGS_KEYS.DISPLAY_SETTINGS, this._createDefaultDisplaySettings());
    }
  }

  _createDefaultDisplaySettings() {
    return { temperatureDeviceId: '', liveContextEnabled: false };
  }

  getDisplaySettings() {
    const raw = this.homey.settings.get(SETTINGS_KEYS.DISPLAY_SETTINGS);
    return this._normalizeDisplaySettings(raw);
  }

  async saveDisplaySettings(settings) {
    const normalized = this._normalizeDisplaySettings(settings);
    this.homey.settings.set(SETTINGS_KEYS.DISPLAY_SETTINGS, normalized);
    return normalized;
  }

  _normalizeDisplaySettings(settings) {
    return {
      temperatureDeviceId: typeof settings?.temperatureDeviceId === 'string' ? settings.temperatureDeviceId : '',
      liveContextEnabled: settings?.liveContextEnabled === true,
    };
  }

  _registerFlowRunListeners() {
    this.isModeCondition.registerRunListener(async args => this.getCurrentMode() === args.mode.id);

    this.zoneHasMotionCondition.registerRunListener(async args => {
      const zoneId = args.zone?.id;
      if (!zoneId) return false;
      const environment = await this.getEnvironment();
      const motionDevices = environment.motionDevices.filter(device => device.zone === zoneId);
      return motionDevices.some(device => device.motion === true);
    });


    const getApplianceStatus = args => {
      const applianceId = args.appliance?.id || args.appliance;
      if (!applianceId) return 'idle';
      const state = this.getApplianceState();
      return state[applianceId]?.status || 'idle';
    };

    this.applianceRunningCondition.registerRunListener(async args => getApplianceStatus(args) === 'running');
    this.applianceReadyCondition.registerRunListener(async args => getApplianceStatus(args) === 'ready');
    this.applianceWaitingResetCondition.registerRunListener(async args => getApplianceStatus(args) === 'ready');

    const getActivityStatus = args => {
      const activityId = args.activity?.id || args.activity;
      if (!activityId) return 'standby';
      const state = this.getActivityState();
      return state[activityId]?.status === 'active' ? 'active' : 'standby';
    };
    this.activityRunningCondition.registerRunListener(async args => getActivityStatus(args) === 'active');
    this.activityStandbyCondition.registerRunListener(async args => getActivityStatus(args) !== 'active');

    this.setModeAction.registerRunListener(async args => {
      await this.applyMode(args.mode.id, { source: 'flow' });
      return true;
    });

    this.processKeypadInputAction.registerRunListener(async args => {
      return this.processKeypadInput(args.keypad_id, args.pin);
    });

    this.zoneLightsOnAction.registerRunListener(async args => {
      await this.setZoneLights(args.zone.id, true, { dim: this._numberOrNull(args.dim) });
      return true;
    });

    this.zoneLightsOffAction.registerRunListener(async args => {
      await this.setZoneLights(args.zone.id, false);
      return true;
    });

    this.runZoneRulesAction.registerRunListener(async args => {
      await this.runZoneRulesForZone(args.zone.id, { source: 'flow' });
      return true;
    });
  }

  _registerFlowArgumentAutocomplete() {
    const modeAutocomplete = async query => {
      const q = String(query || '').trim().toLowerCase();
      return this.getAvailableModes()
        .filter(mode => !q || this.getModeLabel(mode).toLowerCase().includes(q) || mode.includes(q))
        .map(mode => ({ id: mode, name: this.getModeLabel(mode) }));
    };

    const zoneAutocomplete = async query => {
      const q = String(query || '').trim().toLowerCase();
      const environment = await this.getEnvironment();
      return (Array.isArray(environment.zones) ? environment.zones : [])
        .filter(zone => zone && (!q || String(zone.name || '').toLowerCase().includes(q)))
        .map(zone => ({ id: zone.id, name: zone.name || zone.id }));
    };


    const applianceAutocomplete = async query => {
      const q = String(query || '').trim().toLowerCase();
      return this.getApplianceRules()
        .filter(rule => !q || String(rule.name || '').toLowerCase().includes(q) || String(rule.type || '').toLowerCase().includes(q))
        .map(rule => ({ id: rule.id, name: rule.name || this._getApplianceTypeLabel(rule.type, this._getHomeyLanguage()) }));
    };

    const activityAutocomplete = async query => {
      const q = String(query || '').trim().toLowerCase();
      return this.getActivityRules()
        .filter(rule => !q || String(rule.name || '').toLowerCase().includes(q))
        .map(rule => ({ id: rule.id, name: rule.name || 'Activity' }));
    };

    this.isModeCondition.getArgument('mode').registerAutocompleteListener(modeAutocomplete);
    this.setModeAction.getArgument('mode').registerAutocompleteListener(modeAutocomplete);
    this.zoneHasMotionCondition.getArgument('zone').registerAutocompleteListener(zoneAutocomplete);
    this.zoneLightsOnAction.getArgument('zone').registerAutocompleteListener(zoneAutocomplete);
    this.zoneLightsOffAction.getArgument('zone').registerAutocompleteListener(zoneAutocomplete);
    this.runZoneRulesAction.getArgument('zone').registerAutocompleteListener(zoneAutocomplete);
    this.applianceRunningCondition.getArgument('appliance').registerAutocompleteListener(applianceAutocomplete);
    this.applianceReadyCondition.getArgument('appliance').registerAutocompleteListener(applianceAutocomplete);
    this.applianceWaitingResetCondition.getArgument('appliance').registerAutocompleteListener(applianceAutocomplete);
    this.activityRunningCondition.getArgument('activity').registerAutocompleteListener(activityAutocomplete);
    this.activityStandbyCondition.getArgument('activity').registerAutocompleteListener(activityAutocomplete);
  }

  _dashboardTimestamp(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return null;
    try { return new Date(number).toISOString(); } catch (_) { return null; }
  }

  _dashboardApplianceIcon(type) {
    return ({
      washing_machine: '🧺',
      dryer: '🌀',
      dishwasher: '🍽️',
      airfryer: '🍟',
      other: '🔌',
    })[type] || '🔌';
  }

  _getNextDashboardSchedule() {
    try {
      const rules = this.getScheduleRules().filter(rule => rule && rule.enabled !== false);
      if (!rules.length) return null;
      const scheduleState = this.homey.settings.get(SETTINGS_KEYS.SCHEDULE_STATE) || {};
      const currentMode = this.getCurrentMode();
      const now = new Date();
      const nowMs = now.getTime();
      const timezone = this._getHomeyTimezone();
      const localNow = this._getLocalDateParts(now, timezone);
      const environment = this.cachedEnvironment || this.environmentCache || null;
      const candidates = [];

      for (const rule of rules) {
        const state = scheduleState[rule.id] || {};
        for (const [key, title] of [['autoOffAt', 'Automatisch uitschakelen'], ['autoOnAt', 'Automatisch inschakelen']]) {
          const timestamp = Number(state[key]);
          if (Number.isFinite(timestamp) && timestamp > nowMs) {
            candidates.push({
              id: `${rule.id}:${key}`,
              name: rule.name || title,
              action: key === 'autoOffAt' ? 'off' : 'on',
              timestamp,
              time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              source: 'follow-up',
            });
          }
        }

        // A scheduled action that is restricted to one or more modes is only
        // relevant for the dashboard while the current mode matches. Follow-up
        // actions above are intentionally kept visible because they were already
        // scheduled by an earlier execution.
        if (Array.isArray(rule.modeIds) && rule.modeIds.length > 0 && !rule.modeIds.includes(currentMode)) {
          continue;
        }

        for (let offset = 0; offset < 8; offset += 1) {
          const baseUtc = this._localTimeToUtcTimestamp(
            localNow.year,
            localNow.month,
            localNow.day + offset,
            12 * 60,
            timezone
          );
          const candidateDate = new Date(baseUtc);
          const localCandidate = this._getLocalDateParts(candidateDate, timezone);
          const dayIndex = localCandidate.dayIndex;
          if (Array.isArray(rule.days) && rule.days.length && !rule.days.includes(dayIndex)) continue;

          let targetMinutes = null;
          if (rule.timeMode === 'fixed') {
            targetMinutes = Number.isFinite(Number(rule.fixedMinutes))
              ? Number(rule.fixedMinutes)
              : this._minutesFromTime(this._normalizeTime(rule.fixedTime, '19:00'));
          } else if (rule.timeMode === 'random') {
            const sameDate = offset === 0 && state.dateKey === localCandidate.dateKey && Number.isFinite(Number(state.targetMinutes));
            targetMinutes = sameDate
              ? Number(state.targetMinutes)
              : (offset === 0 ? this._getScheduleTargetMinutes(rule, state, localCandidate.dateKey, environment, now) : null);
          } else if (rule.timeMode === 'sunrise' || rule.timeMode === 'sunset') {
            const sun = this._calculateSunTimes(candidateDate, environment?.location || {});
            const base = rule.timeMode === 'sunrise' ? sun.sunriseMinutes : sun.sunsetMinutes;
            targetMinutes = this._wrapMinutes(base + (rule.sunOffsetMinutes || 0));
          }

          if (!Number.isFinite(Number(targetMinutes))) continue;
          const timestamp = this._localTimeToUtcTimestamp(
            localCandidate.year,
            localCandidate.month,
            localCandidate.day,
            Number(targetMinutes),
            timezone
          );
          if (!Number.isFinite(timestamp) || timestamp <= nowMs) continue;

          candidates.push({
            id: rule.id,
            name: rule.name || (rule.action === 'off' ? 'Uitschakelen' : 'Inschakelen'),
            action: rule.action || 'on',
            timestamp,
            time: `${String(Math.floor(Number(targetMinutes) / 60)).padStart(2, '0')}:${String(Number(targetMinutes) % 60).padStart(2, '0')}`,
            source: rule.timeMode || 'schedule',
            timezone,
            modeIds: Array.isArray(rule.modeIds) ? [...rule.modeIds] : [],
            requiredModeIds: Array.isArray(rule.modeIds) ? [...rule.modeIds] : [],
            currentMode,
            modeMatch: true,
          });
          break;
        }
      }

      candidates.sort((a, b) => a.timestamp - b.timestamp);
      const next = candidates[0];
      return next ? { ...next, dateTime: this._dashboardTimestamp(next.timestamp) } : null;
    } catch (error) {
      this.error('Could not create dashboard schedule', error);
      return null;
    }
  }

  getDashboardStatus() {
    return this.dashboardService ? this.dashboardService.getDashboard() : {
      schemaVersion: 1,
      app: { id: this.homey.manifest?.id || 'com.modeswitch', version: this.homey.manifest?.version || '3.1.1' },
      updatedAt: new Date().toISOString(),
      mode: null,
      presence: null,
      monitoring: [],
      activities: [],
      schedules: { next: null, enabledCount: 0, items: [] },
      attention: [],
      summary: {},
    };
  }

  getSubModes() {
    const raw = this.homey.settings.get(SETTINGS_KEYS.SUB_MODES);
    const source = Array.isArray(raw) ? raw : DEFAULT_SUB_MODES;
    const seen = new Set(DEFAULT_MODES);
    const out = [];
    for (const item of source) {
      const label = String(item && item.label ? item.label : '').trim();
      const parentMode = DEFAULT_MODES.includes(item && item.parentMode) ? item.parentMode : 'home';
      let id = String(item && item.id ? item.id : '').trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
      if (!id) id = `${parentMode}_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
      id = id.replace(/^_+|_+$/g, '');
      if (!id || DEFAULT_MODES.includes(id) || seen.has(id)) continue;
      seen.add(id);
      out.push({
        id,
        parentMode,
        label: label || id,
        icon: typeof item?.icon === 'string' ? item.icon : '',
        accentColor: typeof item?.accentColor === 'string' ? item.accentColor : '#60a5fa',
        imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
        ...this._normalizeSubModeAutoSettings(item)
      });
    }
    return out;
  }


  _normalizeSubModeAutoSettings(item) {
    const source = item && typeof item === 'object' ? item : {};
    const operator = source.autoOperator === 'below' ? 'below' : 'above';
    const autoWatt = this._numberInRange(source.autoWatt, 0, 5000, 50);
    const autoDelaySeconds = Math.round(this._numberInRange(source.autoDelaySeconds, 0, 3600, 10));
    const returnOperator = source.autoReturnOperator === 'above' ? 'above' : 'below';
    const autoReturnWatt = this._numberInRange(source.autoReturnWatt, 0, 5000, 15);
    const autoReturnDelaySeconds = Math.round(this._numberInRange(source.autoReturnDelaySeconds, 0, 86400, 300));
    return {
      autoEnabled: source.autoEnabled === true,
      autoDeviceId: typeof source.autoDeviceId === 'string' ? source.autoDeviceId : '',
      autoOperator: operator,
      autoWatt,
      autoDelaySeconds,
      autoReturnEnabled: source.autoReturnEnabled === true,
      autoReturnOperator: returnOperator,
      autoReturnWatt,
      autoReturnDelaySeconds,
    };
  }

  async saveSubModes(subModes) {
    const normalized = this._normalizeSubModes(subModes);
    this.homey.settings.set(SETTINGS_KEYS.SUB_MODES, normalized);
    return normalized;
  }

  _normalizeSubModes(subModes) {
    const source = Array.isArray(subModes) ? subModes : DEFAULT_SUB_MODES;
    const seen = new Set(DEFAULT_MODES);
    const out = [];
    for (const item of source) {
      const label = String(item && item.label ? item.label : '').trim();
      if (!label) continue;
      const parentMode = DEFAULT_MODES.includes(item && item.parentMode) ? item.parentMode : 'home';
      let id = String(item && item.id ? item.id : '').trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
      if (!id) id = `${parentMode}_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
      id = id.replace(/^_+|_+$/g, '');
      if (!id || DEFAULT_MODES.includes(id) || seen.has(id)) continue;
      seen.add(id);
      out.push({
        id,
        parentMode,
        label,
        icon: typeof item?.icon === 'string' ? item.icon : '',
        accentColor: typeof item?.accentColor === 'string' ? item.accentColor : '#60a5fa',
        imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
        ...this._normalizeSubModeAutoSettings(item)
      });
    }
    return out;
  }

  getAvailableModes() {
    return [...DEFAULT_MODES, ...this.getSubModes().map(item => item.id)];
  }

  getMainModeLabels() {
    const raw = this.homey.settings.get(SETTINGS_KEYS.MAIN_MODE_LABELS);
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    return Object.fromEntries(DEFAULT_MODES.map(mode => {
      const custom = typeof source[mode] === 'string' ? source[mode].trim() : '';
      return [mode, custom || this.homey.__(`mode.${mode}`) || mode];
    }));
  }

  async saveMainModeLabels(labels) {
    const source = labels && typeof labels === 'object' && !Array.isArray(labels) ? labels : {};
    const normalized = {};
    for (const mode of DEFAULT_MODES) {
      const label = typeof source[mode] === 'string' ? source[mode].trim().slice(0, 40) : '';
      if (label) normalized[mode] = label;
    }
    this.homey.settings.set(SETTINGS_KEYS.MAIN_MODE_LABELS, normalized);
    await this.refreshModeControllerDevices();
    return this.getMainModeLabels();
  }

  async refreshModeControllerDevices() {
    try {
      const driver = this.homey.drivers.getDriver('mode_controller');
      const devices = driver && typeof driver.getDevices === 'function' ? driver.getDevices() : [];
      await Promise.all(devices.map(device => typeof device.refreshModeOptions === 'function'
        ? device.refreshModeOptions()
        : Promise.resolve()));
    } catch (error) {
      this.error('Could not refresh Mode Controller labels', error);
    }
  }

  getModeLabel(mode) {
    const sub = this.getSubModes().find(item => item.id === mode);
    if (sub) return sub.label;
    if (DEFAULT_MODES.includes(mode)) return this.getMainModeLabels()[mode] || mode;
    return mode;
  }

  getCurrentMode() {
    return this.homey.settings.get(SETTINGS_KEYS.CURRENT_MODE) || 'home';
  }

  getParentMode(mode) {
    if (DEFAULT_MODES.includes(mode)) return mode;
    const subMode = this.getSubModes().find(item => item.id === mode);
    return subMode && DEFAULT_MODES.includes(subMode.parentMode) ? subMode.parentMode : mode;
  }

  getSubModesForParent(parentMode) {
    return this.getSubModes().filter(item => item.parentMode === parentMode);
  }

  _normalizeModeLightActions(actions) {
    if (!Array.isArray(actions)) return [];
    return actions.map(action => {
      const deviceId = typeof action?.deviceId === 'string' ? action.deviceId.trim() : '';
      if (!deviceId) return null;
      const on = action?.on !== false;
      const dim = this._numberOrNull(action?.dim);
      const lightTemperature = this._numberOrNull(action?.lightTemperature);
      const hue = this._numberOrNull(action?.hue);
      const saturation = this._numberOrNull(action?.saturation);
      const delaySeconds = Math.max(0, Math.min(86400, Number(action?.delaySeconds) || 0));
      const clamp01 = value => value === null ? null : Math.max(0, Math.min(1, value));
      return { deviceId, on, dim: clamp01(dim), lightTemperature: clamp01(lightTemperature), hue: clamp01(hue), saturation: clamp01(saturation), delaySeconds: Math.round(delaySeconds) };
    }).filter(Boolean);
  }

  async _applyLightProfile(deviceId, profile = {}) {
    const environment = await this.getEnvironment();
    const device = (environment.lightDevices || []).find(item => item.id === deviceId);
    if (!device) throw new Error('Light not found: ' + deviceId);
    const caps = new Set(device.capabilities || []);
    const on = profile.on !== false;
    if (caps.has('onoff')) await this._setDeviceCapabilityValue(deviceId, 'onoff', on);
    if (!on) return;
    if (profile.dim !== null && profile.dim !== undefined && caps.has('dim')) await this._setDeviceCapabilityValue(deviceId, 'dim', Math.max(0, Math.min(1, Number(profile.dim))));
    const wantsColor = profile.hue !== null && profile.hue !== undefined;
    const wantsTemperature = profile.lightTemperature !== null && profile.lightTemperature !== undefined;
    if (caps.has('light_mode')) {
      if (wantsColor) await this._setDeviceCapabilityValue(deviceId, 'light_mode', 'color');
      else if (wantsTemperature) await this._setDeviceCapabilityValue(deviceId, 'light_mode', 'temperature');
    }
    if (!wantsColor && wantsTemperature && caps.has('light_temperature')) await this._setDeviceCapabilityValue(deviceId, 'light_temperature', Math.max(0, Math.min(1, Number(profile.lightTemperature))));
    if (wantsColor && caps.has('light_hue')) await this._setDeviceCapabilityValue(deviceId, 'light_hue', Math.max(0, Math.min(1, Number(profile.hue))));
    if (profile.saturation !== null && profile.saturation !== undefined && caps.has('light_saturation')) await this._setDeviceCapabilityValue(deviceId, 'light_saturation', Math.max(0, Math.min(1, Number(profile.saturation))));
  }

  async _scheduleModeLightActions(mode, actions, results) {
    for (const action of this._normalizeModeLightActions(actions)) {
      const execute = async () => {
        if (this.getCurrentMode() !== mode) return;
        try {
          await this._applyLightProfile(action.deviceId, action);
          results.lights.push(action);
        } catch (error) {
          this.error(`Failed mode light action for ${action.deviceId}`, error);
          results.failed.push({ deviceId: action.deviceId, error: error.message });
        }
      };
      if (action.delaySeconds > 0) {
        const timer = setTimeout(async () => { this.modeDelayTimers.delete(timer); await execute(); }, action.delaySeconds * 1000);
        if (timer && typeof timer.unref === 'function') timer.unref();
        this.modeDelayTimers.add(timer);
      } else {
        await execute();
      }
    }
  }

  _normalizeModeDelayedActions(actions) {
    if (!Array.isArray(actions)) return [];
    return actions.map(action => {
      const deviceId = typeof action?.deviceId === 'string' ? action.deviceId.trim() : '';
      const target = action?.target === false || action?.action === 'off' ? false : true;
      const delaySeconds = Math.max(0, Math.min(86400, Number(action?.delaySeconds) || 0));
      if (!deviceId || delaySeconds <= 0) return null;
      return { deviceId, target, delaySeconds: Math.round(delaySeconds) };
    }).filter(Boolean);
  }

  _clearModeDelayTimers() {
    if (!(this.modeDelayTimers instanceof Set)) this.modeDelayTimers = new Set();
    for (const timer of this.modeDelayTimers) clearTimeout(timer);
    this.modeDelayTimers.clear();
  }

  _scheduleModeDelayedActions(mode, actions, results) {
    this._clearModeDelayTimers();
    for (const action of this._normalizeModeDelayedActions(actions)) {
      const timer = setTimeout(async () => {
        this.modeDelayTimers.delete(timer);
        if (this.getCurrentMode() !== mode) {
          this.log(`Skipped delayed mode action for ${action.deviceId}; mode is no longer ${mode}`);
          return;
        }
        try {
          await this._setSwitchTargetValue(action.deviceId, action.target);
          this.log(`Delayed mode action executed for ${action.deviceId}: ${action.target ? 'on' : 'off'} after ${action.delaySeconds}s`);
        } catch (error) {
          this.error(`Failed delayed mode action for ${action.deviceId}`, error);
        }
      }, action.delaySeconds * 1000);
      if (timer && typeof timer.unref === 'function') timer.unref();
      this.modeDelayTimers.add(timer);
      results.delayed.push(action);
    }
  }

  getModeRules() {
    const rules = this.homey.settings.get(SETTINGS_KEYS.MODE_RULES);
    if (!rules || typeof rules !== 'object') return this._createEmptyModeRules();

    const normalized = this._createEmptyModeRules();
    for (const mode of this.getAvailableModes()) {
      const existing = rules[mode] || {};
      normalized[mode] = {
        on: this._sanitizeDeviceIdList(existing.on),
        off: this._sanitizeDeviceIdList(existing.off),
        delayed: this._normalizeModeDelayedActions(existing.delayed),
        lights: this._normalizeModeLightActions(existing.lights),
      };
    }

    return normalized;
  }

  async saveModeRules(rules) {
    const normalized = this._createEmptyModeRules();
    for (const mode of this.getAvailableModes()) {
      const input = rules?.[mode] || {};
      normalized[mode] = {
        on: this._sanitizeDeviceIdList(input.on),
        off: this._sanitizeDeviceIdList(input.off),
        delayed: this._normalizeModeDelayedActions(input.delayed),
        lights: this._normalizeModeLightActions(input.lights),
      };
    }
    this.homey.settings.set(SETTINGS_KEYS.MODE_RULES, normalized);
    return normalized;
  }

  getContactCounterStatus() {
    const now = Date.now();
    return this.getZoneRules().filter(rule => rule.contactSequenceEnabled).map(rule => {
      const state = this.motionStateByRule.get(rule.id) || {};
      const startedAt = Number(state.contactSequenceStartedAt) || null;
      const resetSeconds = Number(rule.contactSequenceResetSeconds) || 0;
      const resetAt = startedAt && resetSeconds > 0 ? startedAt + resetSeconds * 1000 : null;
      return {
        ruleId: rule.id,
        name: rule.name || rule.id,
        event: rule.contactSequenceEvent === 'closed' ? 'closed' : 'open',
        count: Number(state.contactSequenceCount) || 0,
        target: Number(rule.contactSequenceCount) || 2,
        startedAt,
        resetAt,
        remainingSeconds: resetAt ? Math.max(0, Math.ceil((resetAt - now) / 1000)) : null,
        lastContactOpen: typeof state.wasContactOpen === 'boolean' ? state.wasContactOpen : null,
      };
    });
  }

  resetContactCounter(ruleId) {
    const state = this.motionStateByRule.get(ruleId) || {};
    this.motionStateByRule.set(ruleId, { ...state, contactSequenceCount: 0, contactSequenceStartedAt: null });
    return this.getContactCounterStatus().find(item => item.ruleId === ruleId) || null;
  }

  getZoneRules() {
    const rules = this.homey.settings.get(SETTINGS_KEYS.ZONE_RULES);
    if (!Array.isArray(rules)) return [];
    return rules.map(rule => this._normalizeZoneRule(rule)).filter(Boolean);
  }

  async saveZoneRules(rules) {
    const normalized = Array.isArray(rules)
      ? rules.map(rule => this._normalizeZoneRule(rule)).filter(Boolean)
      : [];
    this.homey.settings.set(SETTINGS_KEYS.ZONE_RULES, normalized);
    return normalized;
  }

  getTemperatureRules() {
    const rules = this.homey.settings.get(SETTINGS_KEYS.TEMPERATURE_RULES);
    if (!Array.isArray(rules)) return [];
    return rules.map(rule => this._normalizeTemperatureRule(rule)).filter(Boolean);
  }

  async saveTemperatureRules(rules) {
    const normalized = Array.isArray(rules)
      ? rules.map(rule => this._normalizeTemperatureRule(rule)).filter(Boolean)
      : [];
    this.homey.settings.set(SETTINGS_KEYS.TEMPERATURE_RULES, normalized);
    // Rebuild the window/contact baseline after editing rules. The next poll then
    // evaluates the actual contact state without carrying stale rule state.
    if (this.temperatureWindowStateByRule) this.temperatureWindowStateByRule.clear();
    return normalized;
  }

  getApplianceRules() {
    const rules = this.homey.settings.get(SETTINGS_KEYS.APPLIANCE_RULES);
    if (!Array.isArray(rules)) return [];
    return rules.map(rule => this._normalizeApplianceRule(rule)).filter(Boolean);
  }

  async saveApplianceRules(rules) {
    const normalized = Array.isArray(rules)
      ? rules.map(rule => this._normalizeApplianceRule(rule)).filter(Boolean)
      : [];
    this.homey.settings.set(SETTINGS_KEYS.APPLIANCE_RULES, normalized);
    return normalized;
  }

  getApplianceState() {
    const state = this.homey.settings.get(SETTINGS_KEYS.APPLIANCE_STATE);
    return state && typeof state === 'object' ? state : {};
  }


  getApplianceHistory() {
    const history = this.homey.settings.get(SETTINGS_KEYS.APPLIANCE_HISTORY);
    return history && typeof history === 'object' ? history : {};
  }

  getActivityRules() {
    const rules = this.homey.settings.get(SETTINGS_KEYS.ACTIVITY_RULES);
    if (!Array.isArray(rules)) return [];
    return rules.map(rule => this._normalizeActivityRule(rule)).filter(Boolean);
  }

  async saveActivityRules(rules) {
    const normalized = Array.isArray(rules) ? rules.map(rule => this._normalizeActivityRule(rule)).filter(Boolean) : [];
    this.homey.settings.set(SETTINGS_KEYS.ACTIVITY_RULES, normalized);
    return normalized;
  }

  getActivityState() {
    const state = this.homey.settings.get(SETTINGS_KEYS.ACTIVITY_STATE);
    return state && typeof state === 'object' ? state : {};
  }

  getActivityHistory() {
    const history = this.homey.settings.get(SETTINGS_KEYS.ACTIVITY_HISTORY);
    return history && typeof history === 'object' ? history : {};
  }

  getScheduleRules() {
    const rules = this.homey.settings.get(SETTINGS_KEYS.SCHEDULE_RULES);
    if (!Array.isArray(rules)) return [];
    return rules.map(rule => this._normalizeScheduleRule(rule)).filter(Boolean);
  }

  async saveScheduleRules(rules) {
    const normalized = Array.isArray(rules)
      ? rules.map(rule => this._normalizeScheduleRule(rule)).filter(Boolean)
      : [];
    this.homey.settings.set(SETTINGS_KEYS.SCHEDULE_RULES, normalized);
    return normalized;
  }

  getSwitchRules() {
    const rules = this.homey.settings.get(SETTINGS_KEYS.SWITCH_RULES);
    if (!Array.isArray(rules)) return [];
    return rules.map(rule => this._normalizeSwitchRule(rule)).filter(Boolean);
  }

  async saveSwitchRules(rules) {
    const normalized = Array.isArray(rules)
      ? rules.map(rule => this._normalizeSwitchRule(rule)).filter(Boolean)
      : [];
    this.homey.settings.set(SETTINGS_KEYS.SWITCH_RULES, normalized);
    this._rebuildSwitchCapabilityListeners().catch(error => this.error('Could not rebuild switch listeners after saving rules', error));
    return normalized;
  }

  async runSwitchRule(switchId, { source = 'manual' } = {}) {
    const rule = this.getSwitchRules().find(item => item.id === switchId);
    if (!rule) throw new Error('Unknown switch rule: ' + switchId);
    if (rule.enabled === false) return { ok: false, skipped: true, reason: 'disabled' };
    if (rule.actionType === 'set_mode') {
      await this.applyMode(rule.modeId || 'home', { source: 'switch:' + source });
    } else if (rule.actionType === 'run_zone_rules') {
      if (rule.zoneId) await this.runZoneRulesForZone(rule.zoneId, { source: 'switch:' + source });
    } else if (rule.actionType === 'devices_on' || rule.actionType === 'devices_off') {
      await this._applyDeviceAction(rule.deviceIds || [], rule.actionType === 'devices_on');
    } else if (rule.actionType === 'toggle_devices') {
      await this._toggleDeviceAction(rule.deviceIds || []);
    } else if (rule.actionType === 'dim_devices') {
      await this._applyDimAction(rule.deviceIds || [], rule.dimLevel);
    }
    await this.switchTriggeredTrigger.trigger({ switch: rule.name || rule.id, action: rule.actionType, source });
    return { ok: true, switchId: rule.id, actionType: rule.actionType };
  }

  getAutoModeSettings() {
    return this._normalizeAutoModeSettings(this.homey.settings.get(SETTINGS_KEYS.AUTO_MODE));
  }

  async saveAutoModeSettings(settings) {
    const normalized = this._normalizeAutoModeSettings(settings);
    this.homey.settings.set(SETTINGS_KEYS.AUTO_MODE, normalized);
    return normalized;
  }

  async applyMode(mode, { source = 'manual' } = {}) {
    if (!this.getAvailableModes().includes(mode)) throw new Error(`Unsupported mode: ${mode}`);

    const previousMode = this.getCurrentMode();
    const selectedRules = this.getModeRules()[mode] || { on: [], off: [], delayed: [], lights: [] };
    this._clearModeDelayTimers();
    const results = { turnedOn: [], turnedOff: [], delayed: [], lights: [], failed: [] };

    for (const deviceId of selectedRules.on) {
      try {
        await this._setSwitchTargetValue(deviceId, true);
        results.turnedOn.push(deviceId);
      } catch (error) {
        this.error(`Failed to turn on device ${deviceId}`, error);
        results.failed.push({ deviceId, target: true, error: error.message });
      }
    }

    for (const deviceId of selectedRules.off) {
      try {
        await this._setSwitchTargetValue(deviceId, false);
        results.turnedOff.push(deviceId);
      } catch (error) {
        this.error(`Failed to turn off device ${deviceId}`, error);
        results.failed.push({ deviceId, target: false, error: error.message });
      }
    }

    this.homey.settings.set(SETTINGS_KEYS.CURRENT_MODE, mode);
    this._scheduleModeDelayedActions(mode, selectedRules.delayed, results);
    await this._scheduleModeLightActions(mode, selectedRules.lights, results);
    if (previousMode !== mode) {
      this._createModeChangeTimelineNotification(mode, previousMode, source).catch(error => {
        this.error('Failed to create mode change timeline notification', error);
      });
    }
    await this.applyTemperatureRulesForCurrentMode({ source: 'mode-change' });
    await this._syncModeDevices(mode);
    await this._triggerModeChangedForControllers({ mode, previous_mode: previousMode, source });
    if (previousMode !== mode) {
      const resetIds = new Set(this.getZoneRules().filter(rule => rule.contactSequenceEnabled && rule.contactSequenceResetOnModeChange).map(rule => rule.id));
      for (const ruleId of resetIds) {
        const state = this.motionStateByRule.get(ruleId);
        if (state) this.motionStateByRule.set(ruleId, { ...state, contactSequenceCount: 0, contactSequenceStartedAt: null });
      }
    }
    await this.runZoneRulesForCurrentMode({ source: 'mode-change' });

    return { mode, previousMode, source, ...results };
  }

  async _triggerModeChangedForControllers(tokens) {
    let devices = [];
    try {
      const driver = this.homey.drivers.getDriver('mode_controller');
      devices = driver && typeof driver.getDevices === 'function' ? driver.getDevices() : [];
    } catch (error) {
      this.error('Could not load Mode Controller devices for mode_changed trigger', error);
      return;
    }

    await Promise.all(devices.map(async device => {
      try {
        await this.modeChangedTrigger.trigger(device, tokens);
      } catch (error) {
        this.error(`Could not trigger mode_changed for device ${device.getName?.() || device.getData?.().id || 'unknown'}`, error);
      }
    }));
  }

  async getEnvironment({ includeHomeyUsers = false, force = false } = {}) {
    const now = Date.now();
    if (!force && this.environmentCache && (now - this.environmentCacheTs) < ENV_CACHE_TTL_MS && (!includeHomeyUsers || this.environmentCache.homeyUsersLoaded)) {
      return this.environmentCache;
    }

    const [devicesRaw, zonesRaw, homeyUsers] = await Promise.all([
      this._getDevicesSafe(),
      this._getZonesSafeCached(),
      includeHomeyUsers ? this._getHomeyPresenceUsersSafe() : Promise.resolve([]),
    ]);

    const zones = Object.values(zonesRaw || {})
      .map(zone => ({ id: zone.id, name: zone.name || zone.id, parent: zone.parent || null }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    const zoneNameById = new Map(zones.map(zone => [zone.id, zone.name]));

    const devices = Object.values(devicesRaw || {})
      .filter(device => device.driverUri !== `homey:app:${this.homey.manifest.id}`)
      .map(device => this._mapDevice(device, zoneNameById))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    const switchableDevices = devices.filter(device => device.capabilities.some(capabilityId => capabilityId === 'onoff' || capabilityId.startsWith('onoff.')));
    const switchTargets = [];
    for (const device of switchableDevices) {
      const onoffCapabilities = device.capabilities.filter(capabilityId => capabilityId === 'onoff' || capabilityId.startsWith('onoff.'));
      for (const capabilityId of onoffCapabilities) {
        let name = device.name;
        if (onoffCapabilities.length > 1 || capabilityId !== 'onoff') {
          const configuredTitle = String(device.capabilityTitles?.[capabilityId] || '').trim();
          const suffix = capabilityId === 'onoff' ? '' : capabilityId.slice('onoff.'.length);
          const fallbackTitle = capabilityId === 'onoff' ? 'Master' : (/^\d+$/.test(suffix) ? `Plug ${suffix}` : suffix.replace(/[_-]+/g, ' '));
          name = `${device.name} — ${configuredTitle || fallbackTitle || capabilityId}`;
        }
        switchTargets.push({ id: capabilityId === 'onoff' ? device.id : `${device.id}::${capabilityId}`, deviceId: device.id, capabilityId, name, zone: device.zone, zoneName: device.zoneName, class: device.class, available: device.available, value: device.capabilityValues?.[capabilityId] ?? null });
      }
    }

    const powerTargets = this._buildPowerTargets(devices);
    const energyTargets = this._buildEnergyTargets(devices);

    const environment = {
      zones,
      switchableDevices: devices.filter(device => device.capabilities.includes('onoff')),
      switchTargets,
      powerTargets,
      energyTargets,
      lightDevices: devices.filter(device => device.capabilities.includes('onoff') || device.capabilities.includes('dim')),
      switchInputDevices: devices.filter(device => this._isSwitchInputDevice(device)),
      motionDevices: devices.filter(device => device.capabilities.includes('alarm_motion')),
      contactDevices: devices.filter(device => device.capabilities.includes('alarm_contact')),
      presenceDevices: devices.filter(device => device.capabilities.includes('presence')),
      homeyUsers,
      nativePresenceUsers: homeyUsers,
      homeyUsersLoaded: includeHomeyUsers,
      sleepCandidateDevices: devices.filter(device => device.capabilities.some(cap => ['onoff', 'presence', 'alarm_motion', 'alarm_contact'].includes(cap))),
      luminanceDevices: devices.filter(device => device.capabilities.includes('measure_luminance')),
      thermostatDevices: devices.filter(device => device.capabilities.includes('target_temperature')),
      temperatureSensorDevices: devices.filter(device => device.capabilities.includes('measure_temperature')),
      humiditySensorDevices: devices.filter(device => device.capabilities.includes('measure_humidity')),
      weatherDevices: devices.filter(device => device.capabilities.includes('measure_temperature') && ['sensor', 'weather'].includes(device.class || 'sensor')), 
      powerDevices: devices.filter(device => device.capabilities.includes('measure_power')),
      // Endpoint-aware lists. Legacy powerDevices is kept for backwards compatibility.
      powerEndpoints: powerTargets,
      energyEndpoints: energyTargets,
      waterDevices: devices.filter(device => device.capabilities.includes('measure_water') || device.capabilities.includes('meter_water')),
      gasDevices: devices.filter(device => device.capabilities.includes('measure_gas') || device.capabilities.includes('meter_gas')),
      activityDevices: devices.filter(device => Array.isArray(device.capabilities) && device.capabilities.length),
      location: this._getHomeyLocation(),
    };

    environment.weather = await this._withTimeout(this._getHomeyWeatherSafe(environment.location), 3000, 'weather_read', {}, this._normalizeHomeyWeather(null, environment.location));

    this.environmentCache = environment;
    this.environmentCacheTs = now;
    return environment;
  }

  _getHomeyLocation() {
    const geo = this.homey && this.homey.geolocation ? this.homey.geolocation : {};
    const latitude = typeof geo.getLatitude === 'function' ? geo.getLatitude() : geo.latitude;
    const longitude = typeof geo.getLongitude === 'function' ? geo.getLongitude() : geo.longitude;
    return {
      latitude: typeof latitude === 'number' ? latitude : 52.0,
      longitude: typeof longitude === 'number' ? longitude : 5.0,
      timezone: this._getHomeyTimezone(),
    };
  }

  async _getHomeyWeatherSafe(location = {}) {
    // Gebruik de Homey API weather manager. De eerdere versie keek naar this.homey.weather,
    // maar die bestaat in de app SDK meestal niet. Daardoor viel de widget terug naar 'clear'.
    const attempts = [];

    try {
      if (!this.homeyApi) this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });
      if (this.homeyApi && this.homeyApi.weather && typeof this.homeyApi.weather.getWeather === 'function') {
        attempts.push(await this.homeyApi.weather.getWeather());
      }
    } catch (error) {
      this.error('Failed to read Homey weather via HomeyAPI weather.getWeather', error);
    }

    try {
      if (!attempts.length && this.homeyApi && this.homeyApi.weather && typeof this.homeyApi.weather.getState === 'function') {
        attempts.push(await this.homeyApi.weather.getState());
      }
    } catch (error) {
      this.error('Failed to read Homey weather via HomeyAPI weather.getState', error);
    }

    try {
      // Fallback voor omgevingen waar de manager wel via de interne API beschikbaar is.
      if (!attempts.length && this.homey && this.homey.api && typeof this.homey.api.get === 'function') {
        attempts.push(await this.homey.api.get('/manager/weather/weather'));
      }
    } catch (error) {
      this.error('Failed to read Homey weather via internal manager endpoint', error);
    }

    const weather = attempts.find(item => item && typeof item === 'object') || null;
    return this._normalizeHomeyWeather(weather, location);
  }

  _normalizeHomeyWeather(weather, location = {}) {
    const raw = weather && typeof weather === 'object' ? weather : {};
    const conditionText = String(
      raw.condition || raw.weather || raw.summary || raw.description || raw.icon || raw.state || raw.symbol || ''
    ).toLowerCase();
    const iconText = String(raw.icon || raw.iconId || raw.symbol || raw.weatherIcon || '').toLowerCase();
    const code = Number(raw.code ?? raw.weatherCode ?? raw.conditionCode ?? raw.id);
    const clouds = Number(raw.clouds ?? raw.cloudiness ?? raw.cloudCover);
    const precipitation = Number(raw.precipitation ?? raw.rain ?? raw.rainfall ?? raw.snow ?? raw.snowfall);
    let condition = 'clear';

    // Homey weather can return text, OpenWeather-style icons (01d..50n), or numeric weather codes.
    // Make the mapping generous, otherwise heavy cloud/04d falls back to clear and shows sun/moon.
    if (/thunder|storm|onweer|bliksem/.test(conditionText) || /^11/.test(iconText) || (code >= 200 && code < 300) || (code >= 95 && code <= 99)) condition = 'storm';
    else if (/snow|sneeuw|hail|hagel/.test(conditionText) || /^13/.test(iconText) || (code >= 600 && code < 700) || (code >= 71 && code <= 77)) condition = 'snow';
    else if (/rain|drizzle|regen|bui|shower/.test(conditionText) || /^09|^10/.test(iconText) || precipitation > 0 || (code >= 300 && code < 600) || (code >= 51 && code <= 67) || (code >= 80 && code <= 82)) condition = 'rain';
    else if (/fog|mist|nevel|haze/.test(conditionText) || /^50/.test(iconText) || (code >= 700 && code < 800) || code === 45 || code === 48) condition = 'fog';
    else if (/cloud|bewolkt|wolken|overcast/.test(conditionText) || /^02|^03|^04/.test(iconText) || (code >= 801 && code <= 804) || (code >= 1 && code <= 3) || clouds >= 20) condition = 'cloudy';

const timezone = location.timezone || this._getHomeyTimezone();
const localNow = this._getLocalDateParts(new Date(), timezone);

const hour = localNow.hours;
const isDay = hour >= 7 && hour < 18;
    return {
      source: raw && Object.keys(raw).length ? 'homey' : 'fallback',
      condition,
      isDay,
      temperature: Number.isFinite(Number(raw.temperature)) ? Number(raw.temperature) : null,
      rawCondition: conditionText,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
      },
      updatedAt: Date.now(),
    };
  }

  async getSwitchableDevices() {
    const environment = await this.getEnvironment();
    return environment.switchTargets || environment.switchableDevices;
  }

  _getZoneRuleLightActions(rule) {
    const normalized = this._normalizeModeLightActions(rule?.lights);
    if (normalized.length) return normalized;
    const ids = this._sanitizeDeviceIdList(rule?.lightDeviceIds);
    return ids.map(deviceId => ({
      deviceId,
      on: true,
      dim: this._numberOrNull(rule?.dimValue),
      lightTemperature: this._numberOrNull(rule?.lightTemperature),
      hue: rule?.lightColorEnabled === true ? this._numberInRange(rule?.lightHue, 0, 1, 0) : null,
      saturation: rule?.lightColorEnabled === true ? this._numberInRange(rule?.lightSaturation, 0, 1, 1) : null,
      delaySeconds: 0,
    }));
  }

  _getZoneRuleLightIds(rule) {
    const profileIds = this._getZoneRuleLightActions(rule).map(action => action.deviceId);
    return [...new Set(profileIds.length ? profileIds : this._sanitizeDeviceIdList(rule?.lightDeviceIds))];
  }

  async _applyZoneRuleLights(rule, activated = true) {
    const actions = this._getZoneRuleLightActions(rule);
    if (!activated) {
      return this.setZoneLights(rule.zoneId, false, { onlyDeviceIds: this._getZoneRuleLightIds(rule), includeSubzones: rule.includeSubzones });
    }
    if (actions.length === 0) {
      return this.setZoneLights(rule.zoneId, true, {
        dim: rule.dimValue,
        lightTemperature: rule.lightTemperature,
        hue: rule.lightColorEnabled ? rule.lightHue : null,
        saturation: rule.lightColorEnabled ? rule.lightSaturation : null,
        onlyDeviceIds: rule.lightDeviceIds,
        includeSubzones: rule.includeSubzones,
      });
    }
    const results = { changed: [], failed: [] };
    for (const action of actions) {
      const execute = async () => {
        const liveRule = this.getZoneRules().find(item => item.id === rule.id);
        if (!liveRule || !liveRule.enabled || !liveRule.modeIds.includes(this.getCurrentMode())) return;
        try {
          await this._applyLightProfile(action.deviceId, action);
          results.changed.push(action.deviceId);
        } catch (error) {
          this.error('Failed zone light action for ' + action.deviceId, error);
          results.failed.push({ deviceId: action.deviceId, error: error.message });
        }
      };
      if (action.delaySeconds > 0) {
        const timer = this.homey.setTimeout(execute, action.delaySeconds * 1000);
        if (timer && typeof timer.unref === 'function') timer.unref();
      } else {
        await execute();
      }
    }
    return results;
  }

  async setZoneLights(zoneId, value, { dim = null, lightTemperature = null, hue = null, saturation = null, onlyDeviceIds = null, includeSubzones = false } = {}) {
    const environment = await this.getEnvironment();
    const allowSet = Array.isArray(onlyDeviceIds) && onlyDeviceIds.length > 0 ? new Set(onlyDeviceIds) : null;
    const zoneIds = this._getZoneAndSubZoneIds(zoneId, environment.zones, includeSubzones);
    const lights = environment.lightDevices.filter(device => zoneIds.has(device.zone) && (!allowSet || allowSet.has(device.id)));
    const results = { changed: [], failed: [] };

    await Promise.all(lights.map(async light => {
      try {
        const profile = { on: value, dim, lightTemperature, hue, saturation };
        await this._applyLightProfile(light.id, profile);
        results.changed.push(light.id);
      } catch (error) {
        this.error('Failed to update light ' + light.id, error);
        results.failed.push({ deviceId: light.id, error: error.message });
      }
    }));
    return results;
  }



  async applyTemperatureRulesForCurrentMode({ source = 'manual', environment = null } = {}) {
    environment = environment || await this.getEnvironment({ force: true });
    const currentMode = this.getCurrentMode();
    const rules = this.getTemperatureRules().filter(rule => rule.enabled && Array.isArray(rule.modeIds) && rule.modeIds.includes(currentMode));
    const results = { changed: [], skipped: [], failed: [] };

    for (const rule of rules) {
      const zoneIds = this._getZoneAndSubZoneIds(rule.zoneId, environment.zones, rule.includeSubzones);
      const selectedThermostats = new Set(rule.thermostatDeviceIds || []);
      const thermostats = environment.thermostatDevices.filter(device =>
        zoneIds.has(device.zone) && (selectedThermostats.size === 0 || selectedThermostats.has(device.id))
      );

      const windowOpen = this._isTemperatureRuleWindowOpen(rule, environment, zoneIds);
      if (windowOpen && rule.windowMode === 'skip') {
        for (const device of thermostats) results.skipped.push({ deviceId: device.id, reason: 'window-open' });
        this.log('Temperature rule "' + rule.name + '" skipped because a window/contact is open');
        continue;
      }

      let targetTemperature = windowOpen && rule.windowMode === 'setback' ? rule.windowTemperature : rule.temperature;
      targetTemperature = this._applyWeatherTemperatureCorrection(rule, environment, targetTemperature);

      await Promise.all(thermostats.map(async device => {
        try {
          await this._setDeviceCapabilityValue(device.id, 'target_temperature', targetTemperature);
          results.changed.push(device.id);
        } catch (error) {
          this.error('Failed to set target temperature for ' + device.id, error);
          results.failed.push({ deviceId: device.id, error: error.message });
        }
      }));
    }

    return results;
  }

  _isTemperatureRuleWindowOpen(rule, environment, zoneIds) {
    if (!rule || !rule.windowMode || rule.windowMode === 'ignore') return false;
    const selectedContacts = new Set(rule.contactDeviceIds || []);
    const contactDevices = (environment.contactDevices || []).filter(device =>
      zoneIds.has(device.zone) && (selectedContacts.size === 0 || selectedContacts.has(device.id))
    );
    return contactDevices.some(device => device.contact === true);
  }

  _applyWeatherTemperatureCorrection(rule, environment, baseTemperature) {
    if (!rule || rule.smartWeatherEnabled !== true) return baseTemperature;
    const weatherDevice = (environment.weatherDevices || environment.temperatureSensorDevices || []).find(device => device.id === rule.weatherDeviceId);
    if (!weatherDevice) return baseTemperature;
    const outdoorTemperature = Number(weatherDevice.capabilityValues?.measure_temperature ?? weatherDevice.measureTemperature ?? weatherDevice.temperature);
    if (!Number.isFinite(outdoorTemperature)) return baseTemperature;

    let target = Number(baseTemperature);
    if (outdoorTemperature <= rule.weatherColdBelow) target += rule.weatherColdBoost;
    if (outdoorTemperature >= rule.weatherWarmAbove) target -= rule.weatherWarmReduce;

    const minTarget = Number.isFinite(rule.weatherMinTarget) ? rule.weatherMinTarget : 5;
    const maxTarget = Number.isFinite(rule.weatherMaxTarget) ? rule.weatherMaxTarget : 25;
    target = Math.max(minTarget, Math.min(maxTarget, target));
    return Math.round(target * 2) / 2;
  }

  async runZoneRulesForCurrentMode({ source = 'manual' } = {}) {
    const environment = await this.getEnvironment();
    const currentMode = this.getCurrentMode();
    const rules = this.getZoneRules().filter(rule => rule.enabled && rule.modeIds.includes(currentMode));

    for (const rule of rules) {
      await this._evaluateZoneRule(rule, environment, { source, force: true });
    }
  }

  async runZoneRulesForZone(zoneId, { source = 'manual' } = {}) {
    const environment = await this.getEnvironment();
    const currentMode = this.getCurrentMode();
    const rules = this.getZoneRules().filter(rule => rule.enabled && rule.modeIds.includes(currentMode) && (rule.zoneId === zoneId || (rule.includeSubzones && this._getZoneAndSubZoneIds(rule.zoneId, environment.zones, true).has(zoneId))));

    for (const rule of rules) {
      await this._evaluateZoneRule(rule, environment, { source, force: true });
    }
  }

  _startMotionPolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = setInterval(() => {
      this._pollMotionRules().catch(error => this.error('Motion polling failed', error));
    }, POLL_INTERVAL_MS);

    this._pollMotionRules().catch(error => this.error('Initial motion polling failed', error));
  }

  async _pollMotionRules() {
    if (this.polling) return;
    this.polling = true;
    try {
      const currentMode = this.getCurrentMode();
      const dynamicTemperatureRules = this.getTemperatureRules().filter(rule =>
        rule.enabled &&
        Array.isArray(rule.modeIds) &&
        rule.modeIds.includes(currentMode) &&
        rule.liveWindowContact === true &&
        rule.windowMode &&
        rule.windowMode !== 'ignore'
      );

      // Contact-driven temperature rules must see fresh alarm_contact values.
      // Only force a device refresh when such a rule is active, so normal polling
      // keeps using the existing environment cache.
      const environment = await this.getEnvironment({ force: dynamicTemperatureRules.length > 0 });
      const rules = this.getZoneRules().filter(rule => rule.enabled && rule.modeIds.includes(currentMode));

      for (const rule of rules) {
        await this._evaluateZoneRule(rule, environment, { source: 'poll' });
      }

      await this._pollTemperatureWindowRules(dynamicTemperatureRules, environment);
    } finally {
      this.polling = false;
    }
  }

  async _pollTemperatureWindowRules(rules, environment) {
    if (!this.temperatureWindowStateByRule) this.temperatureWindowStateByRule = new Map();
    const activeIds = new Set();
    let contactChanged = false;

    for (const rule of (rules || [])) {
      if (!rule || !rule.id) continue;
      activeIds.add(rule.id);
      const zoneIds = this._getZoneAndSubZoneIds(rule.zoneId, environment.zones, rule.includeSubzones);
      const windowOpen = this._isTemperatureRuleWindowOpen(rule, environment, zoneIds);
      const previous = this.temperatureWindowStateByRule.get(rule.id);
      this.temperatureWindowStateByRule.set(rule.id, windowOpen);

      // The first observation is also applied. This makes a rule correct directly
      // after app start or after editing while a window is already open.
      if (previous === undefined || previous !== windowOpen) {
        contactChanged = true;
        this.log('Temperature contact state changed for "' + rule.name + '": ' + (windowOpen ? 'open' : 'closed'));
      }
    }

    for (const ruleId of [...this.temperatureWindowStateByRule.keys()]) {
      if (!activeIds.has(ruleId)) this.temperatureWindowStateByRule.delete(ruleId);
    }

    if (contactChanged) {
      await this.applyTemperatureRulesForCurrentMode({ source: 'window-contact-change', environment });
    }
  }

  async _evaluateZoneRule(rule, environment, { source = 'poll', force = false } = {}) {
    const now = Date.now();
    const previous = this.motionStateByRule.get(rule.id) || {};
    const motionDevices = this._getRuleMotionDevices(rule, environment);
    const contactDevices = this._getRuleContactDevices(rule, environment);
    const motionActive = motionDevices.some(device => device.motion === true);
    const contactOpen = contactDevices.some(device => device.contact === true);
    const allContactsClosed = contactDevices.length > 0 && contactDevices.every(device => device.contact === false);
    const contactInverted = rule.invertContactLogic === true;
    const contactTurnOnState = contactInverted ? allContactsClosed : contactOpen;
    const contactTurnOffState = contactInverted ? contactOpen : allContactsClosed;
    const zoneName = environment.zones.find(zone => zone.id === rule.zoneId)?.name || rule.zoneId;

    let sequenceCount = Number(previous.contactSequenceCount) || 0;
    let sequenceStartedAt = Number(previous.contactSequenceStartedAt) || null;
    if (sequenceStartedAt && rule.contactSequenceResetSeconds > 0 && now - sequenceStartedAt >= rule.contactSequenceResetSeconds * 1000) {
      sequenceCount = 0;
      sequenceStartedAt = null;
    }
    const contactOpenedEdge = contactDevices.length > 0 && contactOpen === true && previous.wasContactOpen === false;
    const contactClosedEdge = contactDevices.length > 0 && contactOpen === false && previous.wasContactOpen === true;
    const sequenceEdge = rule.contactSequenceEvent === 'closed' ? contactClosedEdge : contactOpenedEdge;
    let sequenceTriggerOff = false;
    if (rule.contactSequenceEnabled && sequenceEdge) {
      if (!sequenceStartedAt) sequenceStartedAt = now;
      sequenceCount += 1;
      if (sequenceCount >= rule.contactSequenceCount) {
        sequenceTriggerOff = true;
        sequenceCount = 0;
        sequenceStartedAt = null;
      }
    }

    const next = {
      wasMotionActive: motionActive,
      wasContactOpen: contactOpen,
      wasContactTurnOnState: contactTurnOnState,
      lastMotionAt: previous.lastMotionAt || null,
      noMotionSince: previous.noMotionSince || null,
      offTriggeredForNoMotionSince: previous.offTriggeredForNoMotionSince || null,
      contactSequenceCount: sequenceCount,
      contactSequenceStartedAt: sequenceStartedAt,
    };

    if (motionActive) {
      next.lastMotionAt = now;
      next.noMotionSince = null;
      next.offTriggeredForNoMotionSince = null;

      if ((force || previous.wasMotionActive !== true) && rule.turnOnOnMotion && this._conditionsPass(rule, environment, now)) {
        await this._applyZoneRuleLights(rule, true);
        await this.zoneMotionStartedTrigger.trigger({ zone: zoneName, mode: this.getCurrentMode(), source });
      }
    } else {
      if (!next.noMotionSince) next.noMotionSince = now;

      const shouldTurnOff = rule.turnOffAfterNoMotion
        && rule.noMotionSeconds > 0
        && now - next.noMotionSince >= rule.noMotionSeconds * 1000
        && next.offTriggeredForNoMotionSince !== next.noMotionSince;

      if (shouldTurnOff) {
        await this._applyZoneRuleInactiveLights(rule, 'motion');
        next.offTriggeredForNoMotionSince = next.noMotionSince;
        await this.zoneNoMotionTrigger.trigger({ zone: zoneName, mode: this.getCurrentMode(), minutes: Math.round(rule.noMotionSeconds / 60), source });
      }
    }

    if (!sequenceTriggerOff && contactTurnOnState && rule.turnOnOnContact && this._conditionsPass(rule, environment, now)) {
      const selectedLights = this._getRuleLightDevices(rule, environment);
      const anySelectedLightOff = selectedLights.length === 0 || selectedLights.some(light => light.onoff !== true);
      const shouldTurnOnContact = force || previous.wasContactTurnOnState !== true || anySelectedLightOff;

      if (shouldTurnOnContact) {
        await this._applyZoneRuleLights(rule, true);
        this._scheduleContactRetries(rule, true, { source });
      }
    }

    if (contactTurnOffState && rule.turnOffWhenContactClosed) {
      const shouldTurnOffContact = force || previous.wasContactTurnOnState === true;

      if (shouldTurnOffContact) {
        await this._applyZoneRuleInactiveLights(rule, 'contact');
        this._scheduleContactRetries(rule, false, { source });
      }
    }

    if (sequenceTriggerOff) {
      await this._applyZoneRuleLights(rule, false);
      this._scheduleContactRetries(rule, false, { source });
      this.log(`Contact sequence completed for zone rule ${rule.name || rule.id}: lights off`);
    }

    this.motionStateByRule.set(rule.id, next);
  }

  _scheduleContactRetries(rule, turnOn, { source = 'poll' } = {}) {
    const baseKey = rule.id + ':contact:' + (turnOn ? 'on' : 'off');

    for (const [key, timer] of this.contactRetryTimers.entries()) {
      if (key.startsWith(baseKey + ':')) {
        clearTimeout(timer);
        this.contactRetryTimers.delete(key);
      }
    }

    CONTACT_RETRY_DELAYS_MS.forEach(delay => {
      const key = baseKey + ':' + delay;
      const timer = this.homey.setTimeout(async () => {
        this.contactRetryTimers.delete(key);
        try {
          await this._retryContactRule(rule.id, turnOn, source);
        } catch (error) {
          this.error('Contact retry failed for rule ' + rule.id, error);
        }
      }, delay);
      this.contactRetryTimers.set(key, timer);
    });
  }

  async _retryContactRule(ruleId, turnOn, source = 'poll') {
    const rule = this.getZoneRules().find(item => item.id === ruleId);
    if (!rule || !rule.enabled || !rule.modeIds.includes(this.getCurrentMode())) return;

    const environment = await this.getEnvironment();
    const contactDevices = this._getRuleContactDevices(rule, environment);
    if (contactDevices.length === 0) return;

    const contactOpen = contactDevices.some(device => device.contact === true);
    const allContactsClosed = contactDevices.every(device => device.contact === false);
    const contactInverted = rule.invertContactLogic === true;
    const contactTurnOnState = contactInverted ? allContactsClosed : contactOpen;
    const contactTurnOffState = contactInverted ? contactOpen : allContactsClosed;

    if (turnOn) {
      if (!contactTurnOnState || !rule.turnOnOnContact || !this._conditionsPass(rule, environment, Date.now())) return;

      const selectedLights = this._getRuleLightDevices(rule, environment);
      const anySelectedLightOff = selectedLights.length === 0 || selectedLights.some(light => light.onoff !== true);
      if (!anySelectedLightOff) return;

      await this._applyZoneRuleLights(rule, true);
      return;
    }

    if (!contactTurnOffState || !rule.turnOffWhenContactClosed) return;
    await this._applyZoneRuleInactiveLights(rule, 'contact');
  }

  _conditionsPass(rule, environment, now) {
    if (rule.timeEnabled && !this._isWithinTimeWindow(rule.timeFrom, rule.timeTo, now)) return false;

    if (rule.onlyIfLightsOff) {
      const selected = new Set(this._getZoneRuleLightIds(rule));
      const lights = environment.lightDevices.filter(device => selected.has(device.id));
      if (lights.some(light => light.onoff === true)) return false;
    }

    if (rule.onlyIfDark) {
      const luxDevices = environment.luminanceDevices.filter(device => rule.luxDeviceIds.includes(device.id));
      if (luxDevices.length === 0) return false;
      const isDark = luxDevices.some(device => typeof device.luminance === 'number' && device.luminance <= rule.luxBelow);
      if (!isDark) return false;
    }

    return true;
  }

  _isWithinTimeWindow(timeFrom, timeTo, now) {
    const from = this._minutesFromTime(timeFrom);
    const to = this._minutesFromTime(timeTo);
    if (from === null || to === null) return true;

    const date = new Date(now);
    const current = date.getHours() * 60 + date.getMinutes();
    if (from === to) return true;
    if (from < to) return current >= from && current <= to;
    return current >= from || current <= to;
  }

  _minutesFromTime(value) {
    const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  }


  async _applyZoneRuleInactiveLights(rule, reason = 'sensor') {
    const actions = this._normalizeModeLightActions(rule?.deactivationLights);
    if (actions.length === 0) {
      return this._applyZoneRuleLights(rule, false);
    }

    const results = { changed: [], failed: [] };
    for (const action of actions) {
      const execute = async () => {
        const liveRule = this.getZoneRules().find(item => item.id === rule.id);
        if (!liveRule || !liveRule.enabled || !liveRule.modeIds.includes(this.getCurrentMode())) return;

        // Do not execute a delayed inactive profile when the sensor has become active again.
        const environment = await this.getEnvironment();
        if (reason === 'motion') {
          const motionDevices = this._getRuleMotionDevices(liveRule, environment);
          if (motionDevices.some(device => device.motion === true)) return;
        } else if (reason === 'contact') {
          const contactDevices = this._getRuleContactDevices(liveRule, environment);
          if (contactDevices.length === 0) return;
          const contactOpen = contactDevices.some(device => device.contact === true);
          const allContactsClosed = contactDevices.every(device => device.contact === false);
          const inactive = liveRule.invertContactLogic === true ? contactOpen : allContactsClosed;
          if (!inactive) return;
        }

        try {
          await this._applyLightProfile(action.deviceId, action);
          results.changed.push(action.deviceId);
        } catch (error) {
          this.error('Failed zone inactive light action for ' + action.deviceId, error);
          results.failed.push({ deviceId: action.deviceId, error: error.message });
        }
      };

      if (action.delaySeconds > 0) {
        const timer = this.homey.setTimeout(execute, action.delaySeconds * 1000);
        if (timer && typeof timer.unref === 'function') timer.unref();
      } else {
        await execute();
      }
    }
    return results;
  }

  _getRuleMotionDevices(rule, environment) {
    const selected = new Set(rule.motionDeviceIds || []);
    const zoneIds = this._getZoneAndSubZoneIds(rule.zoneId, environment.zones, rule.includeSubzones);
    return environment.motionDevices.filter(device => zoneIds.has(device.zone) && selected.has(device.id));
  }

  _getRuleContactDevices(rule, environment) {
    const selected = new Set(rule.contactDeviceIds || []);
    const zoneIds = this._getZoneAndSubZoneIds(rule.zoneId, environment.zones, rule.includeSubzones);
    return environment.contactDevices.filter(device => zoneIds.has(device.zone) && selected.has(device.id));
  }

  _getRuleLightDevices(rule, environment) {
    const selected = new Set(this._getZoneRuleLightIds(rule));
    const zoneIds = this._getZoneAndSubZoneIds(rule.zoneId, environment.zones, rule.includeSubzones);
    return environment.lightDevices.filter(device => zoneIds.has(device.zone) && (selected.size === 0 || selected.has(device.id)));
  }

  _getZoneAndSubZoneIds(zoneId, zones, includeSubzones = false) {
    const ids = new Set();
    if (!zoneId) return ids;
    ids.add(zoneId);
    if (!includeSubzones) return ids;
    let changed = true;
    while (changed) {
      changed = false;
      for (const zone of zones || []) {
        if (zone.parent && ids.has(zone.parent) && !ids.has(zone.id)) {
          ids.add(zone.id);
          changed = true;
        }
      }
    }
    return ids;
  }

  async _getDevicesSafe() {
    try {
      if (!this.homeyApi) this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });
      return await this.homeyApi.devices.getDevices();
    } catch (error) {
      this.error('Could not load Homey devices', error);
    }
    return {};
  }

  _startSchedulerPolling() {
    if (this.schedulerTimer) clearInterval(this.schedulerTimer);
    this.schedulerTimer = setInterval(() => {
      this._pollScheduleAndAutoMode().catch(error => this.error('Scheduler polling failed', error));
    }, SCHEDULER_INTERVAL_MS);
    this._pollScheduleAndAutoMode().catch(error => this.error('Initial scheduler polling failed', error));
  }

  async _pollScheduleAndAutoMode() {
    if (this.schedulerPolling) return;
    this.schedulerPolling = true;
    try {
      const autoSettings = this.getAutoModeSettings();
      const environment = await this.getEnvironment({ includeHomeyUsers: autoSettings.enabled && ['homey', 'both'].includes(autoSettings.presenceSource) });
      const now = new Date();
      await this._evaluateScheduleRules(environment, now);
      await this._evaluateAutoMode(environment, now);
    } finally {
      this.schedulerPolling = false;
    }
  }

  async _evaluateScheduleRules(environment, now) {
    const rules = this.getScheduleRules().filter(rule => rule.enabled);
    if (rules.length === 0) return;
    const state = this.homey.settings.get(SETTINGS_KEYS.SCHEDULE_STATE) || {};
    let changedState = false;
    const currentMode = this.getCurrentMode();
    const timezone = (environment && environment.location && environment.location.timezone) || this._getHomeyTimezone();
    const localNow = this._getLocalDateParts(now, timezone);
    const dayIndex = localNow.dayIndex;
    const dateKey = localNow.dateKey;
    const currentMinutes = localNow.minutes;
    for (const rule of rules) {
      let pendingEntry = state[rule.id] || {};
      if (Array.isArray(pendingEntry.pendingLightActions) && pendingEntry.pendingLightActions.length) {
        const remainingLightActions = [];
        for (const pendingLight of pendingEntry.pendingLightActions) {
          if (Number(pendingLight?.dueAt) <= now.getTime()) {
            try { await this._applyLightProfile(pendingLight.deviceId, pendingLight); }
            catch (error) { this.error(`Failed scheduled light action for ${pendingLight?.deviceId || 'unknown'}`, error); }
          } else remainingLightActions.push(pendingLight);
        }
        if (remainingLightActions.length !== pendingEntry.pendingLightActions.length) {
          pendingEntry = { ...pendingEntry, pendingLightActions: remainingLightActions };
          state[rule.id] = pendingEntry;
          changedState = true;
        }
      }
      if (pendingEntry.autoOffAt && now.getTime() >= pendingEntry.autoOffAt) {
        await this._applyDeviceAction(rule.deviceIds, false);
        state[rule.id] = { ...pendingEntry, autoOffAt: null, autoOffRunAt: now.getTime() };
        changedState = true;
      }
      if (pendingEntry.autoOnAt && now.getTime() >= pendingEntry.autoOnAt) {
        await this._applyDeviceAction(rule.deviceIds, true);
        state[rule.id] = { ...pendingEntry, autoOnAt: null, autoOnRunAt: now.getTime() };
        changedState = true;
      }
      if (rule.modeIds.length > 0 && !rule.modeIds.includes(currentMode)) continue;
      if (rule.days.length > 0 && !rule.days.includes(dayIndex)) continue;
      if (!this._scheduleLuxConditionPasses(rule, environment)) continue;

      const entry = state[rule.id] || {};
      let targetMinutes = this._getScheduleTargetMinutes(rule, entry, dateKey, environment, now);
      if (rule.timeMode === 'random' && (entry.dateKey !== dateKey || typeof entry.targetMinutes !== 'number')) {
        state[rule.id] = { ...entry, dateKey, targetMinutes, lastRunKey: entry.lastRunKey || null };
        changedState = true;
      }
      if (typeof targetMinutes !== 'number') continue;
      const runKey = dateKey + ':' + targetMinutes + ':' + rule.action;
      const currentEntry = state[rule.id] || {};
      if (currentEntry.lastRunKey === runKey) continue;
      // Homey timers can drift a little, so do not rely on hitting the exact minute.
      // Run the schedule when the target time has passed, with a small same-day grace window.
      const graceMinutes = 10;
      if (currentMinutes < targetMinutes || currentMinutes > targetMinutes + graceMinutes) continue;
      const turnOn = rule.action === 'on';
      this.log(`Schedule '${rule.name}' runs at local ${dateKey} ${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')} (${timezone})`);
      await this._applyDeviceAction(rule.deviceIds, turnOn);
      const normalizedScheduleLights = this._normalizeModeLightActions(rule.lights);
      const pendingLightActions = Array.isArray(currentEntry.pendingLightActions) ? [...currentEntry.pendingLightActions] : [];
      for (const lightProfile of normalizedScheduleLights) {
        if (lightProfile.delaySeconds > 0) pendingLightActions.push({ ...lightProfile, dueAt: now.getTime() + (lightProfile.delaySeconds * 1000) });
        else { try { await this._applyLightProfile(lightProfile.deviceId, lightProfile); } catch (error) { this.error(`Failed scheduled light action for ${lightProfile.deviceId}`, error); } }
      }
      const autoOffAt = turnOn && rule.autoOffEnabled ? this._resolveFollowUpTimestamp(now, rule.autoOffMode, rule.autoOffAfterHours, rule.autoOffTime, rule.autoOffRandomFromHours, rule.autoOffRandomToHours, rule.autoOffRandomFromTime, rule.autoOffRandomToTime, timezone) : (currentEntry.autoOffAt || null);
      const autoOnAt = !turnOn && rule.autoOnEnabled ? this._resolveFollowUpTimestamp(now, rule.autoOnMode, rule.autoOnAfterHours, rule.autoOnTime, rule.autoOnRandomFromHours, rule.autoOnRandomToHours, rule.autoOnRandomFromTime, rule.autoOnRandomToTime, timezone) : (currentEntry.autoOnAt || null);
      state[rule.id] = { ...currentEntry, dateKey, targetMinutes, lastRunKey: runKey, autoOffAt, autoOnAt, pendingLightActions };
      changedState = true;
    }
    if (changedState) this.homey.settings.set(SETTINGS_KEYS.SCHEDULE_STATE, state);
  }

  _resolveFollowUpTimestamp(now, mode, afterHours, fixedTime, randomFromHours, randomToHours, randomFromTime, randomToTime, timezone = this._getHomeyTimezone()) {
    if (mode === 'time') {
      const minutes = this._minutesFromTime(this._normalizeTime(fixedTime, '23:00'));
      return this._nextLocalTimeTimestamp(now, minutes, timezone);
    }
    if (mode === 'random_time') {
      const minutes = this._randomMinutesBetween(
        this._minutesFromTime(this._normalizeTime(randomFromTime, '22:00')),
        this._minutesFromTime(this._normalizeTime(randomToTime, '23:30'))
      );
      return this._nextLocalTimeTimestamp(now, minutes, timezone);
    }
    if (mode === 'random_hours') {
      const from = this._numberInRange(randomFromHours, 0.1, 48, 0.5);
      const to = this._numberInRange(randomToHours, 0.1, 48, Math.max(from, 2));
      const min = Math.min(from, to);
      const max = Math.max(from, to);
      const hours = min + (Math.random() * (max - min));
      return now.getTime() + Math.round(hours * 3600000);
    }
    const hours = this._numberInRange(afterHours, 0.1, 48, 1);
    return now.getTime() + Math.round(hours * 3600000);
  }

  _getScheduleTargetMinutes(rule, entry, dateKey, environment, now) {
    if (rule.timeMode === 'random') {
      if (entry.dateKey !== dateKey || typeof entry.targetMinutes !== 'number') {
        return this._randomMinutesBetween(rule.randomFromMinutes, rule.randomToMinutes);
      }
      return entry.targetMinutes;
    }
    if (rule.timeMode === 'sunrise' || rule.timeMode === 'sunset') {
      const sun = this._calculateSunTimes(now, environment && environment.location);
      const base = rule.timeMode === 'sunrise' ? sun.sunriseMinutes : sun.sunsetMinutes;
      return this._wrapMinutes(base + (rule.sunOffsetMinutes || 0));
    }
    return rule.fixedMinutes;
  }

  _scheduleLuxConditionPasses(rule, environment) {
    if (rule.luxCondition !== true) return true;
    const zoneIds = this._getZoneAndSubZoneIds(rule.zoneId, environment.zones, rule.includeSubzones);
    const selectedLux = new Set(rule.luxDeviceIds || []);
    const luxDevices = (environment.luminanceDevices || []).filter(device =>
      zoneIds.has(device.zone) && (selectedLux.size === 0 || selectedLux.has(device.id))
    );
    if (!luxDevices.length) return false;
    const values = luxDevices.map(device => device.luminance).filter(value => typeof value === 'number');
    if (!values.length) return false;
    const threshold = rule.luxThreshold;
    if (rule.luxOperator === 'above') return values.some(value => value >= threshold);
    return values.some(value => value <= threshold);
  }

  _calculateSunTimes(date, location = {}) {
    const latitude = typeof location.latitude === 'number' ? location.latitude : 52.0;
    const longitude = typeof location.longitude === 'number' ? location.longitude : 5.0;
    const timezone = location.timezone || this._getHomeyTimezone();
    const local = this._getLocalDateParts(date, timezone);
    const localNoonUtc = this._localTimeToUtcTimestamp(local.year, local.month, local.day, 12 * 60, timezone);
    const localNoonDate = new Date(localNoonUtc);
    const rad = Math.PI / 180;
    const start = Date.UTC(localNoonDate.getUTCFullYear(), 0, 0);
    const day = Math.floor((localNoonUtc - start) / 86400000);
    const lngHour = longitude / 15;
    const calc = (isRise) => {
      const t = day + ((isRise ? 6 : 18) - lngHour) / 24;
      const M = (0.9856 * t) - 3.289;
      let L = M + (1.916 * Math.sin(rad * M)) + (0.020 * Math.sin(rad * 2 * M)) + 282.634;
      L = (L + 360) % 360;
      let RA = Math.atan(0.91764 * Math.tan(rad * L)) / rad;
      RA = (RA + 360) % 360;
      const Lquadrant = Math.floor(L / 90) * 90;
      const RAquadrant = Math.floor(RA / 90) * 90;
      RA = (RA + (Lquadrant - RAquadrant)) / 15;
      const sinDec = 0.39782 * Math.sin(rad * L);
      const cosDec = Math.cos(Math.asin(sinDec));
      const cosH = (Math.cos(rad * 90.833) - (sinDec * Math.sin(rad * latitude))) / (cosDec * Math.cos(rad * latitude));
      if (cosH > 1 || cosH < -1) return isRise ? 7 * 60 : 19 * 60;
      let H = isRise ? 360 - (Math.acos(cosH) / rad) : Math.acos(cosH) / rad;
      H = H / 15;
      const T = H + RA - (0.06571 * t) - 6.622;
      const UT = (T - lngHour + 24) % 24;
      const utc = Date.UTC(local.year, local.month - 1, local.day, 0, 0, 0, 0) + Math.round(UT * 60) * 60000;
      return this._getLocalDateParts(new Date(utc), timezone).minutes;
    };
    return { sunriseMinutes: calc(true), sunsetMinutes: calc(false) };
  }

  _getHomeyTimezone() {
    const clock = this.homey && this.homey.clock ? this.homey.clock : {};
    try {
      const timezone = typeof clock.getTimezone === 'function' ? clock.getTimezone() : clock.timezone;
      if (typeof timezone === 'string' && timezone) return timezone;
    } catch (error) {
      this.error('Could not read Homey timezone', error);
    }
    return 'Europe/Amsterdam';
  }

  _getLocalDateParts(date = new Date(), timezone = this._getHomeyTimezone()) {
    const d = date instanceof Date ? date : new Date(date);
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone || 'Europe/Amsterdam',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', weekday: 'short',
        hourCycle: 'h23',
      }).formatToParts(d).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {});
      const year = Number(parts.year);
      const month = Number(parts.month);
      const day = Number(parts.day);
      const hours = Number(parts.hour);
      const minutesOnly = Number(parts.minute);
      const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      const dayIndex = weekdayMap[parts.weekday] ?? new Date(Date.UTC(year, month - 1, day)).getUTCDay();
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { year, month, day, hours, minutesOnly, minutes: hours * 60 + minutesOnly, dayIndex, dateKey };
    } catch (error) {
      this.error('Could not format local Homey time, falling back to runtime timezone', error);
      const fallback = new Date(d);
      const year = fallback.getFullYear();
      const month = fallback.getMonth() + 1;
      const day = fallback.getDate();
      return {
        year, month, day,
        hours: fallback.getHours(),
        minutesOnly: fallback.getMinutes(),
        minutes: fallback.getHours() * 60 + fallback.getMinutes(),
        dayIndex: fallback.getDay(),
        dateKey: this._dateKey(fallback),
      };
    }
  }


  getClockInfo() {
    const now = new Date();
    const timezone = this._getHomeyTimezone();
    const parts = this._getLocalDateParts(now, timezone);
    const localTime = `${parts.dateKey} ${String(parts.hours).padStart(2, '0')}:${String(parts.minutesOnly).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    return {
      iso: now.toISOString(),
      timezone,
      localTime,
      dateKey: parts.dateKey,
      minutes: parts.minutes,
      runtimeOffsetMinutes: -now.getTimezoneOffset(),
    };
  }

  _localTimeToUtcTimestamp(year, month, day, minutes, timezone = this._getHomeyTimezone()) {
    const utcGuess = Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60, 0, 0);
    const localAtGuess = this._getLocalDateParts(new Date(utcGuess), timezone);
    const wanted = Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60, 0, 0);
    const got = Date.UTC(localAtGuess.year, localAtGuess.month - 1, localAtGuess.day, localAtGuess.hours, localAtGuess.minutesOnly, 0, 0);
    return utcGuess + (wanted - got);
  }

  _nextLocalTimeTimestamp(now, minutes, timezone = this._getHomeyTimezone()) {
    const local = this._getLocalDateParts(now, timezone);
    let target = this._localTimeToUtcTimestamp(local.year, local.month, local.day, minutes, timezone);
    if (target <= now.getTime()) {
      target += 86400000;
      const nextLocal = this._getLocalDateParts(new Date(target), timezone);
      target = this._localTimeToUtcTimestamp(nextLocal.year, nextLocal.month, nextLocal.day, minutes, timezone);
    }
    return target;
  }

  _wrapMinutes(minutes) {
    const value = Math.round(Number(minutes));
    if (!Number.isFinite(value)) return null;
    return ((value % 1440) + 1440) % 1440;
  }  async _evaluateAutoMode(environment, now) {
    const settings = this.getAutoModeSettings();
    if (!settings.enabled) return;

    const people = this._getAutoModePeople(environment, settings);
    if (people.length === 0) return;

    const homePeople = people.filter(person => person.present === true);
    const currentMode = this.getCurrentMode();
    const currentParentMode = this.getParentMode(currentMode);
    const autoState = this.homey.settings.get(SETTINGS_KEYS.AUTO_STATE) || {};
    const nowMs = now.getTime();
    let changedState = false;

    if (homePeople.length === 0) {
      if (!autoState.awaySince) { autoState.awaySince = nowMs; changedState = true; }
      const awayHours = (nowMs - autoState.awaySince) / 3600000;
      if (settings.vacationAfterHours > 0 && awayHours >= settings.vacationAfterHours && currentParentMode !== 'vacation') {
        await this.applyMode('vacation', { source: 'auto-vacation' });
      } else if (currentParentMode !== 'away' && currentParentMode !== 'vacation') {
        await this.applyMode('away', { source: 'auto-away' });
      }
    } else {
      if (autoState.awaySince) { autoState.awaySince = null; changedState = true; }

      const enoughPeopleHome = homePeople.length >= settings.minPeopleHome;
      const selectedHomeyUsers = homePeople.filter(person => person.source === 'homey' && typeof person.asleep === 'boolean');
      const allSelectedHomeyUsersAsleep = selectedHomeyUsers.length > 0 && selectedHomeyUsers.every(person => person.asleep === true);
      const sleepSignals = this._getSleepSignals(environment, settings);
      if (allSelectedHomeyUsersAsleep) sleepSignals.push(true);
      const sleepSignalsMatch = sleepSignals.length > 0 && (settings.sleepRequireAll ? sleepSignals.every(Boolean) : sleepSignals.some(Boolean));
      const everyoneHomeIsSleeping = settings.enableSleepMode && enoughPeopleHome && sleepSignalsMatch;
      const someoneHomeyUserAwake = selectedHomeyUsers.some(person => person.asleep === false);
      const someoneHomeIsAwake = enoughPeopleHome && (someoneHomeyUserAwake || !settings.enableSleepMode || !everyoneHomeIsSleeping);

      if (everyoneHomeIsSleeping && currentParentMode !== 'sleep') {
        await this.applyMode('sleep', { source: 'auto-sleep' });
      } else if (someoneHomeIsAwake && currentParentMode !== 'home' && (currentParentMode !== 'sleep' || settings.enableWakeHomeMode)) {
        await this.applyMode('home', { source: 'auto-home' });
      }
    }
    if (changedState) this.homey.settings.set(SETTINGS_KEYS.AUTO_STATE, autoState);
  }


  _getSleepSignals(environment, settings) {
    const signals = [];
    const byId = (list) => new Map((list || []).map(device => [device.id, device]));
    const motionById = byId(environment.motionDevices);
    const motionDevices = (settings.sleepMotionDeviceIds || []).map(id => motionById.get(id)).filter(Boolean);
    if (motionDevices.length) signals.push(motionDevices.every(device => device.motion === false));
    const contactById = byId(environment.contactDevices);
    const contactDevices = (settings.sleepContactDeviceIds || []).map(id => contactById.get(id)).filter(Boolean);
    if (contactDevices.length) signals.push(contactDevices.every(device => device.contact === false));
    const powerById = byId(environment.powerTargets || environment.powerEndpoints || environment.powerDevices);
    const powerRules = this._normalizeSleepPowerRules(settings);
    for (const rule of powerRules) {
      const device = powerById.get(rule.deviceId);
      if (!device || typeof device.measurePower !== 'number') {
        signals.push(false);
        continue;
      }
      signals.push(rule.operator === 'above' ? device.measurePower >= rule.watt : device.measurePower <= rule.watt);
    }
    return signals;
  }

  _getAutoModePeople(environment, settings) {
    const source = settings.presenceSource || 'devices';
    const people = [];

    if (source === 'devices' || source === 'both') {
      const devices = environment.presenceDevices.filter(device => settings.presenceDeviceIds.includes(device.id));
      for (const device of devices) {
        if (typeof device.presence !== 'boolean') continue;
        people.push({ id: `device:${device.id}`, name: device.name, source: 'device', present: device.presence, asleep: null });
      }
    }

    if (source === 'homey' || source === 'both') {
      const users = Array.isArray(environment.homeyUsers) ? environment.homeyUsers : [];
      const selectedIds = new Set(settings.homeyUserIds || []);
      const selectedUsers = selectedIds.size > 0 ? users.filter(user => selectedIds.has(user.id)) : users;
      for (const user of selectedUsers) {
        if (typeof user.present !== 'boolean') continue;
        people.push({ id: `homey:${user.id}`, name: user.name, source: 'homey', present: user.present, asleep: typeof user.asleep === 'boolean' ? user.asleep : null });
      }
    }

    return people;
  }

  async _applyDeviceAction(deviceIds, value) {
    for (const deviceId of this._sanitizeDeviceIdList(deviceIds)) {
      try {
        await this._setSwitchTargetValue(deviceId, value);
      } catch (error) {
        this.error(`Scheduled action failed for ${deviceId}`, error);
      }
    }
  }


  _startSwitchPolling() {
    if (this.switchTimer) clearInterval(this.switchTimer);
    this._rebuildSwitchCapabilityListeners().catch(error => this.error('Initial switch listener setup failed', error));
    this.switchTimer = setInterval(() => {
      // Polling remains as a fallback for devices that do not support realtime capability listeners.
      this._pollSwitchInputs().catch(error => this.error('Switch input polling failed', error));
    }, POLL_INTERVAL_MS);
    this._pollSwitchInputs().catch(error => this.error('Initial switch input polling failed', error));
  }

  _clearSwitchCapabilityListeners() {
    if (!this.switchCapabilityListeners) return;
    for (const listener of this.switchCapabilityListeners.values()) {
      try {
        if (listener && typeof listener.destroy === 'function') listener.destroy();
        else if (listener && typeof listener.unregister === 'function') listener.unregister();
      } catch (error) {
        this.error('Could not remove switch capability listener', error);
      }
    }
    this.switchCapabilityListeners.clear();
  }

  async _rebuildSwitchCapabilityListeners() {
    this._clearSwitchCapabilityListeners();
    const rules = this.getSwitchRules().filter(rule => rule.enabled !== false && rule.triggerDeviceId && rule.triggerEvent);
    if (!rules.length || !this.homeyApi || !this.homeyApi.devices) return;

    const byDevice = new Map();
    for (const rule of rules) {
      if (!byDevice.has(rule.triggerDeviceId)) byDevice.set(rule.triggerDeviceId, []);
      byDevice.get(rule.triggerDeviceId).push(rule);
    }

    for (const [deviceId, deviceRules] of byDevice.entries()) {
      let device;
      try {
        device = await this.homeyApi.devices.getDevice({ id: deviceId });
      } catch (error) {
        this.error('Could not load switch input device ' + deviceId, error);
        continue;
      }

      const capabilities = new Set();
      for (const rule of deviceRules) {
        for (const cap of this._capabilitiesForSwitchEvent(rule.triggerEvent, device)) capabilities.add(cap);
      }

      for (const capabilityId of capabilities) {
        if (!capabilityId || typeof device.makeCapabilityInstance !== 'function') continue;
        try {
          const key = deviceId + ':' + capabilityId;
          const instance = device.makeCapabilityInstance(capabilityId, async value => {
            try {
              await this._handleSwitchCapabilityEvent(deviceId, capabilityId, value);
            } catch (error) {
              this.error('Switch capability event failed for ' + key, error);
            }
          });
          this.switchCapabilityListeners.set(key, instance);
        } catch (error) {
          this.error('Could not listen to ' + deviceId + ' / ' + capabilityId, error);
        }
      }
    }
  }

  _capabilitiesForSwitchEvent(event, device) {
    const capabilities = Array.isArray(device?.capabilities) ? device.capabilities.map(String) : [];
    if (typeof event === 'string' && event.startsWith('cap:')) {
      const parts = event.split(':');
      return parts[1] ? [parts[1]] : [];
    }
    if (event === 'on' || event === 'off' || event === 'toggle') return capabilities.filter(cap => cap === 'onoff' || cap.startsWith('onoff.'));
    if (event === 'dim_changed' || event === 'dim_up' || event === 'dim_down') return capabilities.filter(cap => cap === 'dim' || cap.startsWith('dim.'));
    if (event === 'button_changed') return capabilities.filter(cap => cap.startsWith('button') || cap.includes('scene'));
    return [];
  }

  async _handleSwitchCapabilityEvent(deviceId, capabilityId, value) {
    const rules = this.getSwitchRules().filter(rule => rule.enabled !== false && rule.triggerDeviceId === deviceId);
    if (!rules.length) return;

    const stateKey = 'listener:' + deviceId;
    const previous = this.switchInputState.get(stateKey) || { values: {} };
    const current = {
      onoff: capabilityId === 'onoff' ? value : previous.onoff,
      dim: capabilityId === 'dim' && typeof value === 'number' ? value : previous.dim,
      button: previous.button,
      values: { ...(previous.values || {}), [capabilityId]: value },
    };
    const buttonCaps = Object.keys(current.values).filter(cap => cap.startsWith('button') || cap.includes('scene'));
    current.button = buttonCaps.map(cap => String(current.values[cap])).join('|');
    this.switchInputState.set(stateKey, current);

    for (const rule of rules) {
      if (this._matchesSwitchCapabilityEvent(rule.triggerEvent, capabilityId, value, current, previous)) {
        await this.runSwitchRule(rule.id, { source: 'button:' + deviceId });
      }
    }
  }

  _matchesSwitchCapabilityEvent(event, capabilityId, value, current, previous) {
    if (event === 'on') return (capabilityId === 'onoff' || capabilityId.startsWith('onoff.')) && value === true;
    if (event === 'off') return (capabilityId === 'onoff' || capabilityId.startsWith('onoff.')) && value === false;
    if (event === 'toggle') return capabilityId === 'onoff' || capabilityId.startsWith('onoff.');
    if (event === 'dim_changed') return capabilityId === 'dim' || capabilityId.startsWith('dim.');
    if (event === 'dim_up') return (capabilityId === 'dim' || capabilityId.startsWith('dim.')) && typeof value === 'number' && typeof previous.values?.[capabilityId] === 'number' && value > previous.values[capabilityId];
    if (event === 'dim_down') return (capabilityId === 'dim' || capabilityId.startsWith('dim.')) && typeof value === 'number' && typeof previous.values?.[capabilityId] === 'number' && value < previous.values[capabilityId];
    if (event === 'button_changed') return String(capabilityId).startsWith('button') || String(capabilityId).includes('scene');
    if (typeof event === 'string' && event.startsWith('cap:')) {
      const parts = event.split(':');
      const expected = parts.slice(2).join(':');
      const cap = parts[1];
      if (cap !== capabilityId) return false;
      if (expected === 'changed') return true;
      return String(value) === expected;
    }
    return false;
  }

  async _pollSwitchInputs() {
    const rules = this.getSwitchRules().filter(rule => rule.enabled !== false && rule.triggerDeviceId);
    if (!rules.length) return;
    const environment = await this.getEnvironment();
    const devicesById = new Map((environment.switchInputDevices || []).map(device => [device.id, device]));

    for (const rule of rules) {
      const device = devicesById.get(rule.triggerDeviceId);
      if (!device) continue;
      const snapshot = this._getSwitchInputSnapshot(device);
      const previous = this.switchInputState.get(rule.id);
      this.switchInputState.set(rule.id, snapshot);
      if (!previous) continue;
      if (this._matchesSwitchEvent(rule.triggerEvent, snapshot, previous)) {
        await this.runSwitchRule(rule.id, { source: 'device:' + (device.name || device.id) });
      }
    }
  }

  _isSwitchInputDevice(device) {
    const caps = Array.isArray(device.capabilities) ? device.capabilities : [];
    const cls = String(device.class || '').toLowerCase();
    const driverId = String(device.driverId || '').toLowerCase();
    const name = String(device.name || '').toLowerCase();

    // Keep the Switches tab focused on input devices: remotes, wall buttons,
    // scene controllers and button-capability devices. Do not include normal
    // lights, plugs or sensors just because they have onoff/dim.
    const hasButtonOrScene = caps.some(cap => String(cap).startsWith('button') || String(cap).includes('scene'));
    const hasPowerMeasurement = caps.some(cap => String(cap) === 'measure_power' || String(cap).startsWith('measure_power.') || String(cap) === 'meter_power' || String(cap).startsWith('meter_power.'));
    const onoffChannels = caps.filter(cap => String(cap) === 'onoff' || String(cap).startsWith('onoff.'));

    if (['remote', 'button', 'scene', 'other'].includes(cls) && hasButtonOrScene) {
      return true;
    }

    // v3.1.12 safety: multi-plugs/sockets must never become switch-input devices
    // merely because their driver/name contains words such as "switch". Since
    // v3.1.9 onoff.* capabilities are endpoint-aware, that old fallback could
    // otherwise turn a plug state change into a Mode & Switch trigger.
    if (!hasButtonOrScene && (cls === 'socket' || cls === 'plug' || (onoffChannels.length > 1 && hasPowerMeasurement))) {
      return false;
    }

    if (['remote', 'button', 'scene'].includes(cls)) {
      return true;
    }

    if (caps.some(cap => String(cap).startsWith('button') || String(cap).includes('scene'))) {
      return true;
    }

    // Fallback for common remotes that expose only onoff/dim but have a remote-like
    // driver/name. This catches many Hue, IKEA, Aqara and similar controllers.
    const remoteHints = ['remote', 'button', 'switch', 'dimmer', 'tap', 'scene', 'shortcut', 'wand', 'afstandsbediening', 'knop'];
    if ((caps.some(cap => cap === 'onoff' || String(cap).startsWith('onoff.')) || caps.some(cap => cap === 'dim' || String(cap).startsWith('dim.'))) && remoteHints.some(hint => driverId.includes(hint) || name.includes(hint))) {
      return true;
    }

    return false;
  }

  _getSwitchActionOptions(device) {
    const capabilities = Array.isArray(device.capabilities) ? device.capabilities : [];
    const capsObj = device.capabilitiesObj || {};
    const options = [];
    const add = (id, name) => { if (!options.some(option => option.id === id)) options.push({ id, name }); };

    if (capabilities.some(cap => cap === 'onoff' || String(cap).startsWith('onoff.'))) {
      add('on', 'Aan / on');
      add('off', 'Uit / off');
      add('toggle', 'Aan/uit verandert');
    }

    if (capabilities.some(cap => cap === 'dim' || String(cap).startsWith('dim.'))) {
      add('dim_up', 'Dimniveau omhoog');
      add('dim_down', 'Dimniveau omlaag');
      add('dim_changed', 'Dimniveau verandert');
    }

    for (const capability of capabilities) {
      const capId = String(capability);
      if (capId.startsWith('button') || capId.includes('scene')) {
        add('cap:' + capId + ':changed', capId + ' verandert');
        const value = capsObj[capId] ? capsObj[capId].value : undefined;
        if (value !== undefined && value !== null && String(value) !== '') {
          add('cap:' + capId + ':' + String(value), capId + ' = ' + String(value));
        }
      }
    }

    // Keep the old generic option for existing rules.
    if (capabilities.some(capability => String(capability).startsWith('button') || String(capability).includes('scene'))) {
      add('button_changed', 'Knop/scène verandert');
    }

    return options;
  }

  _getSwitchInputSnapshot(device) {
    const values = device.capabilityValues || {};
    const capabilities = Array.isArray(device.capabilities) ? device.capabilities : [];
    const all = {};
    for (const capability of capabilities) {
      const capId = String(capability);
      if (capId === 'onoff' || capId.startsWith('onoff.') || capId === 'dim' || capId.startsWith('dim.') || capId.startsWith('button') || capId.includes('scene')) {
        all[capId] = values[capId];
      }
    }
    const buttonCaps = capabilities.filter(cap => String(cap).startsWith('button') || String(cap).includes('scene'));
    return {
      onoff: values.onoff,
      dim: typeof values.dim === 'number' ? values.dim : null,
      button: buttonCaps.map(cap => String(values[cap])).join('|'),
      values: all,
    };
  }

  _matchesSwitchEvent(event, current, previous) {
    if (event === 'on') return previous.onoff !== true && current.onoff === true;
    if (event === 'off') return previous.onoff !== false && current.onoff === false;
    if (event === 'toggle') return current.onoff !== previous.onoff;
    if (event === 'dim_changed') return typeof current.dim === 'number' && current.dim !== previous.dim;
    if (event === 'dim_up') return typeof current.dim === 'number' && typeof previous.dim === 'number' && current.dim > previous.dim;
    if (event === 'dim_down') return typeof current.dim === 'number' && typeof previous.dim === 'number' && current.dim < previous.dim;
    if (event === 'button_changed') return current.button !== previous.button;
    if (typeof event === 'string' && event.startsWith('cap:')) {
      const parts = event.split(':');
      const expected = parts.slice(2).join(':');
      const capability = parts[1];
      if (!capability) return false;
      const cur = current.values ? current.values[capability] : undefined;
      const prev = previous.values ? previous.values[capability] : undefined;
      if (expected === 'changed') return cur !== prev;
      return cur !== prev && String(cur) === expected;
    }
    return false;
  }

  async _toggleDeviceAction(deviceIds) {
    const environment = await this.getEnvironment();
    const byId = new Map((environment.switchTargets || environment.switchableDevices || []).map(target => [target.id, target]));
    await Promise.all(this._sanitizeDeviceIdList(deviceIds).map(async targetId => {
      const target = byId.get(targetId);
      const current = target ? target.value === true : false;
      try { await this._setSwitchTargetValue(targetId, !current); }
      catch (error) { this.error('Toggle action failed for ' + targetId, error); }
    }));
  }

  async _applyDimAction(deviceIds, level) {
    const dim = this._numberInRange(level, 0, 1, 0.5);
    const environment = await this.getEnvironment();
    const rawById = new Map((environment.activityDevices || []).map(device => [device.id, device]));
    await Promise.all(this._sanitizeDeviceIdList(deviceIds).map(async targetId => {
      try {
        const { deviceId, capabilityId } = this._parseSwitchTargetId(targetId);
        await this._setDeviceCapabilityValue(deviceId, capabilityId, true);
        const suffix = this._capabilitySuffix(capabilityId, 'onoff');
        const device = rawById.get(deviceId);
        const dimCapabilityId = suffix && device?.capabilities?.includes(`dim.${suffix}`) ? `dim.${suffix}` : 'dim';
        if (device?.capabilities?.includes(dimCapabilityId)) await this._setDeviceCapabilityValue(deviceId, dimCapabilityId, dim);
      } catch (error) {
        this.error('Dim action failed for ' + targetId, error);
      }
    }));
  }

  _isSleepDeviceActive(device) {
    if (device.onoff === true) return true;
    if (device.presence === true) return true;
    if (device.motion === true) return true;
    if (device.contact === true) return true;
    return false;
  }

  _randomMinutesBetween(from, to) {
    if (from === to) return from;
    if (from < to) return from + Math.floor(Math.random() * (to - from + 1));
    const firstLength = 1440 - from;
    const length = firstLength + to + 1;
    const offset = Math.floor(Math.random() * length);
    return offset < firstLength ? from + offset : offset - firstLength;
  }

  _dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async _getZonesSafeCached() {
    const now = Date.now();
    if (this.staticCache && this.staticCache.zones && (now - this.staticCacheTs) < STATIC_CACHE_TTL_MS) {
      return this.staticCache.zones;
    }
    try {
      if (!this.homeyApi) this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });
      const zones = await this.homeyApi.zones.getZones();
      this.staticCache = { ...(this.staticCache || {}), zones };
      this.staticCacheTs = now;
      return zones;
    } catch (error) {
      this.error('Could not load Homey zones', error);
    }
    return this.staticCache?.zones || {};
  }

  async _getHomeyPresenceUsersSafe() {
    try {
      if (!this.homeyApi) this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });
      if (!this.homeyApi.users || typeof this.homeyApi.users.getUsers !== 'function') return [];

      const usersRaw = await this.homeyApi.users.getUsers();
      const users = Object.values(usersRaw || {});
      const result = [];

      for (const user of users) {
        const id = user.id || user._id;
        if (!id) continue;
        const name = user.name || user.firstname || user.email || id;
        let present = this._booleanFromPresenceValue(user.present ?? user.presence ?? user.isPresent);
        let asleep = this._booleanFromPresenceValue(user.asleep ?? user.sleeping ?? user.isAsleep);

        if (this.homeyApi.presence) {
          if (typeof this.homeyApi.presence.getPresent === 'function') {
            try { present = this._booleanFromPresenceValue(await this.homeyApi.presence.getPresent({ id })); } catch (error) { this.error(`Could not read present state for ${name}`, error); }
          }
          if (typeof this.homeyApi.presence.getAsleep === 'function') {
            try { asleep = this._booleanFromPresenceValue(await this.homeyApi.presence.getAsleep({ id })); } catch (error) { this.error(`Could not read asleep state for ${name}`, error); }
          }
        }

        result.push({ id, name, present, asleep, source: 'homey' });
      }

      return result;
    } catch (error) {
      this.error('Could not load Homey presence users', error);
      return [];
    }
  }

  _booleanFromPresenceValue(value) {
    if (typeof value === 'boolean') return value;
    if (value && typeof value === 'object') {
      if (typeof value.value === 'boolean') return value.value;
      if (typeof value.present === 'boolean') return value.present;
      if (typeof value.asleep === 'boolean') return value.asleep;
    }
    return null;
  }

  _mapDevice(device, zoneNameById) {
    const capabilities = Array.isArray(device.capabilities) ? device.capabilities : [];
    const cap = device.capabilitiesObj || {};
    return {
      id: device.id,
      name: device.name,
      zone: device.zone || null,
      zoneName: zoneNameById.get(device.zone) || 'Geen zone',
      class: device.class || null,
      driverId: device.driverId || null,
      icon: device.iconObj?.url || device.icon || null,
      capabilities,
      capabilityTitles: Object.fromEntries(capabilities.map(id => [id, (cap[id] && (cap[id].title || cap[id].name)) ? String(cap[id].title || cap[id].name) : ''])),
      available: device.available !== false,
      onoff: cap.onoff ? cap.onoff.value : null,
      dim: cap.dim ? cap.dim.value : null,
      capabilityValues: Object.fromEntries(capabilities.map(id => [id, cap[id] ? cap[id].value : null])),
      switchActions: this._getSwitchActionOptions({ capabilities, capabilitiesObj: cap }),
      motion: cap.alarm_motion ? cap.alarm_motion.value : null,
      contact: cap.alarm_contact ? cap.alarm_contact.value : null,
      presence: cap.presence ? cap.presence.value : null,
      luminance: cap.measure_luminance ? cap.measure_luminance.value : null,
      measureTemperature: cap.measure_temperature ? cap.measure_temperature.value : null,
      targetTemperature: cap.target_temperature ? cap.target_temperature.value : null,
      measurePower: cap.measure_power ? cap.measure_power.value : null,
      meterPower: cap.meter_power ? cap.meter_power.value : null,
      measureWater: cap.measure_water ? cap.measure_water.value : null,
      meterWater: cap.meter_water ? cap.meter_water.value : null,
      measureGas: cap.measure_gas ? cap.measure_gas.value : null,
      meterGas: cap.meter_gas ? cap.meter_gas.value : null,
    };
  }

  _invalidateEnvironmentCache() {
    this.environmentCache = null;
    this.environmentCacheTs = 0;
  }

  _parseSwitchTargetId(targetId) {
    const raw = typeof targetId === 'string' ? targetId.trim() : '';
    if (!raw) return { deviceId: '', capabilityId: 'onoff' };
    const marker = raw.indexOf('::');
    if (marker < 0) return { deviceId: raw, capabilityId: 'onoff' };
    return { deviceId: raw.slice(0, marker), capabilityId: raw.slice(marker + 2) || 'onoff' };
  }


  _capabilitySuffix(capabilityId, base) {
    if (capabilityId === base) return '';
    const prefix = base + '.';
    return typeof capabilityId === 'string' && capabilityId.startsWith(prefix) ? capabilityId.slice(prefix.length) : null;
  }

  _endpointTitle(device, capabilityIds, suffix, fallbackPrefix = 'Channel') {
    for (const capabilityId of capabilityIds) {
      const title = String(device.capabilityTitles?.[capabilityId] || '').trim();
      if (title) return title;
    }
    if (!suffix) return '';
    if (/^\d+$/.test(suffix)) return `${fallbackPrefix} ${suffix}`;
    return suffix.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  _buildPowerTargets(devices) {
    const targets = [];
    for (const device of devices || []) {
      const caps = Array.isArray(device.capabilities) ? device.capabilities : [];
      const measureCaps = caps.filter(id => this._capabilitySuffix(id, 'measure_power') !== null);
      const meterCaps = caps.filter(id => this._capabilitySuffix(id, 'meter_power') !== null);
      const suffixes = [...new Set(measureCaps.map(id => this._capabilitySuffix(id, 'measure_power')).filter(v => v !== null))];
      for (const suffix of suffixes) {
        const measureCapabilityId = suffix ? `measure_power.${suffix}` : 'measure_power';
        const meterCapabilityId = meterCaps.includes(suffix ? `meter_power.${suffix}` : 'meter_power') ? (suffix ? `meter_power.${suffix}` : 'meter_power') : '';
        const endpointId = suffix ? `${device.id}::${measureCapabilityId}` : device.id;
        const onoffCapabilityId = suffix && caps.includes(`onoff.${suffix}`) ? `onoff.${suffix}` : (!suffix && caps.includes('onoff') ? 'onoff' : '');
        const endpointTitle = this._endpointTitle(device, [onoffCapabilityId, measureCapabilityId, meterCapabilityId].filter(Boolean), suffix, 'Plug');
        targets.push({
          ...device,
          id: endpointId,
          deviceId: device.id,
          capabilityId: measureCapabilityId,
          measureCapabilityId,
          meterCapabilityId,
          name: endpointTitle ? `${device.name} — ${endpointTitle}` : device.name,
          capabilities: [measureCapabilityId].concat(meterCapabilityId ? [meterCapabilityId] : []),
          capabilityValues: {
            [measureCapabilityId]: device.capabilityValues?.[measureCapabilityId] ?? null,
            ...(meterCapabilityId ? { [meterCapabilityId]: device.capabilityValues?.[meterCapabilityId] ?? null } : {}),
          },
          measurePower: Number.isFinite(Number(device.capabilityValues?.[measureCapabilityId])) ? Number(device.capabilityValues[measureCapabilityId]) : null,
          meterPower: meterCapabilityId && Number.isFinite(Number(device.capabilityValues?.[meterCapabilityId])) ? Number(device.capabilityValues[meterCapabilityId]) : null,
        });
      }
    }
    return targets;
  }

  _buildEnergyTargets(devices) {
    const targets = [];
    for (const device of devices || []) {
      const caps = Array.isArray(device.capabilities) ? device.capabilities : [];
      const measureCaps = caps.filter(id => this._capabilitySuffix(id, 'measure_power') !== null);
      const meterCaps = caps.filter(id => this._capabilitySuffix(id, 'meter_power') !== null);
      const suffixes = [...new Set(measureCaps.concat(meterCaps).map(id => id.startsWith('measure_power') ? this._capabilitySuffix(id, 'measure_power') : this._capabilitySuffix(id, 'meter_power')).filter(v => v !== null))];
      for (const suffix of suffixes) {
        const measureCapabilityId = measureCaps.includes(suffix ? `measure_power.${suffix}` : 'measure_power') ? (suffix ? `measure_power.${suffix}` : 'measure_power') : '';
        const meterCapabilityId = meterCaps.includes(suffix ? `meter_power.${suffix}` : 'meter_power') ? (suffix ? `meter_power.${suffix}` : 'meter_power') : '';
        const primaryCapabilityId = measureCapabilityId || meterCapabilityId;
        if (!primaryCapabilityId) continue;
        const endpointId = suffix ? `${device.id}::${primaryCapabilityId}` : device.id;
        const onoffCapabilityId = suffix && caps.includes(`onoff.${suffix}`) ? `onoff.${suffix}` : (!suffix && caps.includes('onoff') ? 'onoff' : '');
        const endpointTitle = this._endpointTitle(device, [onoffCapabilityId, measureCapabilityId, meterCapabilityId].filter(Boolean), suffix, 'Plug');
        targets.push({
          ...device,
          id: endpointId,
          deviceId: device.id,
          capabilityId: primaryCapabilityId,
          measureCapabilityId,
          meterCapabilityId,
          name: endpointTitle ? `${device.name} — ${endpointTitle}` : device.name,
          capabilities: [measureCapabilityId, meterCapabilityId].filter(Boolean),
          capabilityValues: {
            ...(measureCapabilityId ? { [measureCapabilityId]: device.capabilityValues?.[measureCapabilityId] ?? null } : {}),
            ...(meterCapabilityId ? { [meterCapabilityId]: device.capabilityValues?.[meterCapabilityId] ?? null } : {}),
          },
          measurePower: measureCapabilityId && Number.isFinite(Number(device.capabilityValues?.[measureCapabilityId])) ? Number(device.capabilityValues[measureCapabilityId]) : null,
          meterPower: meterCapabilityId && Number.isFinite(Number(device.capabilityValues?.[meterCapabilityId])) ? Number(device.capabilityValues[meterCapabilityId]) : null,
        });
      }
    }
    return targets;
  }

  _metricValue(device, base) {
    if (!device) return null;
    const directProp = base === 'measure_power' ? device.measurePower : base === 'meter_power' ? device.meterPower : null;
    if (Number.isFinite(Number(directProp))) return Number(directProp);
    const caps = Array.isArray(device.capabilities) ? device.capabilities : [];
    const capabilityId = caps.find(id => id === base || id.startsWith(base + '.'));
    const value = capabilityId ? device.capabilityValues?.[capabilityId] : null;
    return Number.isFinite(Number(value)) ? Number(value) : null;
  }

  async _setSwitchTargetValue(targetId, value) {
    const { deviceId, capabilityId } = this._parseSwitchTargetId(targetId);
    if (!deviceId) throw new Error('Switch target has no device id');
    await this._setDeviceCapabilityValue(deviceId, capabilityId, value);
  }

  async _setDeviceCapabilityValue(deviceId, capabilityId, value) {
    if (!this.homeyApi) this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });

    if (this.homeyApi.devices && typeof this.homeyApi.devices.setCapabilityValue === 'function') {
      await this.homeyApi.devices.setCapabilityValue({ deviceId, capabilityId, value });
      this._invalidateEnvironmentCache();
      return;
    }

    const device = await this.homeyApi.devices.getDevice({ id: deviceId });
    if (!device) throw new Error('Device not found');

    if (typeof device.setCapabilityValue === 'function') {
      await device.setCapabilityValue({ capabilityId, value });
      this._invalidateEnvironmentCache();
      return;
    }

    throw new Error('HomeyAPI does not expose setCapabilityValue on this Homey version');
  }

  async _syncModeDevices(mode) {
    const driver = this.homey.drivers.getDriver('mode_controller');
    if (!driver) return;
    const modeDevices = typeof driver.getDevices === 'function' ? driver.getDevices() : [];
    await Promise.all((Array.isArray(modeDevices) ? modeDevices : []).map(device => device.syncMode(mode)));
  }

  async _createModeChangeTimelineNotification(mode, previousMode, source = 'manual') {
    const notifications = this.homey && this.homey.notifications;
    if (!notifications || typeof notifications.createNotification !== 'function') {
      this.log('Homey notifications are not available on this Homey version; skipping timeline notification.');
      return;
    }

    const previousLabel = this.getModeLabel(previousMode);
    const modeLabel = this.getModeLabel(mode);
    const sourceLabel = this._getSourceLabel(source);
    const excerpt = this._formatModeChangeNotification(previousLabel, modeLabel, sourceLabel);

    await notifications.createNotification({ excerpt });
  }

  _formatModeChangeNotification(previousLabel, modeLabel, sourceLabel) {
    const locale = this._getHomeyLanguage();
    if (locale === 'nl') {
      return `Modus gewijzigd: ${previousLabel} -> ${modeLabel} via ${sourceLabel}`;
    }
    return `Mode changed: ${previousLabel} -> ${modeLabel} by ${sourceLabel}`;
  }

  _getSourceLabel(source) {
    const locale = this._getHomeyLanguage();
    const labels = {
      nl: {
        manual: 'handmatig',
        flow: 'Flow',
        dashboard: 'dashboard',
        settings: 'instellingen',
        poll: 'automatisering',
        'mode-change': 'moduswijziging',
        'auto-vacation': 'automatische vakantiemodus',
        'auto-away': 'automatische afwezigheidsmodus',
        'auto-sleep': 'automatische slaapmodus',
        'auto-home': 'automatische thuismodus',
      },
      en: {
        manual: 'manual',
        flow: 'Flow',
        dashboard: 'dashboard',
        settings: 'settings',
        poll: 'automation',
        'mode-change': 'mode change',
        'auto-vacation': 'automatic vacation mode',
        'auto-away': 'automatic away mode',
        'auto-sleep': 'automatic sleep mode',
        'auto-home': 'automatic home mode',
      },
    };
    return (labels[locale] && labels[locale][source]) || source || labels[locale].manual;
  }

  _getHomeyLanguage() {
    try {
      const language = this.homey && this.homey.i18n && typeof this.homey.i18n.getLanguage === 'function'
        ? this.homey.i18n.getLanguage()
        : null;
      return String(language || '').toLowerCase().startsWith('nl') ? 'nl' : 'en';
    } catch (error) {
      return 'en';
    }
  }



  _startAppliancePolling() {
    if (this.applianceTimer) clearInterval(this.applianceTimer);
    this.applianceTimer = setInterval(() => {
      this._pollApplianceRules().catch(error => { this._recordCrashLog('appliance_polling_failed', error, { source: 'interval' }); this.error('Appliance polling failed', error); });
    }, APPLIANCE_INTERVAL_MS);

    this._pollApplianceRules().catch(error => { this._recordCrashLog('initial_appliance_polling_failed', error, { source: 'startup' }); this.error('Initial appliance polling failed', error); });
  }

  async _pollApplianceRules() {
    if (this.appliancePolling) {
      this._markDiagnostics('appliance_poll_skipped_overlap');
      return;
    }
    this.appliancePolling = true;
    const pollStartedAt = Date.now();
    this._markDiagnostics('appliance_poll_start');
    try {
      const rules = this.getApplianceRules().filter(rule => rule.enabled && rule.deviceId);
      const activityRules = this.getActivityRules().filter(rule => rule.enabled && rule.conditions.length);
      const subModeAutoRules = this.getSubModes().filter(rule => rule.autoEnabled && rule.autoDeviceId);
      if (!rules.length && !activityRules.length && !subModeAutoRules.length) return;

      const environmentStartedAt = Date.now();
      this._markDiagnostics('environment_read_start', { source: 'monitoring' });
      const environment = await this._withTimeout(
        this.getEnvironment({ force: false }),
        MONITORING_ENV_TIMEOUT_MS,
        'environment_read',
        { source: 'appliance_poll' },
        this.environmentCache || null
      );
      this._recordMonitoringPhase('environment_read', environmentStartedAt, {
        usedCacheFallback: !environment,
      });
      if (!environment) return;

      const deviceById = new Map(((environment.powerTargets || environment.powerEndpoints || environment.powerDevices) || []).map(device => [device.id, device]));
      const state = this.homey.settings.get(SETTINGS_KEYS.APPLIANCE_STATE) || {};
      const applianceHistory = this.getApplianceHistory();
      let historyChanged = false;
      let changed = false;
      const now = Date.now();

      const applianceStartedAt = Date.now();
      this._markDiagnostics('appliance_rules_start', { count: rules.length });
      for (const rule of rules) {
        try {
          const device = deviceById.get(rule.deviceId);
          if (!device || !Number.isFinite(Number(device.measurePower))) continue;
          const current = state[rule.id] || { status: 'idle', aboveSince: null, belowSince: null };
          const power = Number(device.measurePower);
          if (current.status === 'running') {
            const previousPower = typeof current.lastPower === 'number' ? current.lastPower : power;
            const lastEnergyUpdateAt = typeof current.lastEnergyUpdateAt === 'number'
              ? current.lastEnergyUpdateAt
              : (typeof current.startedAt === 'number' ? current.startedAt : now);
            const deltaMs = Math.max(0, now - lastEnergyUpdateAt);
            const liveMeterPower = Number.isFinite(Number(device.meterPower)) ? Number(device.meterPower) : null;
            if (liveMeterPower !== null && Number.isFinite(Number(current.meterStartKwh))) {
              current.energyKwh = Math.max(0, liveMeterPower - Number(current.meterStartKwh));
              changed = true;
            } else if (deltaMs > 0 && Number.isFinite(previousPower)) {
              current.energyKwh = Math.max(0, Number(current.energyKwh || 0) + (Math.max(0, previousPower) * deltaMs / 3600000000));
              changed = true;
            }
            current.lastEnergyUpdateAt = now;
            const runStartedAt = typeof current.runStartedAt === 'number'
              ? current.runStartedAt
              : (typeof current.aboveSince === 'number' ? current.aboveSince : (typeof current.startedAt === 'number' ? current.startedAt : now));
            current.durationMs = Math.max(0, now - runStartedAt);
          }
          if (current.status !== 'running') {
            if (current.status === 'ready') {
              const resetByActivity = this._shouldResetApplianceByActivity(rule, environment);
              const resetByTimer = rule.resetAfterReadySeconds > 0 && current.resetAt && now >= current.resetAt;
              const resetByNewRun = power >= rule.startThreshold;
              if (resetByActivity || resetByTimer || resetByNewRun) {
                current.status = 'idle';
                current.resetAt = null;
                current.readyReminderAt = null;
                current.aboveSince = null;
                current.belowSince = null;
                current.energyKwh = 0;
                current.finalEnergyKwh = null;
                current.durationMs = 0;
                current.finalDurationMs = null;
                current.lastEnergyUpdateAt = null;
                current.meterStartKwh = null;
                changed = true;
              } else if (rule.repeatReadyNotification === true && rule.readyReminderSeconds > 0 && now >= (current.readyReminderAt || 0)) {
                current.readyReminderAt = now + rule.readyReminderSeconds * 1000;
                changed = true;
                await this._withTimeout(this._createApplianceTimelineNotification(rule, device, 'reminder', power, current), 3000, 'appliance_reminder_flow', { applianceId: rule.id }, null);
              }
            }

            if (current.status !== 'ready') {
              if (power >= rule.startThreshold) {
                current.aboveSince = current.aboveSince || now;
                if ((now - current.aboveSince) >= rule.startDelaySeconds * 1000) {
                  current.status = 'running';
                  current.startedAt = now;
                  current.runStartedAt = current.aboveSince || now;
                  current.durationMs = Math.max(0, now - current.runStartedAt);
                  current.energyKwh = 0;
                  current.meterStartKwh = Number.isFinite(Number(device.meterPower)) ? Number(device.meterPower) : null;
                  current.lastEnergyUpdateAt = now;
                  current.belowSince = null;
                  current.readyReminderAt = null;
                  changed = true;
                  await this._withTimeout(this._createApplianceTimelineNotification(rule, device, 'started', power, current), 3000, 'appliance_started_flow', { applianceId: rule.id }, null);
                }
              } else {
                current.aboveSince = null;
              }
            }
          } else {
            if (power <= rule.readyThreshold) {
              current.belowSince = current.belowSince || now;
              if ((now - current.belowSince) >= rule.readyDelaySeconds * 1000) {
                current.status = 'ready';
                current.readyAt = now;
                current.finalEnergyKwh = Math.max(0, Number(current.energyKwh || 0));
                const runStartedAt = typeof current.runStartedAt === 'number'
                  ? current.runStartedAt
                  : (typeof current.aboveSince === 'number' ? current.aboveSince : (typeof current.startedAt === 'number' ? current.startedAt : now));
                current.durationMs = Math.max(0, now - runStartedAt);
                current.finalDurationMs = current.durationMs;
                const historyEntry = {
                  startTime: current.runStartedAt || current.startedAt || now,
                  endTime: now,
                  durationMs: current.finalDurationMs,
                  energyKwh: Math.round(current.finalEnergyKwh * 1000) / 1000,
                  averagePower: current.finalDurationMs > 0
                    ? Math.round((current.finalEnergyKwh * 3600000000) / current.finalDurationMs)
                    : null,
                };
                const entries = Array.isArray(applianceHistory[rule.id]) ? applianceHistory[rule.id] : [];
                applianceHistory[rule.id] = [historyEntry, ...entries].slice(0, rule.historyLimit || APPLIANCE_HISTORY_LIMIT);
                historyChanged = true;
                current.lastEnergyUpdateAt = null;
                current.aboveSince = null;
                current.readyReminderAt = rule.repeatReadyNotification === true && rule.readyReminderSeconds > 0
                  ? now + rule.readyReminderSeconds * 1000
                  : null;
                changed = true;
                await this._withTimeout(this._createApplianceTimelineNotification(rule, device, 'ready', power, current), 3000, 'appliance_ready_flow', { applianceId: rule.id }, null);
                current.resetAt = rule.resetAfterReadySeconds > 0 ? now + rule.resetAfterReadySeconds * 1000 : null;
              }
            } else {
              current.belowSince = null;
            }
          }
          current.lastPower = power;
          current.updatedAt = now;
          state[rule.id] = current;
        } catch (error) {
          this._recordCrashLog('appliance_rule_error', error, { applianceId: rule && rule.id, applianceName: rule && rule.name, deviceId: rule && rule.deviceId });
          this.error(`Appliance rule failed for ${rule && (rule.name || rule.id) || 'unknown appliance'}`, error);
        }
      }
      this._recordMonitoringPhase('appliance_rules', applianceStartedAt, { count: rules.length });

      if (changed || rules.length) {
        try {
          this.homey.settings.set(SETTINGS_KEYS.APPLIANCE_STATE, state);
          if (historyChanged) this.homey.settings.set(SETTINGS_KEYS.APPLIANCE_HISTORY, applianceHistory);
        } catch (error) {
          this._recordCrashLog('appliance_state_save_error', error, { changed });
          this.error('Could not save appliance state', error);
        }
      }

      const activityStartedAt = Date.now();
      this._markDiagnostics('activity_poll_start', { count: activityRules.length });
      await this._withTimeout(this._pollActivityRules(activityRules, environment, now), 8000, 'activity_poll', { count: activityRules.length }, null);
      this._recordMonitoringPhase('activity_poll', activityStartedAt, { count: activityRules.length });

      const subModeStartedAt = Date.now();
      this._markDiagnostics('submode_auto_start', { count: subModeAutoRules.length });
      await this._evaluateSubModeAutoRules(subModeAutoRules, environment, now);
      this._recordMonitoringPhase('submode_auto', subModeStartedAt, { count: subModeAutoRules.length });
    } catch (error) {
      // Never let monitoring errors escape the interval. Homey may restart the app
      // when an async polling error bubbles out without a clean JS crash log.
      this._recordCrashLog('appliance_poll_error', error, { source: 'poll', phase: 'appliance_activity_submode' });
      this.error('Monitoring poll failed but was contained', error);
    } finally {
      this._recordMonitoringPhase('appliance_poll', pollStartedAt);
      this.appliancePolling = false;
    }
  }


  async _evaluateSubModeAutoRules(subModeRules, environment, now) {
    const rules = Array.isArray(subModeRules) ? subModeRules : [];
    if (!rules.length) return;

    const startedAt = Date.now();
    const autoState = this.homey.settings.get(SETTINGS_KEYS.AUTO_STATE) || {};
    autoState.subModeAuto = autoState.subModeAuto && typeof autoState.subModeAuto === 'object' ? autoState.subModeAuto : {};
    const powerById = new Map(((environment.powerTargets || environment.powerEndpoints || environment.powerDevices) || []).map(device => [device.id, device]));
    const context = {
      currentMode: this.getCurrentMode(),
      currentParentMode: this.getParentMode(this.getCurrentMode()),
      powerById,
      autoState,
      now,
    };

    let changedState = false;
    let modeChanged = false;

    for (const rule of rules) {
      if (modeChanged) break;
      const ruleStartedAt = Date.now();
      const device = powerById.get(rule && rule.autoDeviceId);
      const ruleMeta = {
        id: rule && rule.id,
        name: rule && rule.label || rule && rule.name,
        parentMode: rule && rule.parentMode,
        deviceId: rule && rule.autoDeviceId,
        deviceName: device && device.name,
        capability: 'measure_power',
      };
      this._markDiagnostics('submode_auto_rule_start', ruleMeta);
      try {
        const result = await this._withTimeout(
          this._evaluateSingleSubModeAutoRule(rule, context),
          1200,
          'submode_auto_rule',
          ruleMeta,
          { changed: false, modeChanged: false, timeout: true }
        );
        if (result && result.changed) changedState = true;
        if (result && result.modeChanged) modeChanged = true;
        this._recordMonitoringPhase('submode_auto_rule', ruleStartedAt, { ...ruleMeta, changed: !!(result && result.changed), modeChanged: !!(result && result.modeChanged) });
      } catch (error) {
        this._recordCrashLog('submode_auto_rule_error', error, ruleMeta);
        this.error(`Submode auto rule failed for ${ruleMeta.name || ruleMeta.id || 'unknown submode'}`, error);
      }
    }

    if (changedState || rules.length) {
      try {
        this.homey.settings.set(SETTINGS_KEYS.AUTO_STATE, autoState);
      } catch (error) {
        this._recordCrashLog('submode_auto_state_save_error', error, { count: rules.length });
        this.error('Could not save submode auto state', error);
      }
    }

    this._recordMonitoringPhase('submode_auto_total', startedAt, { count: rules.length, modeChanged });
  }

  async _evaluateSingleSubModeAutoRule(rule, context) {
    if (!rule || !rule.id) return { changed: false, modeChanged: false };
    const { currentMode, currentParentMode, powerById, autoState, now } = context;
    const device = powerById.get(rule.autoDeviceId);
    const current = autoState.subModeAuto[rule.id] || { matchingSince: null, returnMatchingSince: null };
    const power = device && typeof device.measurePower === 'number' && Number.isFinite(Number(device.measurePower))
      ? Number(device.measurePower)
      : null;
    const matches = power !== null && (rule.autoOperator === 'below' ? power <= rule.autoWatt : power >= rule.autoWatt);
    const returnMatches = power !== null && (rule.autoReturnOperator === 'above' ? power >= rule.autoReturnWatt : power <= rule.autoReturnWatt);
    let changedState = false;

    if (currentMode === rule.id && rule.autoReturnEnabled === true) {
      if (returnMatches) {
        if (!current.returnMatchingSince) {
          current.returnMatchingSince = now;
          changedState = true;
        }
        const returnDelayMs = Math.max(0, Number(rule.autoReturnDelaySeconds || 0) * 1000);
        if ((now - current.returnMatchingSince) >= returnDelayMs) {
          current.matchingSince = null;
          current.returnMatchingSince = null;
          current.lastPower = power;
          current.updatedAt = now;
          autoState.subModeAuto[rule.id] = current;
          await this._withTimeout(
            this.applyMode(rule.parentMode, { source: 'auto-submode-return' }),
            2000,
            'submode_auto_apply_return',
            { id: rule.id, name: rule.label || rule.name, targetMode: rule.parentMode, deviceId: rule.autoDeviceId, deviceName: device && device.name },
            null
          );
          return { changed: true, modeChanged: true };
        }
      } else if (current.returnMatchingSince !== null) {
        current.returnMatchingSince = null;
        changedState = true;
      }
    } else if (current.returnMatchingSince !== null) {
      current.returnMatchingSince = null;
      changedState = true;
    }

    if (matches) {
      if (!current.matchingSince) {
        current.matchingSince = now;
        changedState = true;
      }
      const delayMs = Math.max(0, Number(rule.autoDelaySeconds || 0) * 1000);
      if (currentParentMode === rule.parentMode && currentMode !== rule.id && (now - current.matchingSince) >= delayMs) {
        current.returnMatchingSince = null;
        current.lastPower = power;
        current.updatedAt = now;
        autoState.subModeAuto[rule.id] = current;
        await this._withTimeout(
          this.applyMode(rule.id, { source: 'auto-submode' }),
          2000,
          'submode_auto_apply_mode',
          { id: rule.id, name: rule.label || rule.name, targetMode: rule.id, deviceId: rule.autoDeviceId, deviceName: device && device.name },
          null
        );
        return { changed: true, modeChanged: true };
      }
    } else if (current.matchingSince !== null) {
      current.matchingSince = null;
      changedState = true;
    }

    if (current.lastPower !== power) changedState = true;
    current.lastPower = power;
    current.updatedAt = now;
    autoState.subModeAuto[rule.id] = current;
    return { changed: changedState, modeChanged: false };
  }



  _normalizeActivityRule(rule) {
    if (!rule || typeof rule !== 'object') return null;
    const id = typeof rule.id === 'string' && rule.id ? rule.id : `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const conditions = Array.isArray(rule.conditions) ? rule.conditions.map(c => this._normalizeActivityCondition(c)).filter(Boolean) : [];
    return {
      id,
      name: typeof rule.name === 'string' && rule.name.trim() ? rule.name.trim() : 'Nieuwe activiteit',
      enabled: rule.enabled !== false,
      minConditions: Math.round(this._numberInRange(rule.minConditions, 1, Math.max(1, conditions.length || 1), Math.min(conditions.length || 1, Number(rule.minConditions || 1)))),
      historyLimit: Math.round(this._numberInRange(rule.historyLimit, 1, 50, ACTIVITY_HISTORY_LIMIT)),
      minHistoryDurationSeconds: Math.round(this._numberInRange(rule.minHistoryDurationSeconds, 0, 86400, Number(rule.minHistoryDurationSeconds || 0))),
      waterMeterDeviceId: typeof rule.waterMeterDeviceId === 'string' ? rule.waterMeterDeviceId : '',
      energyMeterDeviceId: typeof rule.energyMeterDeviceId === 'string' ? rule.energyMeterDeviceId : '',
      gasMeterDeviceId: typeof rule.gasMeterDeviceId === 'string' ? rule.gasMeterDeviceId : '',
      conditions,
    };
  }

  _normalizeActivityCondition(condition) {
    if (!condition || typeof condition !== 'object') return null;
    const type = ['power_above','water_above','gas_above','temperature_above','temperature_below','temperature_rising','temperature_falling','humidity_above','humidity_below','humidity_rising','humidity_falling','device_on','sensor_true','capability_above','capability_below','capability_equals','capability_custom','time_between','time_after','time_before','activity_status','zone_motion'].includes(condition.type) ? condition.type : 'power_above';
    return {
      id: typeof condition.id === 'string' && condition.id ? condition.id : `condition-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      deviceId: typeof condition.deviceId === 'string' ? condition.deviceId : '',
      activityId: typeof condition.activityId === 'string' ? condition.activityId : (condition.type === 'activity_status' && typeof condition.deviceId === 'string' ? condition.deviceId : ''),
      zoneId: typeof condition.zoneId === 'string' ? condition.zoneId : '',
      includeSubzones: condition.includeSubzones === true,
      status: ['active','inactive'].includes(condition.status) ? condition.status : ((condition.operator === 'false' || condition.value === false || String(condition.value).toLowerCase() === 'false') ? 'inactive' : 'active'),
      capabilityId: typeof condition.capabilityId === 'string' ? condition.capabilityId : this._defaultCapabilityForActivityType(type),
      threshold: this._numberInRange(condition.threshold, -1000000, 1000000, 0),
      delta: this._numberInRange(condition.delta, 0, 1000000, 1),
      windowSeconds: Math.round(this._numberInRange(condition.windowSeconds, 5, 86400, 300)),
      requiredActiveSeconds: Math.round(this._numberInRange(condition.requiredActiveSeconds, 0, 86400, Number(condition.requiredActiveSeconds || 0))),
      inactiveDelaySeconds: Math.round(this._numberInRange(condition.inactiveDelaySeconds, 0, 86400, Number(condition.inactiveDelaySeconds || 0))),
      requiredCondition: condition.requiredCondition === true || condition.conditionRequired === true || condition.required === true,
      conditionRequired: condition.requiredCondition === true || condition.conditionRequired === true || condition.required === true,
      required: condition.requiredCondition === true || condition.conditionRequired === true || condition.required === true,
      operator: ['above','above_or_equal','below','below_or_equal','equals','not_equals','contains','true','false'].includes(condition.operator) ? condition.operator : this._defaultOperatorForActivityType(type),
      value: condition.value === false ? false : (condition.value === true ? true : (typeof condition.value === 'string' || typeof condition.value === 'number' ? condition.value : true)),
      startTime: typeof condition.startTime === 'string' ? condition.startTime : (typeof condition.timeFrom === 'string' ? condition.timeFrom : '18:00'),
      endTime: typeof condition.endTime === 'string' ? condition.endTime : (typeof condition.timeTo === 'string' ? condition.timeTo : '20:00'),
    };
  }

  _defaultOperatorForActivityType(type) {
    if (type === 'capability_above') return 'above_or_equal';
    if (type === 'capability_below') return 'below_or_equal';
    if (type === 'capability_equals') return 'equals';
    if (type === 'sensor_true' || type === 'device_on' || type === 'activity_status' || type === 'zone_motion') return 'true';
    return 'above_or_equal';
  }

  _defaultCapabilityForActivityType(type) {
    if (type === 'power_above') return 'measure_power';
    if (type === 'water_above') return 'measure_water';
    if (type === 'gas_above') return 'measure_gas';
    if (type && type.startsWith('temperature_')) return 'measure_temperature';
    if (type && type.startsWith('humidity_')) return 'measure_humidity';
    if (type === 'device_on') return 'onoff';
    return '';
  }

  async _pollActivityRules(rules, environment, now) {
    if (!Array.isArray(rules) || !rules.length) return;
    const devices = new Map(((environment.activityDevices || [])
      .concat(environment.switchTargets || [], environment.powerTargets || environment.powerEndpoints || environment.powerDevices || [], environment.energyTargets || environment.energyEndpoints || [], environment.waterDevices || [], environment.gasDevices || [], environment.temperatureSensorDevices || [], environment.humiditySensorDevices || []))
      .filter(device => device && device.id)
      .map(device => [device.id, device]));
    const state = this.getActivityState();
    const history = this.getActivityHistory();
    let changed = false;

    for (const rule of rules) {
      try {
        this._markDiagnostics('activity_rule_start', { id: rule && rule.id, name: rule && rule.name });
        const conditions = Array.isArray(rule.conditions) ? rule.conditions : [];
        if (!conditions.length) continue;
        const current = state[rule.id] && typeof state[rule.id] === 'object' ? state[rule.id] : { status: 'standby' };
        const previousStatus = current.status === 'active' ? 'active' : 'standby';
        current.conditionSamples = current.conditionSamples && typeof current.conditionSamples === 'object' ? current.conditionSamples : {};

        const rawConditionResults = conditions.map(condition => {
          try {
            return this._evaluateActivityCondition(condition, devices, current, now, state, rule.id, environment);
          } catch (error) {
            this._recordCrashLog('activity_condition_error', error, { activityId: rule.id, activityName: rule.name, conditionId: condition && condition.id, conditionType: condition && condition.type, deviceId: condition && condition.deviceId, capabilityId: condition && condition.capabilityId });
            this.error(`Activity condition failed for ${rule.name || rule.id}`, error);
            return false;
          }
        });
        const conditionResults = conditions.map((condition, index) => this._applyActivityConditionDelay(condition, !!rawConditionResults[index], current, now));

        const trueCount = conditionResults.filter(Boolean).length;
        const threshold = Math.max(1, Math.min(Number(rule.minConditions || 1), conditions.length || 1));
        const requiredIndexes = conditions.map((condition, index) => ((condition.requiredCondition === true || condition.conditionRequired === true || condition.required === true) ? index : -1)).filter(index => index >= 0);
        const requiredConditionsMet = requiredIndexes.every(index => conditionResults[index] === true);
        const running = requiredConditionsMet && trueCount >= threshold;

        if (previousStatus === 'active') {
          try {
            this._updateActivityUsage(current, devices, now);
          } catch (error) {
            this._recordCrashLog('activity_usage_error', error, { activityId: rule.id, activityName: rule.name });
            this.error(`Activity usage update failed for ${rule.name || rule.id}`, error);
          }
        }

        current.status = running ? 'active' : 'standby';
        current.trueConditions = trueCount;
        current.requiredConditions = threshold;
        current.requiredConditionCount = requiredIndexes.length;
        current.requiredConditionsMet = requiredConditionsMet;
        current.rawConditionResults = rawConditionResults;
        current.conditionResults = conditionResults;
        current.updatedAt = now;

        if (running && previousStatus !== 'active') {
          current.startedAt = now;
          current.startTime = new Date(now).toISOString();
          current.endedAt = null;
          current.endTime = null;
          current.durationMs = 0;
          current.waterUsed = 0;
          current.energyKwh = 0;
          current.gasUsed = 0;
          current.lastUsageUpdateAt = now;
          current.lastActivityUpdatedFlowAt = 0;
          current.meterBaselines = this._getActivityMeterSnapshot(rule, devices);
          await this._triggerActivityFlow(this.activityStartedTrigger, rule, current);
        } else if (!running && previousStatus === 'active') {
          current.endedAt = now;
          current.endTime = new Date(now).toISOString();
          current.durationMs = Math.max(0, now - (current.startedAt || now));
          const session = this._activitySessionFromState(rule, current);
          const minHistoryMs = Math.max(0, Number(rule.minHistoryDurationSeconds || 0) * 1000);
          if ((session.durationMs || 0) >= minHistoryMs) {
            history[rule.id] = [session].concat(Array.isArray(history[rule.id]) ? history[rule.id] : []).slice(0, rule.historyLimit || ACTIVITY_HISTORY_LIMIT);
          }
          await this._triggerActivityFlow(this.activityStoppedTrigger, rule, current);
        } else if (running) {
          current.durationMs = Math.max(0, now - (current.startedAt || now));
          // Keep the widget live via activity_state, but do not spam Flow triggers every poll.
          if (!current.lastActivityUpdatedFlowAt || now - current.lastActivityUpdatedFlowAt >= 60000) {
            current.lastActivityUpdatedFlowAt = now;
            await this._triggerActivityFlow(this.activityUpdatedTrigger, rule, current);
          }
        }

        state[rule.id] = current;
        changed = true;
        this._markDiagnostics('activity_rule_end', { id: rule.id, name: rule.name, status: current.status, trueConditions: trueCount, requiredConditions: threshold });
      } catch (error) {
        this._recordCrashLog('activity_rule_error', error, { activityId: rule && rule.id, activityName: rule && rule.name });
        this.error(`Activity rule failed for ${rule && (rule.name || rule.id) || 'unknown activity'}`, error);
      }
    }

    if (changed) {
      try {
        this.homey.settings.set(SETTINGS_KEYS.ACTIVITY_STATE, state);
        this.homey.settings.set(SETTINGS_KEYS.ACTIVITY_HISTORY, history);
      } catch (error) {
        this._recordCrashLog('activity_state_save_error', error, { changed });
        this.error('Could not save activity state/history', error);
      }
    }
  }


  _applyActivityConditionDelay(condition, rawResult, activityState, now) {
    const requiredMs = Math.max(0, Number(condition && condition.requiredActiveSeconds || 0) * 1000);
    const inactiveMs = Math.max(0, Number(condition && condition.inactiveDelaySeconds || 0) * 1000);
    if (!activityState) return !!rawResult;
    const id = condition && condition.id ? condition.id : `${condition && condition.deviceId || 'condition'}:${condition && condition.type || 'unknown'}`;
    const delayState = activityState.conditionDelayState = activityState.conditionDelayState && typeof activityState.conditionDelayState === 'object' ? activityState.conditionDelayState : {};
    const current = delayState[id] && typeof delayState[id] === 'object' ? delayState[id] : {};

    if (!rawResult) {
      const wasCounting = current.counting === true;
      const inactiveSince = Number.isFinite(Number(current.inactiveSince)) ? Number(current.inactiveSince) : now;
      const inactiveForMs = Math.max(0, now - inactiveSince);
      const keepCounting = wasCounting && inactiveMs > 0 && inactiveForMs < inactiveMs;
      delayState[id] = {
        activeSince: null,
        inactiveSince,
        raw: false,
        counting: keepCounting,
        lastSeenAt: now,
        activeForMs: 0,
        inactiveForMs,
        requiredMs,
        inactiveMs,
      };
      return keepCounting;
    }

    const activeSince = Number.isFinite(Number(current.activeSince)) ? Number(current.activeSince) : now;
    const activeForMs = Math.max(0, now - activeSince);
    const counting = activeForMs >= requiredMs;
    delayState[id] = {
      activeSince,
      inactiveSince: null,
      raw: true,
      counting,
      lastSeenAt: now,
      activeForMs,
      inactiveForMs: 0,
      requiredMs,
      inactiveMs,
    };
    return counting;
  }

  _evaluateActivityCondition(condition, deviceById, activityState = null, now = Date.now(), allActivityState = null, currentActivityId = '', environment = null) {
    if (!condition || typeof condition !== 'object') return false;
    if (condition.type === 'time_between' || condition.type === 'time_after' || condition.type === 'time_before') {
      return this._evaluateActivityTimeCondition(condition, now);
    }
    if (condition.type === 'activity_status') {
      const targetId = String(condition.activityId || condition.value || condition.deviceId || '');
      if (!targetId || targetId === currentActivityId) return false;
      const target = allActivityState && typeof allActivityState === 'object' ? allActivityState[targetId] : null;
      const isActive = target && target.status === 'active';
      const expectedActive = condition.status === 'inactive' || condition.operator === 'false' || condition.value === false || String(condition.value).toLowerCase() === 'false' ? false : true;
      return expectedActive ? isActive : !isActive;
    }
    if (condition.type === 'zone_motion') {
      const zoneId = String(condition.zoneId || '');
      if (!zoneId || !environment || !Array.isArray(environment.zones) || !Array.isArray(environment.motionDevices)) return false;
      const zoneIds = this._getZoneAndSubZoneIds(zoneId, environment.zones, condition.includeSubzones === true);
      const motionDevices = environment.motionDevices.filter(device => device && device.available !== false && zoneIds.has(device.zone));
      if (!motionDevices.length) return false;
      const isActive = motionDevices.some(device => device.motion === true || (device.capabilityValues && device.capabilityValues.alarm_motion === true));
      const expectedActive = condition.status === 'inactive' || condition.operator === 'false' || condition.value === false || String(condition.value).toLowerCase() === 'false' ? false : true;
      return expectedActive ? isActive : !isActive;
    }
    const device = deviceById.get(condition.deviceId);
    if (!device || device.available === false) return false;
    const capabilityId = condition.capabilityId || this._defaultCapabilityForActivityType(condition.type) || this._firstBooleanCapability(device);
    const values = device.capabilityValues || {};
    const value = values[capabilityId];
    if (value === undefined || value === null) return false;
    if (condition.type === 'device_on' || condition.type === 'sensor_true') {
      const expected = condition.value === false || String(condition.value).toLowerCase() === 'false' ? false : true;
      const actual = value === true || String(value).toLowerCase() === 'true';
      return actual === expected;
    }
    if (condition.type === 'capability_custom') return this._compareActivityCapabilityValue(value, condition.operator, condition.value, condition.threshold);
    if (condition.type === 'capability_equals') return String(value) === String(condition.value);
    const number = Number(value);
    if (!Number.isFinite(number)) return false;
    if (condition.type === 'temperature_rising' || condition.type === 'temperature_falling' || condition.type === 'humidity_rising' || condition.type === 'humidity_falling') {
      return this._evaluateActivityTrendCondition(condition, activityState, now, number);
    }
    if (condition.type === 'water_above') {
      return this._evaluateActivityWaterCondition(condition, activityState, now, number, capabilityId);
    }
    if (condition.type === 'capability_below' || condition.type === 'temperature_below' || condition.type === 'humidity_below') return number <= Number(condition.threshold || 0);
    return number >= Number(condition.threshold || 0);
  }

  _evaluateActivityWaterCondition(condition, activityState, now, number, capabilityId) {
    const threshold = Number(condition.threshold || 0);
    if (capabilityId !== 'meter_water') return number >= threshold;

    // Homey's meter_water is normally cumulative m3. For activity conditions the
    // user enters liters/min, so derive a flow rate from the meter delta between
    // polls. The first poll is only used as baseline and therefore returns false.
    if (!activityState) return false;
    const id = condition.id || `${condition.deviceId}:meter_water:water_rate`;
    const samplesByCondition = activityState.conditionSamples = activityState.conditionSamples || {};
    const samples = Array.isArray(samplesByCondition[id]) ? samplesByCondition[id] : [];
    const previous = samples.length ? samples[samples.length - 1] : null;
    samples.push({ t: now, v: number });
    samplesByCondition[id] = samples.filter(sample => sample && sample.t >= now - 600000).slice(-30);
    if (!previous || !Number.isFinite(Number(previous.v)) || !Number.isFinite(Number(previous.t))) return false;
    const deltaMinutes = Math.max(0, (now - Number(previous.t)) / 60000);
    if (deltaMinutes <= 0) return false;
    const liters = this._waterMeterDeltaToLiters(number - Number(previous.v));
    const litersPerMinute = liters / deltaMinutes;
    return litersPerMinute >= threshold;
  }

  _waterMeterDeltaToLiters(delta) {
    const value = Number(delta);
    if (!Number.isFinite(value) || value <= 0) return 0;
    return value * 1000;
  }

  _evaluateActivityTimeCondition(condition, now = Date.now()) {
    const toMinutes = value => {
      const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
      if (!match) return null;
      const hours = Math.max(0, Math.min(23, Number(match[1])));
      const minutes = Math.max(0, Math.min(59, Number(match[2])));
      return hours * 60 + minutes;
    };
    const date = new Date(now);
    const current = date.getHours() * 60 + date.getMinutes();
    const start = toMinutes(condition.startTime || condition.timeFrom || condition.value || '00:00');
    const end = toMinutes(condition.endTime || condition.timeTo || condition.value || '23:59');
    if (condition.type === 'time_after') return start !== null && current >= start;
    if (condition.type === 'time_before') return end !== null && current <= end;
    if (start === null || end === null) return false;
    if (start <= end) return current >= start && current <= end;
    // Window crosses midnight, e.g. 22:00-06:00.
    return current >= start || current <= end;
  }

  _compareActivityCapabilityValue(value, operator, expected, threshold) {
    const op = operator || 'equals';
    if (op === 'true') return value === true || String(value).toLowerCase() === 'true';
    if (op === 'false') return value === false || String(value).toLowerCase() === 'false';
    if (op === 'contains') return String(value).toLowerCase().includes(String(expected ?? '').toLowerCase());
    if (op === 'equals') return String(value) === String(expected);
    if (op === 'not_equals') return String(value) !== String(expected);
    const actualNumber = Number(value);
    const compareNumber = Number(expected !== undefined && expected !== '' ? expected : threshold);
    if (!Number.isFinite(actualNumber) || !Number.isFinite(compareNumber)) return false;
    if (op === 'above') return actualNumber > compareNumber;
    if (op === 'below') return actualNumber < compareNumber;
    if (op === 'below_or_equal') return actualNumber <= compareNumber;
    return actualNumber >= compareNumber;
  }

  _evaluateActivityTrendCondition(condition, activityState, now, number) {
    if (!activityState) return false;
    const id = condition.id || `${condition.deviceId}:${condition.capabilityId}:${condition.type}`;
    const windowMs = Math.max(5000, Number(condition.windowSeconds || 300) * 1000);
    const samplesByCondition = activityState.conditionSamples = activityState.conditionSamples || {};
    const samples = Array.isArray(samplesByCondition[id]) ? samplesByCondition[id] : [];
    samples.push({ t: now, v: number });
    const cutoff = now - Math.max(windowMs * 2, 60000);
    const kept = samples.filter(sample => sample && sample.t >= cutoff && Number.isFinite(Number(sample.v)));
    samplesByCondition[id] = kept.slice(-120);
    const targetTime = now - windowMs;
    let baseline = null;
    for (const sample of samplesByCondition[id]) {
      if (sample.t <= targetTime) baseline = sample;
      else break;
    }
    if (!baseline) return false;
    const diff = number - Number(baseline.v);
    const delta = Math.max(0, Number(condition.delta || condition.threshold || 1));
    if (condition.type === 'temperature_falling' || condition.type === 'humidity_falling') return diff <= -delta;
    return diff >= delta;
  }

  _firstBooleanCapability(device) {
    const capabilities = Array.isArray(device?.capabilities) ? device.capabilities : [];
    return ['onoff', 'alarm_motion', 'alarm_contact', 'alarm_generic', 'alarm_water', 'alarm_smoke', 'alarm_co', 'presence'].find(cap => capabilities.includes(cap)) || '';
  }

  _getActivityMeterSnapshot(rule, deviceById) {
    const snapshot = {};
    const addDevice = deviceId => {
      if (!deviceId || snapshot[deviceId]) return;
      const device = deviceById.get(deviceId);
      if (!device) return;
      snapshot[deviceId] = {
        meter_power: this._metricValue(device, 'meter_power'),
        meter_water: Number(device.capabilityValues?.meter_water),
        meter_gas: Number(device.capabilityValues?.meter_gas),
      };
    };

    // Conditions may also be meters, so keep the existing automatic tracking.
    for (const condition of rule.conditions || []) addDevice(condition.deviceId);

    // Explicit meter sources are used only for usage registration and do not affect
    // whether the activity starts or stops. This makes it possible to use, for
    // example, a gas meter to measure shower/cooking usage without making gas a
    // recognition condition.
    addDevice(rule.waterMeterDeviceId);
    addDevice(rule.energyMeterDeviceId);
    addDevice(rule.gasMeterDeviceId);

    return snapshot;
  }

  _updateActivityUsage(current, deviceById, now) {
    const last = typeof current.lastUsageUpdateAt === 'number' ? current.lastUsageUpdateAt : now;
    const deltaMs = Math.max(0, now - last);
    current.lastUsageUpdateAt = now;
    const baselines = current.meterBaselines || {};
    const relevantDeviceIds = new Set(Object.keys(baselines));
    for (const [deviceId, device] of deviceById.entries()) {
      try {
      if (relevantDeviceIds.size && !relevantDeviceIds.has(deviceId)) continue;
      const values = device.capabilityValues || {};
      const meterPower = this._metricValue(device, 'meter_power');
      const measurePower = this._metricValue(device, 'measure_power');
      if (Number.isFinite(Number(meterPower)) && Number.isFinite(Number(baselines[deviceId]?.meter_power))) {
        current.energyKwh = Math.max(Number(current.energyKwh || 0), Number(meterPower) - Number(baselines[deviceId].meter_power));
      } else if (Number.isFinite(Number(measurePower)) && deltaMs > 0) {
        current.energyKwh = Number(current.energyKwh || 0) + Math.max(0, Number(measurePower)) * deltaMs / 3600000000;
      }
      if (Number.isFinite(Number(values.meter_water)) && Number.isFinite(Number(baselines[deviceId]?.meter_water))) {
        current.waterUsed = Math.max(Number(current.waterUsed || 0), this._waterMeterDeltaToLiters(Number(values.meter_water) - Number(baselines[deviceId].meter_water)));
      } else if (Number.isFinite(Number(values.measure_water)) && deltaMs > 0) {
        // measure_water is treated as liters per minute.
        current.waterUsed = Number(current.waterUsed || 0) + Math.max(0, Number(values.measure_water)) * deltaMs / 60000;
      }
      if (Number.isFinite(Number(values.meter_gas)) && Number.isFinite(Number(baselines[deviceId]?.meter_gas))) {
        current.gasUsed = Math.max(Number(current.gasUsed || 0), Number(values.meter_gas) - Number(baselines[deviceId].meter_gas));
      } else if (Number.isFinite(Number(values.measure_gas)) && deltaMs > 0) {
        current.gasUsed = Number(current.gasUsed || 0) + Math.max(0, Number(values.measure_gas)) * deltaMs / 60000;
      }
      } catch (error) {
        this.error(`Could not update activity usage for device ${deviceId}`, error);
      }
    }
  }

  _activitySessionFromState(rule, state) {
    return {
      id: `session-${Date.now()}`,
      activityId: rule.id,
      name: rule.name,
      startTime: state.startTime || (state.startedAt ? new Date(state.startedAt).toISOString() : null),
      endTime: state.endTime || (state.endedAt ? new Date(state.endedAt).toISOString() : null),
      durationMs: Math.max(0, Number(state.durationMs || 0)),
      duration: this._formatDuration(state.durationMs || 0, this._getHomeyLanguage()),
      waterUsed: Math.round(Number(state.waterUsed || 0) * 1000) / 1000,
      energyKwh: Math.round(Number(state.energyKwh || 0) * 1000) / 1000,
      gasUsed: Math.round(Number(state.gasUsed || 0) * 1000) / 1000,
    };
  }

  async _triggerActivityFlow(card, rule, state) {
    if (!card || typeof card.trigger !== 'function') return;
    try {
      await card.trigger({
        activity_name: rule.name,
        duration: this._formatDuration(state.durationMs || 0, this._getHomeyLanguage()),
        water_used: Math.round(Number(state.waterUsed || 0) * 1000) / 1000,
        kwh_used: Math.round(Number(state.energyKwh || 0) * 1000) / 1000,
        gas_used: Math.round(Number(state.gasUsed || 0) * 1000) / 1000,
        start_time: state.startTime || '',
        end_time: state.endTime || '',
      });
    } catch (error) {
      this.error('Could not trigger activity Flow card', error);
    }
  }

  _formatDuration(durationMs, locale = 'en') {
    const totalSeconds = Math.max(0, Math.round(Number(durationMs || 0) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  _shouldResetApplianceByActivity(rule, environment) {
    const resetMode = rule.resetMode || 'manual';
    if (resetMode !== 'activity') return false;
    const motionIds = new Set(rule.resetMotionDeviceIds || []);
    const contactIds = new Set(rule.resetContactDeviceIds || []);
    const lightIds = new Set(rule.resetLightDeviceIds || []);
    const hasMotion = (environment.motionDevices || []).some(device => motionIds.has(device.id) && device.motion === true);
    const hasOpenContact = (environment.contactDevices || []).some(device => contactIds.has(device.id) && device.contact === true);
    const hasSelectedLightOn = (environment.lightDevices || []).some(device => lightIds.has(device.id) && device.onoff === true);
    return hasMotion || hasOpenContact || hasSelectedLightOn;
  }

  _hasApplianceZoneActivity(rule, environment) {
    const appliance = ((environment.powerTargets || environment.powerEndpoints || environment.powerDevices) || []).find(device => device.id === rule.deviceId)
      || (environment.devices || []).find(device => device.id === rule.deviceId);
    if (!appliance || !appliance.zone) return false;

    const zoneIds = this._getZoneAndSubZoneIds(appliance.zone, environment.zones || [], true);
    const hasMotionInZone = (environment.motionDevices || []).some(device =>
      zoneIds.has(device.zone) && device.motion === true
    );
    const hasLightOnInZone = (environment.lightDevices || []).some(device =>
      device.id !== rule.deviceId && zoneIds.has(device.zone) && device.onoff === true
    );

    return hasMotionInZone || hasLightOnInZone;
  }

  async _createApplianceTimelineNotification(rule, device, event, power, applianceState = null) {
    if (event === 'started' && rule.notifyOnStart !== true) return;
    if ((event === 'ready' || event === 'reminder') && rule.notifyOnReady !== true) return;

    const locale = this._getHomeyLanguage();
    const name = rule.name || device.name || this._getApplianceTypeLabel(rule.type, locale);
    const typeLabel = this._getApplianceTypeLabel(rule.type, locale);
    const roundedPower = Math.round(power);
    const savedState = applianceState || (rule && rule.id ? (this.getApplianceState()[rule.id] || {}) : {});
    const energyKwh = Math.round(Math.max(0, Number(savedState.finalEnergyKwh ?? savedState.energyKwh ?? 0)) * 1000) / 1000;
    const durationMs = Math.max(0, Number(savedState.finalDurationMs ?? savedState.durationMs ?? 0));
    const durationSeconds = Math.round(durationMs / 1000);
    const durationText = this._formatDuration(durationMs, locale);
    const tokens = {
      name,
      type: typeLabel,
      device: device.name || name,
      power: roundedPower,
      energy_kwh: energyKwh,
      duration_seconds: durationSeconds,
      duration: durationText,
    };

    const trigger = event === 'started'
      ? this.applianceStartedTrigger
      : event === 'reminder'
        ? this.applianceReadyReminderTrigger
        : this.applianceReadyTrigger;

    if (trigger && typeof trigger.trigger === 'function') {
      try {
        await trigger.trigger(tokens);
      } catch (error) {
        this.error('Could not trigger appliance Flow card', error);
      }
    }

    if (rule.useTimelineNotification !== true) return;
    const notifications = this.homey && this.homey.notifications;
    if (!notifications || typeof notifications.createNotification !== 'function') return;

    const excerpt = locale === 'nl'
      ? (event === 'started'
        ? `${name} is gestart (${roundedPower} W, ${durationText}).`
        : event === 'reminder'
          ? `${name} is nog klaar. Laatste run: ${durationText}, ${energyKwh.toFixed(3)} kWh.`
          : `${name} is klaar (${roundedPower} W, ${durationText}, ${energyKwh.toFixed(3)} kWh).`)
      : (event === 'started'
        ? `${name} has started (${roundedPower} W, ${durationText}).`
        : event === 'reminder'
          ? `${name} is still ready. Last run: ${durationText}, ${energyKwh.toFixed(3)} kWh.`
          : `${name} is ready (${roundedPower} W, ${durationText}, ${energyKwh.toFixed(3)} kWh).`);

    await notifications.createNotification({ excerpt });
  }

  _getApplianceTypeLabel(type, locale = 'nl') {
    const labels = {
      nl: { washing_machine: 'Wasmachine', dryer: 'Droger', dishwasher: 'Vaatwasser', airfryer: 'Airfryer', other: 'Apparaat' },
      en: { washing_machine: 'Washing machine', dryer: 'Dryer', dishwasher: 'Dishwasher', airfryer: 'Air fryer', other: 'Appliance' },
    };
    return (labels[locale] && labels[locale][type]) || labels[locale].other;
  }

  _normalizeScheduleRule(rule) {
    if (!rule || typeof rule !== 'object') return null;
    const id = typeof rule.id === 'string' && rule.id ? rule.id : 'schedule-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    const fixedTime = this._normalizeTime(rule.fixedTime, '19:00');
    const randomFrom = this._normalizeTime(rule.randomFrom, '18:30');
    const randomTo = this._normalizeTime(rule.randomTo, '23:00');
    const timeMode = ['fixed', 'random', 'sunrise', 'sunset'].includes(rule.timeMode) ? rule.timeMode : 'fixed';
    return {
      id,
      name: typeof rule.name === 'string' && rule.name.trim() ? rule.name.trim() : 'Nieuwe planning',
      enabled: rule.enabled !== false,
      modeIds: this._sanitizeModeIdList(rule.modeIds),
      deviceIds: this._sanitizeDeviceIdList(rule.deviceIds),
      dimLevel: this._numberInRange(rule.dimLevel, 0, 1, 0.5),
      action: rule.action === 'off' ? 'off' : 'on',
      days: this._sanitizeDays(rule.days),
      timeMode,
      fixedTime,
      fixedMinutes: this._minutesFromTime(fixedTime),
      randomFrom,
      randomTo,
      randomFromMinutes: this._minutesFromTime(randomFrom),
      randomToMinutes: this._minutesFromTime(randomTo),
      sunOffsetMinutes: this._numberInRange(rule.sunOffsetMinutes, -720, 720, 0),
      autoOffEnabled: rule.autoOffEnabled === true,
      autoOffMode: ['hours', 'time', 'random_hours', 'random_time'].includes(rule.autoOffMode) ? rule.autoOffMode : 'hours',
      autoOffAfterHours: this._numberInRange(rule.autoOffAfterHours, 0.1, 48, 1),
      autoOffTime: this._normalizeTime(rule.autoOffTime, '23:00'),
      autoOffRandomFromHours: this._numberInRange(rule.autoOffRandomFromHours, 0.1, 48, 0.5),
      autoOffRandomToHours: this._numberInRange(rule.autoOffRandomToHours, 0.1, 48, 2),
      autoOffRandomFromTime: this._normalizeTime(rule.autoOffRandomFromTime, '22:00'),
      autoOffRandomToTime: this._normalizeTime(rule.autoOffRandomToTime, '23:30'),
      autoOnEnabled: rule.autoOnEnabled === true,
      autoOnMode: ['hours', 'time', 'random_hours', 'random_time'].includes(rule.autoOnMode) ? rule.autoOnMode : 'hours',
      autoOnAfterHours: this._numberInRange(rule.autoOnAfterHours, 0.1, 48, 1),
      autoOnTime: this._normalizeTime(rule.autoOnTime, '07:00'),
      autoOnRandomFromHours: this._numberInRange(rule.autoOnRandomFromHours, 0.1, 48, 0.5),
      autoOnRandomToHours: this._numberInRange(rule.autoOnRandomToHours, 0.1, 48, 2),
      autoOnRandomFromTime: this._normalizeTime(rule.autoOnRandomFromTime, '06:30'),
      autoOnRandomToTime: this._normalizeTime(rule.autoOnRandomToTime, '08:00'),
      zoneId: typeof rule.zoneId === 'string' ? rule.zoneId : '',
      includeSubzones: rule.includeSubzones === true,
      luxCondition: rule.luxCondition === true,
      luxDeviceIds: this._sanitizeDeviceIdList(rule.luxDeviceIds),
      luxOperator: rule.luxOperator === 'above' ? 'above' : 'below',
      luxThreshold: this._numberInRange(rule.luxThreshold, 0, 100000, 30),
      lights: this._normalizeModeLightActions(rule.lights),
    };
  }  _normalizeSwitchRule(rule) {
    if (!rule || typeof rule !== 'object') return null;
    const id = typeof rule.id === 'string' && rule.id ? rule.id : 'switch-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    const allowed = ['set_mode', 'run_zone_rules', 'devices_on', 'devices_off', 'toggle_devices', 'dim_devices', 'flow_only'];
    const actionType = allowed.includes(rule.actionType) ? rule.actionType : 'set_mode';
    return {
      id,
      name: typeof rule.name === 'string' && rule.name.trim() ? rule.name.trim() : 'Nieuwe schakelaar',
      enabled: rule.enabled !== false,
      actionType,
      triggerDeviceId: typeof rule.triggerDeviceId === 'string' ? rule.triggerDeviceId : '',
      triggerEvent: this._normalizeSwitchTriggerEvent(rule.triggerEvent),
      modeId: this.getAvailableModes().includes(rule.modeId) ? rule.modeId : 'home',
      zoneId: typeof rule.zoneId === 'string' ? rule.zoneId : '',
      deviceIds: this._sanitizeDeviceIdList(rule.deviceIds),
      dimLevel: this._numberInRange(rule.dimLevel, 0, 1, 0.5),
    };
  }


  _normalizeSwitchTriggerEvent(event) {
    if (typeof event !== 'string' || !event) return 'button_changed';
    if (['on','off','toggle','dim_changed','dim_up','dim_down','button_changed'].includes(event)) return event;
    if (/^cap:[^:]+:(changed|.+)$/.test(event)) return event;
    return 'button_changed';
  }

  _normalizeSleepPowerRules(settings) {
    const input = settings && typeof settings === 'object' ? settings : {};
    const rules = Array.isArray(input.sleepPowerRules) ? input.sleepPowerRules : [];
    const normalized = rules
      .map((rule) => ({
        id: typeof rule.id === 'string' && rule.id ? rule.id : `spr_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        deviceId: typeof rule.deviceId === 'string' ? rule.deviceId : '',
        operator: rule.operator === 'above' ? 'above' : 'below',
        watt: this._numberInRange(rule.watt, 0, 5000, 0),
      }))
      .filter((rule) => rule.deviceId && rule.watt > 0);
    if (normalized.length) return normalized;
    const legacyIds = this._sanitizeDeviceIdList(input.sleepPowerDeviceIds);
    const legacyBelow = this._numberInRange(input.sleepPowerBelow, 0, 5000, 0);
    const legacyAbove = this._numberInRange(input.sleepPowerAbove, 0, 5000, 0);
    const migrated = [];
    for (const deviceId of legacyIds) {
      if (legacyBelow > 0) migrated.push({ id: `spr_${deviceId}_below`, deviceId, operator: 'below', watt: legacyBelow });
      if (legacyAbove > 0) migrated.push({ id: `spr_${deviceId}_above`, deviceId, operator: 'above', watt: legacyAbove });
    }
    return migrated;
  }

  _normalizeAutoModeSettings(settings) {
    const input = settings && typeof settings === 'object' ? settings : {};
    return {
      enabled: input.enabled === true,
      presenceSource: ['devices', 'homey', 'both'].includes(input.presenceSource) ? input.presenceSource : 'devices',
      presenceDeviceIds: this._sanitizeDeviceIdList(input.presenceDeviceIds),
      homeyUserIds: this._sanitizeDeviceIdList(input.homeyUserIds),
      minPeopleHome: this._numberInRange(input.minPeopleHome, 1, 20, 1),
      enableSleepMode: input.enableSleepMode === true,
      enableWakeHomeMode: input.enableWakeHomeMode !== false,
      sleepMotionDeviceIds: this._sanitizeDeviceIdList(input.sleepMotionDeviceIds),
      sleepContactDeviceIds: this._sanitizeDeviceIdList(input.sleepContactDeviceIds),
      sleepPowerRules: this._normalizeSleepPowerRules(input),
      sleepRequireAll: input.sleepRequireAll === true,
      vacationAfterHours: this._numberInRange(input.vacationAfterHours, 1, 720, 72),
    };
  }

  _createDefaultAutoModeSettings() {
    return this._normalizeAutoModeSettings({ enabled: false, presenceSource: 'devices', minPeopleHome: 1, enableSleepMode: false, enableWakeHomeMode: true, vacationAfterHours: 72 });
  }

  _sanitizeDays(days) {
    if (!Array.isArray(days) || days.length === 0) return [0, 1, 2, 3, 4, 5, 6];
    return [...new Set(days.map(Number).filter(day => Number.isInteger(day) && day >= 0 && day <= 6))];
  }

  _normalizeTime(value, fallback) {
    return this._minutesFromTime(value) === null ? fallback : value;
  }

  _normalizeZoneRule(rule) {
    if (!rule || typeof rule !== 'object') return null;
    const id = typeof rule.id === 'string' && rule.id ? rule.id : `rule-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const zoneId = typeof rule.zoneId === 'string' ? rule.zoneId : '';

    return {
      id,
      name: typeof rule.name === 'string' && rule.name.trim() ? rule.name.trim() : 'Nieuwe zoneregel',
      enabled: rule.enabled !== false,
      modeIds: this._sanitizeModeIdList(rule.modeIds),
      zoneId,
      includeSubzones: rule.includeSubzones === true,
      motionDeviceIds: this._sanitizeDeviceIdList(rule.motionDeviceIds),
      contactDeviceIds: this._sanitizeDeviceIdList(rule.contactDeviceIds),
      lightDeviceIds: this._sanitizeDeviceIdList(Array.isArray(rule.lights) && rule.lights.length ? rule.lights.map(item => item && item.deviceId) : rule.lightDeviceIds),
      lights: this._normalizeModeLightActions(Array.isArray(rule.lights) && rule.lights.length ? rule.lights : this._sanitizeDeviceIdList(rule.lightDeviceIds).map(deviceId => ({ deviceId, on: true, dim: this._numberOrNull(rule.dimValue), lightTemperature: this._numberOrNull(rule.lightTemperature), hue: rule.lightColorEnabled === true ? this._numberInRange(rule.lightHue, 0, 1, 0) : null, saturation: rule.lightColorEnabled === true ? this._numberInRange(rule.lightSaturation, 0, 1, 1) : null, delaySeconds: 0 }))),
      deactivationLights: this._normalizeModeLightActions(Array.isArray(rule.deactivationLights) ? rule.deactivationLights : []),
      turnOnOnMotion: rule.turnOnOnMotion !== false,
      turnOnOnContact: rule.turnOnOnContact === true,
      turnOffWhenContactClosed: rule.turnOffWhenContactClosed === true,
      invertContactLogic: rule.invertContactLogic === true,
      contactSequenceEnabled: rule.contactSequenceEnabled === true,
      contactSequenceEvent: rule.contactSequenceEvent === 'closed' ? 'closed' : 'open',
      contactSequenceCount: Math.max(2, Math.min(10, Math.round(Number(rule.contactSequenceCount) || 2))),
      contactSequenceResetSeconds: this._numberInRange(rule.contactSequenceResetSeconds, 30, 86400, 1800),
      contactSequenceResetOnModeChange: rule.contactSequenceResetOnModeChange !== false,
      turnOffAfterNoMotion: rule.turnOffAfterNoMotion !== false,
      noMotionSeconds: this._numberInRange(rule.noMotionSeconds, 10, 86400, 180),
      dimValue: this._numberOrNull(rule.dimValue),
      lightTemperature: this._numberOrNull(rule.lightTemperature),
      lightColorEnabled: rule.lightColorEnabled === true,
      lightHue: this._numberInRange(rule.lightHue, 0, 1, 0),
      lightSaturation: this._numberInRange(rule.lightSaturation, 0, 1, 1),
      timeEnabled: rule.timeEnabled === true,
      timeFrom: typeof rule.timeFrom === 'string' ? rule.timeFrom : '18:00',
      timeTo: typeof rule.timeTo === 'string' ? rule.timeTo : '23:59',
      onlyIfLightsOff: rule.onlyIfLightsOff === true,
      onlyIfDark: rule.onlyIfDark === true,
      luxDeviceIds: this._sanitizeDeviceIdList(rule.luxDeviceIds),
      luxBelow: this._numberInRange(rule.luxBelow, 0, 100000, 30),
    };
  }


  _normalizeTemperatureRule(rule) {
    if (!rule || typeof rule !== 'object') return null;
    const id = typeof rule.id === 'string' && rule.id ? rule.id : `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const availableModes = this.getAvailableModes();
    const hasExplicitModeIds = Array.isArray(rule.modeIds);
    let modeIds = hasExplicitModeIds ? this._sanitizeModeIdList(rule.modeIds) : [];
    // v3.1.11 migration: old temperature rules had exactly one `modeId`.
    // Never interpret a missing legacy multi-select as "all modes".
    if (!hasExplicitModeIds && availableModes.includes(rule.modeId)) modeIds = [rule.modeId];
    if (!hasExplicitModeIds && modeIds.length === 0) modeIds = [availableModes.includes('home') ? 'home' : (availableModes[0] || 'home')];
    const zoneId = typeof rule.zoneId === 'string' ? rule.zoneId : '';
    const temperature = this._numberInRange(rule.temperature, 5, 35, 20);
    const windowMode = ['ignore', 'skip', 'setback'].includes(rule.windowMode) ? rule.windowMode : 'ignore';
    const windowTemperature = this._numberInRange(rule.windowTemperature, 5, 35, Math.max(5, temperature - 3));
    return {
      id,
      name: typeof rule.name === 'string' && rule.name.trim() ? rule.name.trim() : 'Nieuwe temperatuurregel',
      enabled: rule.enabled !== false,
      modeIds,
      modeId: modeIds[0], // legacy compatibility for older exports/settings panels
      zoneId,
      includeSubzones: rule.includeSubzones === true,
      thermostatDeviceIds: this._sanitizeDeviceIdList(rule.thermostatDeviceIds),
      temperature: Math.round(temperature * 2) / 2,
      windowMode,
      windowTemperature: Math.round(windowTemperature * 2) / 2,
      liveWindowContact: rule.liveWindowContact === true,
      contactDeviceIds: this._sanitizeDeviceIdList(rule.contactDeviceIds),
      smartWeatherEnabled: rule.smartWeatherEnabled === true,
      weatherDeviceId: typeof rule.weatherDeviceId === 'string' ? rule.weatherDeviceId : '',
      weatherColdBelow: this._numberInRange(rule.weatherColdBelow, -40, 40, 5),
      weatherColdBoost: this._numberInRange(rule.weatherColdBoost, 0, 5, 1),
      weatherWarmAbove: this._numberInRange(rule.weatherWarmAbove, -40, 40, 16),
      weatherWarmReduce: this._numberInRange(rule.weatherWarmReduce, 0, 5, 1),
      weatherMinTarget: this._numberInRange(rule.weatherMinTarget, 5, 35, 5),
      weatherMaxTarget: this._numberInRange(rule.weatherMaxTarget, 5, 35, 25),
    };
  }

  _normalizeApplianceRule(rule) {
    if (!rule || typeof rule !== 'object') return null;
    const id = typeof rule.id === 'string' && rule.id ? rule.id : `appliance-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const type = ['washing_machine', 'dryer', 'dishwasher', 'airfryer', 'other'].includes(rule.type) ? rule.type : 'washing_machine';
    const defaults = this._getDefaultApplianceThresholds(type);
    return {
      id,
      name: typeof rule.name === 'string' && rule.name.trim() ? rule.name.trim() : this._getApplianceTypeLabel(type, this._getHomeyLanguage()),
      enabled: rule.enabled !== false,
      type,
      deviceId: typeof rule.deviceId === 'string' ? rule.deviceId : '',
      startThreshold: this._numberInRange(rule.startThreshold, 1, 5000, defaults.startThreshold),
      startDelaySeconds: Math.round(this._numberInRange(rule.startDelaySeconds, 0, 600, defaults.startDelaySeconds)),
      readyThreshold: this._numberInRange(rule.readyThreshold, 0, 1000, defaults.readyThreshold),
      readyDelaySeconds: Math.round(this._numberInRange(rule.readyDelaySeconds, 10, 7200, defaults.readyDelaySeconds)),
      resetAfterReadySeconds: Math.round(this._numberInRange(rule.resetAfterReadySeconds, 0, 86400, 0)),
      resetMode: ['manual', 'activity', 'timer'].includes(rule.resetMode) ? rule.resetMode : (Number(rule.resetAfterReadySeconds) > 0 ? 'timer' : 'manual'),
      resetMotionDeviceIds: this._sanitizeDeviceIdList(rule.resetMotionDeviceIds),
      resetContactDeviceIds: this._sanitizeDeviceIdList(rule.resetContactDeviceIds),
      resetLightDeviceIds: this._sanitizeDeviceIdList(rule.resetLightDeviceIds),
      resetZoneActivity: false,
      repeatReadyNotification: rule.repeatReadyNotification === true,
      readyReminderSeconds: Math.round(this._numberInRange(rule.readyReminderSeconds, 60, 86400, 1800)),
      notifyOnStart: rule.notifyOnStart === true,
      notifyOnReady: rule.notifyOnReady !== false,
      useTimelineNotification: rule.useTimelineNotification === true,
      historyLimit: Math.round(this._numberInRange(rule.historyLimit, 1, 50, APPLIANCE_HISTORY_LIMIT)),
    };
  }

  _getDefaultApplianceThresholds(type) {
    const defaults = {
      washing_machine: { startThreshold: 10, startDelaySeconds: 30, readyThreshold: 3, readyDelaySeconds: 180 },
      dryer: { startThreshold: 50, startDelaySeconds: 30, readyThreshold: 5, readyDelaySeconds: 180 },
      dishwasher: { startThreshold: 10, startDelaySeconds: 30, readyThreshold: 3, readyDelaySeconds: 300 },
      airfryer: { startThreshold: 100, startDelaySeconds: 5, readyThreshold: 5, readyDelaySeconds: 60 },
      other: { startThreshold: 10, startDelaySeconds: 30, readyThreshold: 3, readyDelaySeconds: 180 },
    };
    return defaults[type] || defaults.other;
  }

  _sanitizeModeIdList(modeIds) {
    const allowed = new Set(this.getAvailableModes());
    const values = Array.isArray(modeIds) ? modeIds : this.getAvailableModes();
    const result = [...new Set(values.filter(mode => allowed.has(mode)))];
    return result.length > 0 ? result : this.getAvailableModes();
  }

  _sanitizeDeviceIdList(deviceIds) {
    if (!Array.isArray(deviceIds)) return [];
    return [...new Set(deviceIds.filter(id => typeof id === 'string' && id.trim().length > 0))];
  }

  _numberInRange(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  _numberOrNull(value) {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    if (!Number.isFinite(number)) return null;
    return Math.min(1, Math.max(0, number));
  }

  _createEmptyModeRules() {
    return Object.fromEntries(this.getAvailableModes().map(mode => [mode, { on: [], off: [], delayed: [], lights: [] }]));
  }

  _registerModeAndSwitchFlowCards() {
    try {
      const modeTrigger = this.homey.flow.getDeviceTriggerCard('list_mode_changed');
      const switchTrigger = this.homey.flow.getDeviceTriggerCard('switch_changed');

      this.modeSwitchModeTrigger = modeTrigger;
      this.modeSwitchSwitchTrigger = switchTrigger;

      const listCondition = this.homey.flow.getConditionCard('list_has_mode');
      const switchCondition = this.homey.flow.getConditionCard('switch_is_on');
      const setListMode = this.homey.flow.getActionCard('set_list_mode');
      const setSwitch = this.homey.flow.getActionCard('set_switch');

      this._registerModeSwitchListAutocomplete(listCondition);
      this._registerModeSwitchModeAutocomplete(listCondition);
      this._registerModeSwitchSwitchAutocomplete(switchCondition);

      this._registerModeSwitchListAutocomplete(setListMode);
      this._registerModeSwitchModeAutocomplete(setListMode);
      this._registerModeSwitchSwitchAutocomplete(setSwitch);

      listCondition.registerRunListener(async args => args.device.isListModeActive(args.list.id, args.mode.id));
      switchCondition.registerRunListener(async args => args.device.isSwitchOn(args.button.id));

      setListMode.registerRunListener(async args => {
        await args.device.setListMode(args.list.id, args.mode.id, 'flow');
        return true;
      });

      setSwitch.registerRunListener(async args => {
        await args.device.setSwitchState(args.button.id, !!args.state, 'flow');
        return true;
      });
    } catch (error) {
      this.error('Could not register Mode & Switch flow cards', error);
    }
  }

  _registerModeSwitchListAutocomplete(card) {
    card.registerArgumentAutocompleteListener('list', async (query, args) => {
      if (!args.device) return [];
      return args.device.getListOptions(query);
    });
  }

  _registerModeSwitchModeAutocomplete(card) {
    card.registerArgumentAutocompleteListener('mode', async (query, args) => {
      if (!args.device || !args.list) return [];
      return args.device.getModeOptions(args.list.id, query);
    });
  }

  _registerModeSwitchSwitchAutocomplete(card) {
    card.registerArgumentAutocompleteListener('button', async (query, args) => {
      if (!args.device) return [];
      return args.device.getSwitchOptions(query);
    });
  }


  _normalizeDeviceActionSet(set = {}) {
    return {
      on: this._sanitizeDeviceIdList(set.on),
      off: this._sanitizeDeviceIdList(set.off),
    };
  }

  _normalizeModeSwitchDeviceRules(input) {
    const source = input && typeof input === 'object' ? input : {};
    const output = {};
    for (const [deviceId, deviceRules] of Object.entries(source)) {
      if (!deviceId || !deviceRules || typeof deviceRules !== 'object') continue;
      const normalized = { enabled: deviceRules.enabled !== false, listRules: {}, switchRules: {} };
      const listRules = deviceRules.listRules && typeof deviceRules.listRules === 'object' ? deviceRules.listRules : {};
      for (const [listId, modes] of Object.entries(listRules)) {
        if (!listId || !modes || typeof modes !== 'object') continue;
        normalized.listRules[listId] = {};
        for (const [modeId, actions] of Object.entries(modes)) {
          if (!modeId) continue;
          normalized.listRules[listId][modeId] = this._normalizeDeviceActionSet(actions);
        }
      }
      const switchRules = deviceRules.switchRules && typeof deviceRules.switchRules === 'object' ? deviceRules.switchRules : {};
      for (const [switchId, states] of Object.entries(switchRules)) {
        if (!switchId || !states || typeof states !== 'object') continue;
        normalized.switchRules[switchId] = {
          on: this._normalizeDeviceActionSet(states.on),
          off: this._normalizeDeviceActionSet(states.off),
        };
      }
      output[deviceId] = normalized;
    }
    return output;
  }

  _normalizeKeypadMappings(mappings) {
    if (!Array.isArray(mappings)) return [];
    return mappings.map((m, i) => ({
      id: String(m?.id || `keypad_${i}`),
      keypadId: String(m?.keypadId || '').trim(),
      modeId: String(m?.modeId || '').trim(),
      salt: String(m?.salt || ''),
      pinHash: String(m?.pinHash || ''),
    })).filter(m => m.keypadId && m.modeId && m.salt && m.pinHash);
  }

  getKeypadMappings() {
    return this._normalizeKeypadMappings(this.homey.settings.get(SETTINGS_KEYS.KEYPAD_MAPPINGS));
  }

  async saveKeypadMappings(mappings) {
    const previous = new Map(this.getKeypadMappings().map(m => [m.id, m]));
    const normalized = (Array.isArray(mappings) ? mappings : []).map((m, i) => {
      const id = String(m?.id || `keypad_${Date.now()}_${i}`);
      const old = previous.get(id);
      let salt = String(m?.salt || old?.salt || '');
      let pinHash = String(m?.pinHash || old?.pinHash || '');
      const pin = String(m?.pin || '').trim();
      if (pin) {
        salt = crypto.randomBytes(16).toString('hex');
        pinHash = crypto.createHash('sha256').update(`${salt}:${pin}`).digest('hex');
      }
      return { id, keypadId: String(m?.keypadId || '').trim(), modeId: String(m?.modeId || '').trim(), salt, pinHash };
    });
    const clean = this._normalizeKeypadMappings(normalized);
    this.homey.settings.set(SETTINGS_KEYS.KEYPAD_MAPPINGS, clean);
    return clean;
  }

  async processKeypadInput(keypadId, pin) {
    const kid = String(keypadId || '').trim();
    const enteredPin = String(pin || '').trim();
    if (!kid || !enteredPin) return false;
    for (const mapping of this.getKeypadMappings()) {
      if (mapping.keypadId !== kid) continue;
      const hash = crypto.createHash('sha256').update(`${mapping.salt}:${enteredPin}`).digest('hex');
      if (hash.length === mapping.pinHash.length && crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(mapping.pinHash))) {
        await this.applyMode(mapping.modeId, { source: `keypad:${kid}` });
        return true;
      }
    }
    return false;
  }

  getModeSwitchDeviceRules() {
    return this._normalizeModeSwitchDeviceRules(this.homey.settings.get(SETTINGS_KEYS.MODE_SWITCH_DEVICE_RULES));
  }

  async saveModeSwitchDeviceRules(rules) {
    const normalized = this._normalizeModeSwitchDeviceRules(rules);
    this.homey.settings.set(SETTINGS_KEYS.MODE_SWITCH_DEVICE_RULES, normalized);
    return normalized;
  }


  async _applyModeSwitchDefaultLists(rules = {}) {
    // Default list is managed by the Mode & Switch device configuration itself.
    // Keep this method as a no-op for backwards compatibility with older saved rules.
    return rules;
  }

  getModeSwitchDevicesForSettings() {
    try {
      const driver = this.homey.drivers.getDriver('mode_switch');
      const devices = driver && typeof driver.getDevices === 'function' ? driver.getDevices() : [];
      return (Array.isArray(devices) ? devices : []).map(device => {
        const exported = typeof device.exportConfig === 'function' ? device.exportConfig() : { name: device.getName(), lists: [], switches: [] };
        const data = typeof device.getData === 'function' ? device.getData() : {};
        return {
          id: data && data.id ? data.id : device.getId(),
          name: exported.name || device.getName(),
          lists: Array.isArray(exported.lists) ? exported.lists : [],
          switches: Array.isArray(exported.switches) ? exported.switches : [],
          defaultListId: typeof exported.defaultListId === 'string' ? exported.defaultListId : '',
        };
      });
    } catch (error) {
      this.error('Could not list Mode & Switch devices', error);
      return [];
    }
  }

  async _applyModeSwitchActionSet(actions, source = 'mode-switch-device') {
    const set = this._normalizeDeviceActionSet(actions);
    await this._applyDeviceAction(set.on, true);
    await this._applyDeviceAction(set.off, false);
    this._markDiagnostics('mode_switch_device_actions', { source, on: set.on.length, off: set.off.length });
  }

  async _runModeSwitchListActions(device, list, mode) {
    const data = typeof device.getData === 'function' ? device.getData() : {};
    const deviceId = data && data.id ? data.id : device.getId();
    const allRules = this.getModeSwitchDeviceRules();
    const rules = allRules[deviceId];
    if (!rules || rules.enabled === false) return;
    const actions = rules.listRules && rules.listRules[list.id] && rules.listRules[list.id][mode.id];
    if (!actions) return;
    await this._applyModeSwitchActionSet(actions, `${device.getName()}:${list.name}:${mode.name}`);
  }

  async _runModeSwitchSwitchActions(device, button) {
    const data = typeof device.getData === 'function' ? device.getData() : {};
    const deviceId = data && data.id ? data.id : device.getId();
    const allRules = this.getModeSwitchDeviceRules();
    const rules = allRules[deviceId];
    if (!rules || rules.enabled === false) return;
    const stateKey = button.on ? 'on' : 'off';
    const actions = rules.switchRules && rules.switchRules[button.id] && rules.switchRules[button.id][stateKey];
    if (!actions) return;
    await this._applyModeSwitchActionSet(actions, `${device.getName()}:${button.name}:${stateKey}`);
  }

  async triggerModeSwitchListModeChanged(device, list, mode) {
    await this._runModeSwitchListActions(device, list, mode).catch(error => this.error('Mode & Switch list actions failed', error));
    if (!this.modeSwitchModeTrigger) return null;
    return this.modeSwitchModeTrigger.trigger(device, {
      list_id: list.id,
      list_name: list.name,
      mode_id: mode.id,
      mode_name: mode.name,
    }, {
      list_id: list.id,
      mode_id: mode.id,
    });
  }

  async triggerModeSwitchSwitchChanged(device, button) {
    await this._runModeSwitchSwitchActions(device, button).catch(error => this.error('Mode & Switch switch actions failed', error));
    if (!this.modeSwitchSwitchTrigger) return null;
    return this.modeSwitchSwitchTrigger.trigger(device, {
      button_id: button.id,
      button_name: button.name,
      is_on: !!button.on,
    }, {
      button_id: button.id,
      is_on: !!button.on,
    });
  }

}

module.exports = ModeSwitchApp;
