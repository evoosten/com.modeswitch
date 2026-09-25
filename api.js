'use strict';

const fs = require('fs');
const path = require('path');

function _safeArrayForApi(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function _availableModes(homey) {
  const fallback = ['home', 'sleep', 'away', 'vacation'];
  try {
    return _safeArrayForApi(homey.app.getAvailableModes(), fallback);
  } catch (err) {
    return fallback;
  }
}

module.exports = {
  async get_dashboard_status({ homey }) {
    return homey.app.getDashboardStatus();
  },

  async get_config({ homey }) {
    return {
      modes: _availableModes(homey).map(mode => ({ id: mode, label: homey.app.getModeLabel(mode), parentMode: (homey.app.getSubModes().find(s => s.id === mode) || {}).parentMode || null })),
      mainModeLabels: homey.app.getMainModeLabels(),
      subModes: homey.app.getSubModes(),
      currentMode: homey.app.getCurrentMode(),
      rules: homey.app.getModeRules(),
      zoneRules: homey.app.getZoneRules(),
      temperatureRules: homey.app.getTemperatureRules(),
      applianceRules: homey.app.getApplianceRules(),
      applianceState: homey.app.getApplianceState(),
      groupWatchRules: homey.app.getGroupWatchRules ? homey.app.getGroupWatchRules() : [],
      groupWatchState: homey.app.getGroupWatchState ? homey.app.getGroupWatchState() : {},
      activityRules: homey.app.getActivityRules(),
      activityState: homey.app.getActivityState(),
      activityHistory: homey.app.getActivityHistory(),
      scheduleRules: homey.app.getScheduleRules(),
      autoMode: homey.app.getAutoModeSettings(),
      displaySettings: homey.app.getDisplaySettings(),
      modeSwitchDevices: homey.app.getModeSwitchDevicesForSettings ? homey.app.getModeSwitchDevicesForSettings() : [],
      modeSwitchDeviceRules: homey.app.getModeSwitchDeviceRules ? homey.app.getModeSwitchDeviceRules() : {},
      avdDevices: homey.app.getAVDDevicesForSettings ? await homey.app.getAVDDevicesForSettings() : [],
      avdDeviceRules: homey.app.getAVDDeviceRules ? homey.app.getAVDDeviceRules() : {},
      keypadMappings: homey.app.getKeypadMappings ? homey.app.getKeypadMappings() : [],
    };
  },

  async get_devices({ homey }) {
    return homey.app.getSwitchableDevices();
  },

  async get_environment({ homey }) {
    // Settings UI should always load Homey users so the Auto Mode tab can show/select them.
    // Runtime/background code still decides whether to use them based on autoMode settings.
    return homey.app.getEnvironment({ includeHomeyUsers: true, force: true });
  },


  async put_main_mode_labels({ homey, body }) {
    const mainModeLabels = await homey.app.saveMainModeLabels(body?.mainModeLabels || {});
    return {
      ok: true,
      mainModeLabels,
      modes: _availableModes(homey).map(mode => ({ id: mode, label: homey.app.getModeLabel(mode), parentMode: (homey.app.getSubModes().find(s => s.id === mode) || {}).parentMode || null })),
    };
  },

  async put_sub_modes({ homey, body }) {
    const subModes = await homey.app.saveSubModes(body?.subModes || []);
    return { ok: true, subModes, modes: _availableModes(homey).map(mode => ({ id: mode, label: homey.app.getModeLabel(mode), parentMode: (homey.app.getSubModes().find(s => s.id === mode) || {}).parentMode || null })) };
  },

  async put_rules({ homey, body }) {
    const rules = await homey.app.saveModeRules(body?.rules || {});
    return { ok: true, rules };
  },

  async get_contact_counter_status({ homey }) {
    return { ok: true, counters: homey.app.getContactCounterStatus ? homey.app.getContactCounterStatus() : [] };
  },

  async post_reset_contact_counter({ homey, body }) {
    const ruleId = String(body?.ruleId || '');
    return { ok: true, counter: homey.app.resetContactCounter ? homey.app.resetContactCounter(ruleId) : null };
  },

  async put_zone_rules({ homey, body }) {
    const zoneRules = await homey.app.saveZoneRules(body?.zoneRules || []);
    return { ok: true, zoneRules };
  },

  async put_temperature_rules({ homey, body }) {
    const temperatureRules = await homey.app.saveTemperatureRules(body?.temperatureRules || []);
    return { ok: true, temperatureRules };
  },

  async put_group_watch_rules({ homey, body }) {
    const groupWatchRules = await homey.app.saveGroupWatchRules(body?.groupWatchRules || []);
    return { ok: true, groupWatchRules, groupWatchState: homey.app.getGroupWatchState() };
  },

  async get_group_watch_status({ homey }) {
    return { ok: true, groupWatchState: homey.app.getGroupWatchState ? homey.app.getGroupWatchState() : {} };
  },

  async put_appliance_rules({ homey, body }) {
    const applianceRules = await homey.app.saveApplianceRules(body?.applianceRules || []);
    return { ok: true, applianceRules };
  },

  async get_activity_rules({ homey }) {
    return homey.app.getActivityRules();
  },

  async put_activity_rules({ homey, body }) {
    const activityRules = await homey.app.saveActivityRules(body?.activityRules || []);
    return { ok: true, activityRules };
  },

  async get_activity_state({ homey }) {
    return homey.app.getActivityState();
  },

  async get_activity_history({ homey }) {
    return homey.app.getActivityHistory();
  },


  async get_crash_log({ homey }) {
    return { ok: true, crashLog: homey.app.getCrashLog(), diagnostics: homey.app.getCrashDiagnostics ? homey.app.getCrashDiagnostics() : {}, breadcrumbs: homey.app.getCrashBreadcrumbs ? homey.app.getCrashBreadcrumbs() : [] };
  },

  async post_clear_crash_log({ homey }) {
    return { ok: true, crashLog: homey.app.clearCrashLog(), diagnostics: homey.app.getCrashDiagnostics ? homey.app.getCrashDiagnostics() : {}, breadcrumbs: homey.app.getCrashBreadcrumbs ? homey.app.getCrashBreadcrumbs() : [] };
  },

  // Homey SDK maps /crash_log/clear to post_crash_log_clear in some runtimes.
  async post_crash_log_clear({ homey }) {
    return { ok: true, crashLog: homey.app.clearCrashLog(), diagnostics: homey.app.getCrashDiagnostics ? homey.app.getCrashDiagnostics() : {}, breadcrumbs: homey.app.getCrashBreadcrumbs ? homey.app.getCrashBreadcrumbs() : [] };
  },

  async put_schedule_rules({ homey, body }) {
    const scheduleRules = await homey.app.saveScheduleRules(body?.scheduleRules || []);
    return { ok: true, scheduleRules };
  },

  async put_auto_mode({ homey, body }) {
    const autoMode = await homey.app.saveAutoModeSettings(body?.autoMode || {});
    return { ok: true, autoMode };
  },

  async put_display_settings({ homey, body }) {
    const displaySettings = await homey.app.saveDisplaySettings(body?.displaySettings || {});
    return { ok: true, displaySettings };
  },

  async put_keypad_mappings({ homey, body }) {
    const keypadMappings = await homey.app.saveKeypadMappings(body?.keypadMappings || []);
    return { ok: true, keypadMappings };
  },

  async put_avd_device_rules({ homey, body }) {
    const avdDeviceRules = await homey.app.saveAVDDeviceRules(body?.avdDeviceRules || {});
    return { ok: true, avdDeviceRules };
  },

  async put_mode_switch_device_rules({ homey, body }) {
    const modeSwitchDeviceRules = await homey.app.saveModeSwitchDeviceRules(body?.modeSwitchDeviceRules || {});
    return { ok: true, modeSwitchDeviceRules };
  },

  async post_mode_switch_device_rules({ homey, body }) {
    const modeSwitchDeviceRules = await homey.app.saveModeSwitchDeviceRules(body?.modeSwitchDeviceRules || {});
    return { ok: true, modeSwitchDeviceRules };
  },

  async put_mode_switch_devices_rules({ homey, body }) {
    const modeSwitchDeviceRules = await homey.app.saveModeSwitchDeviceRules(body?.modeSwitchDeviceRules || {});
    return { ok: true, modeSwitchDeviceRules };
  },

  async post_mode_switch_devices_rules({ homey, body }) {
    const modeSwitchDeviceRules = await homey.app.saveModeSwitchDeviceRules(body?.modeSwitchDeviceRules || {});
    return { ok: true, modeSwitchDeviceRules };
  },

  async post_mode({ homey, body }) {
    if (!body || typeof body.mode !== 'string') throw new Error('Missing mode');
    return homey.app.applyMode(body.mode, { source: 'settings' });
  },

  async post_run_zone({ homey, body }) {
    if (!body || typeof body.zoneId !== 'string') throw new Error('Missing zoneId');
    await homey.app.runZoneRulesForZone(body.zoneId, { source: 'settings' });
    return { ok: true };
  },



  async post_prepare_export({ homey, body }) {
    const json = typeof body?.json === 'string' ? body.json : '';
    const filename = typeof body?.filename === 'string' && body.filename.endsWith('.json')
      ? body.filename.replace(/[^a-zA-Z0-9._-]/g, '-')
      : 'modeswitch-backup.json';
    if (!json.trim()) throw new Error('Missing export JSON');
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object' || !parsed.sections || typeof parsed.sections !== 'object') {
      throw new Error('Invalid export JSON');
    }
    homey.app._lastPreparedExport = json;
    homey.app._lastPreparedExportFilename = filename;
    return { ok: true, filename };
  },

  async post_import({ homey, body }) {
    if (!body || !body.sections || typeof body.sections !== 'object') {
      throw new Error('Missing import sections');
    }
    const allowed = ['subModes', 'rules', 'zoneRules', 'temperatureRules', 'applianceRules', 'groupWatchRules', 'activityRules', 'scheduleRules', 'autoMode', 'displaySettings', 'modeSwitchDeviceRules', 'avdDeviceRules', 'keypadMappings'];
    const ids = Array.isArray(body.ids)
      ? body.ids.filter(id => allowed.includes(id) && Object.prototype.hasOwnProperty.call(body.sections, id))
      : [];
    if (!ids.length) throw new Error('No valid sections selected');

    const sections = body.sections;
    const result = { ok: true, imported: [] };

    if (ids.includes('subModes')) {
      result.subModes = await homey.app.saveSubModes(Array.isArray(sections.subModes) ? sections.subModes : []);
      result.imported.push('subModes');
    }
    if (ids.includes('rules')) {
      result.rules = await homey.app.saveModeRules(sections.rules && typeof sections.rules === 'object' ? sections.rules : {});
      result.imported.push('rules');
    }
    if (ids.includes('zoneRules')) {
      result.zoneRules = await homey.app.saveZoneRules(Array.isArray(sections.zoneRules) ? sections.zoneRules : []);
      result.imported.push('zoneRules');
    }
    if (ids.includes('temperatureRules')) {
      result.temperatureRules = await homey.app.saveTemperatureRules(Array.isArray(sections.temperatureRules) ? sections.temperatureRules : []);
      result.imported.push('temperatureRules');
    }
    if (ids.includes('applianceRules')) {
      result.applianceRules = await homey.app.saveApplianceRules(Array.isArray(sections.applianceRules) ? sections.applianceRules : []);
      result.imported.push('applianceRules');
    }
    if (ids.includes('groupWatchRules')) {
      result.groupWatchRules = await homey.app.saveGroupWatchRules(Array.isArray(sections.groupWatchRules) ? sections.groupWatchRules : []);
      result.imported.push('groupWatchRules');
    }
    if (ids.includes('activityRules')) {
      result.activityRules = await homey.app.saveActivityRules(Array.isArray(sections.activityRules) ? sections.activityRules : []);
      result.imported.push('activityRules');
    }
    if (ids.includes('scheduleRules')) {
      result.scheduleRules = await homey.app.saveScheduleRules(Array.isArray(sections.scheduleRules) ? sections.scheduleRules : []);
      result.imported.push('scheduleRules');
    }
    if (ids.includes('autoMode')) {
      result.autoMode = await homey.app.saveAutoModeSettings(sections.autoMode && typeof sections.autoMode === 'object' ? sections.autoMode : {});
      result.imported.push('autoMode');
    }
    if (ids.includes('displaySettings')) {
      result.displaySettings = await homey.app.saveDisplaySettings(sections.displaySettings && typeof sections.displaySettings === 'object' ? sections.displaySettings : {});
      result.imported.push('displaySettings');
    }
    if (ids.includes('keypadMappings')) {
      result.keypadMappings = await homey.app.saveKeypadMappings(Array.isArray(sections.keypadMappings) ? sections.keypadMappings : []);
      result.imported.push('keypadMappings');
    }
    if (ids.includes('avdDeviceRules')) {
      result.avdDeviceRules = await homey.app.saveAVDDeviceRules(sections.avdDeviceRules && typeof sections.avdDeviceRules === 'object' ? sections.avdDeviceRules : {});
      result.imported.push('avdDeviceRules');
    }
    if (ids.includes('modeSwitchDeviceRules')) {
      result.modeSwitchDeviceRules = await homey.app.saveModeSwitchDeviceRules(sections.modeSwitchDeviceRules && typeof sections.modeSwitchDeviceRules === 'object' ? sections.modeSwitchDeviceRules : {});
      result.imported.push('modeSwitchDeviceRules');
    }

    return result;
  },

  async web_export({ homey, query }) {
    if (query && String(query.prepared || '') === '1' && homey.app._lastPreparedExport) {
      const filename = homey.app._lastPreparedExportFilename || 'modeswitch-backup.json';
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': 'attachment; filename="' + filename + '"',
          'Cache-Control': 'no-store',
        },
        body: homey.app._lastPreparedExport,
      };
    }
    const requested = String((query && query.sections) || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const allowed = ['subModes', 'rules', 'zoneRules', 'temperatureRules', 'applianceRules', 'groupWatchRules', 'activityRules', 'scheduleRules', 'autoMode', 'displaySettings', 'modeSwitchDeviceRules', 'avdDeviceRules', 'keypadMappings'];
    const sectionsToExport = requested.length ? requested.filter(id => allowed.includes(id)) : allowed;
    const sections = {};
    if (sectionsToExport.includes('subModes')) sections.subModes = homey.app.getSubModes();
    if (sectionsToExport.includes('rules')) sections.rules = homey.app.getModeRules();
    if (sectionsToExport.includes('zoneRules')) sections.zoneRules = homey.app.getZoneRules();
    if (sectionsToExport.includes('temperatureRules')) sections.temperatureRules = homey.app.getTemperatureRules();
    if (sectionsToExport.includes('applianceRules')) sections.applianceRules = homey.app.getApplianceRules();
    if (sectionsToExport.includes('groupWatchRules')) sections.groupWatchRules = homey.app.getGroupWatchRules ? homey.app.getGroupWatchRules() : [];
    if (sectionsToExport.includes('activityRules')) sections.activityRules = homey.app.getActivityRules();
    if (sectionsToExport.includes('scheduleRules')) sections.scheduleRules = homey.app.getScheduleRules();
    if (sectionsToExport.includes('autoMode')) sections.autoMode = homey.app.getAutoModeSettings();
    if (sectionsToExport.includes('displaySettings')) sections.displaySettings = homey.app.getDisplaySettings();
    if (sectionsToExport.includes('modeSwitchDeviceRules')) sections.modeSwitchDeviceRules = homey.app.getModeSwitchDeviceRules ? homey.app.getModeSwitchDeviceRules() : {};
    if (sectionsToExport.includes('avdDeviceRules')) sections.avdDeviceRules = homey.app.getAVDDeviceRules ? homey.app.getAVDDeviceRules() : {}; 
    const payload = {
      meta: { app: 'com.eevoosten.modeswitch', name: 'Mode Switch', version: '2.6.30', exportedAt: new Date().toISOString() },
      sections,
    };
    const filename = 'modeswitch-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify(payload, null, 2),
    };
  },

};

// Dashboard Service API (v1). These read-only endpoints are intended for
// Home Overview and other trusted Homey apps.
module.exports.get_dashboard = async ({ homey }) => homey.app.dashboardService.getDashboard();
module.exports.get_dashboard_modes = async ({ homey }) => homey.app.dashboardService.getModes();
module.exports.get_dashboard_monitoring = async ({ homey }) => homey.app.dashboardService.getMonitoring();
module.exports.get_dashboard_activities = async ({ homey }) => homey.app.dashboardService.getActivities();
module.exports.get_dashboard_schedules = async ({ homey }) => homey.app.dashboardService.getSchedules();
module.exports.get_dashboard_presence = async ({ homey }) => homey.app.dashboardService.getPresence();
module.exports.get_dashboard_attention = async ({ homey }) => {
  const dashboard = homey.app.dashboardService.getDashboard();
  return dashboard.attention;
};
module.exports.get_dashboard_history = async ({ homey }) => homey.app.dashboardService.getHistory();


// Local configuration web UI (3.5.1)
const crypto = require('crypto');

function _getOrCreateLocalConfigToken(homey) {
  let token = String(homey.settings.get('local_config_token') || '');
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    token = crypto.randomBytes(32).toString('hex');
    homey.settings.set('local_config_token', token);
  }
  return token;
}

function _validateLocalConfigToken(homey, token) {
  const expected = _getOrCreateLocalConfigToken(homey);
  const supplied = String(token || '');
  if (supplied.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
  } catch (_) {
    return false;
  }
}


function _normalizeLocalConfigOrigin(value) {
  let raw = String(value || '').trim();
  if (!raw) return '';
  if (!/^https?:\/\//i.test(raw)) raw = 'http://' + raw;
  try {
    const parsed = new URL(raw);
    const host = String(parsed.hostname || '').toLowerCase();
    if (!host || host === '127.0.0.1' || host === 'localhost' || host === '::1') return '';
    return parsed.origin;
  } catch (_) {
    return '';
  }
}

function _getStoredLocalConfigOrigin(homey) {
  return _normalizeLocalConfigOrigin(homey.settings.get('local_config_origin'));
}

function _localConfigLanguage(homey) {
  try {
    const lang = homey.app && typeof homey.app._getHomeyLanguage === 'function'
      ? homey.app._getHomeyLanguage()
      : (homey.i18n && typeof homey.i18n.getLanguage === 'function' ? homey.i18n.getLanguage() : 'en');
    const value = String(lang || 'en').toLowerCase().split('-')[0];
    return value === 'nb' ? 'no' : (['nl','en','de','fr','es','no','sv','it'].includes(value) ? value : 'en');
  } catch (_) {
    return 'en';
  }
}

module.exports.get_local_config_info = async ({ homey }) => {
  const info = homey.app && typeof homey.app.getLocalConfigServerInfo === 'function'
    ? homey.app.getLocalConfigServerInfo()
    : { running: false, port: null, address: '', url: '', urls: [] };
  return {
    ok: true,
    language: _localConfigLanguage(homey),
    running: info.running === true,
    port: info.port || null,
    address: info.address || '',
    url: info.url || '',
    urls: Array.isArray(info.urls) ? info.urls : [],
    tokenConfigured: true,
  };
};

// Kept for backwards compatibility with 3.5.6 settings pages. The local
// configuration server now discovers the Homey LAN address automatically.
module.exports.post_set_local_config_origin = async ({ homey }) => {
  const info = homey.app && typeof homey.app.getLocalConfigServerInfo === 'function'
    ? homey.app.getLocalConfigServerInfo()
    : { running: false, port: null, address: '', url: '', urls: [] };
  return { ok: true, ...info };
};

module.exports.post_regenerate_local_config_token = async ({ homey }) => {
  if (homey.app && typeof homey.app.regenerateLocalConfigToken === 'function') {
    const info = homey.app.regenerateLocalConfigToken();
    return { ok: true, ...info };
  }
  const token = crypto.randomBytes(32).toString('hex');
  homey.settings.set('local_config_token', token);
  return { ok: true, url: '', urls: [] };
};

module.exports.get_local_config_bootstrap = async ({ homey, query }) => {
  if (!_validateLocalConfigToken(homey, query && query.key)) {
    const err = new Error('Invalid local configuration key');
    err.statusCode = 403;
    throw err;
  }
  return { ok: true, language: _localConfigLanguage(homey), version: homey.manifest && homey.manifest.version };
};

module.exports.post_local_config_api = async ({ homey, body }) => {
  if (!_validateLocalConfigToken(homey, body && body.key)) {
    const err = new Error('Invalid local configuration key');
    err.statusCode = 403;
    throw err;
  }
  const method = String(body && body.method || 'GET').toUpperCase();
  const requestPath = String(body && body.path || '/');
  const denied = new Set(['/local_config_info','/local_config_token/regenerate','/local_config_bootstrap','/local_config_api','/export']);
  if (denied.has(requestPath)) throw new Error('Route is not available from local configuration');

  const manifestApi = (homey.manifest && homey.manifest.api) || {};
  const entry = Object.entries(manifestApi).find(([name, route]) => {
    if (!route || route.path !== requestPath) return false;
    const methods = Array.isArray(route.method) ? route.method : [route.method];
    return methods.map(String).map(v => v.toUpperCase()).includes(method) && !name.startsWith('get_local_config') && !name.startsWith('post_local_config');
  });
  if (!entry) throw new Error('Unsupported configuration API route: ' + method + ' ' + requestPath);
  const [handlerName] = entry;
  const handler = module.exports[handlerName];
  if (typeof handler !== 'function') throw new Error('Configuration handler not found: ' + handlerName);
  return handler({ homey, body: body ? body.body : null, query: {}, params: {} });
};
