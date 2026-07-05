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
  async get_config({ homey }) {
    return {
      modes: _availableModes(homey).map(mode => ({ id: mode, label: homey.app.getModeLabel(mode), parentMode: (homey.app.getSubModes().find(s => s.id === mode) || {}).parentMode || null })),
      subModes: homey.app.getSubModes(),
      currentMode: homey.app.getCurrentMode(),
      rules: homey.app.getModeRules(),
      zoneRules: homey.app.getZoneRules(),
      temperatureRules: homey.app.getTemperatureRules(),
      applianceRules: homey.app.getApplianceRules(),
      applianceState: homey.app.getApplianceState(),
      activityRules: homey.app.getActivityRules(),
      activityState: homey.app.getActivityState(),
      activityHistory: homey.app.getActivityHistory(),
      scheduleRules: homey.app.getScheduleRules(),
      autoMode: homey.app.getAutoModeSettings(),
      displaySettings: homey.app.getDisplaySettings(),
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

  async put_sub_modes({ homey, body }) {
    const subModes = await homey.app.saveSubModes(body?.subModes || []);
    return { ok: true, subModes, modes: _availableModes(homey).map(mode => ({ id: mode, label: homey.app.getModeLabel(mode), parentMode: (homey.app.getSubModes().find(s => s.id === mode) || {}).parentMode || null })) };
  },

  async put_rules({ homey, body }) {
    const rules = await homey.app.saveModeRules(body?.rules || {});
    return { ok: true, rules };
  },

  async put_zone_rules({ homey, body }) {
    const zoneRules = await homey.app.saveZoneRules(body?.zoneRules || []);
    return { ok: true, zoneRules };
  },

  async put_temperature_rules({ homey, body }) {
    const temperatureRules = await homey.app.saveTemperatureRules(body?.temperatureRules || []);
    return { ok: true, temperatureRules };
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
    const allowed = ['subModes', 'rules', 'zoneRules', 'temperatureRules', 'applianceRules', 'activityRules', 'scheduleRules', 'autoMode', 'displaySettings'];
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
    const allowed = ['subModes', 'rules', 'zoneRules', 'temperatureRules', 'applianceRules', 'activityRules', 'scheduleRules', 'autoMode', 'displaySettings'];
    const sectionsToExport = requested.length ? requested.filter(id => allowed.includes(id)) : allowed;
    const sections = {};
    if (sectionsToExport.includes('subModes')) sections.subModes = homey.app.getSubModes();
    if (sectionsToExport.includes('rules')) sections.rules = homey.app.getModeRules();
    if (sectionsToExport.includes('zoneRules')) sections.zoneRules = homey.app.getZoneRules();
    if (sectionsToExport.includes('temperatureRules')) sections.temperatureRules = homey.app.getTemperatureRules();
    if (sectionsToExport.includes('applianceRules')) sections.applianceRules = homey.app.getApplianceRules();
    if (sectionsToExport.includes('activityRules')) sections.activityRules = homey.app.getActivityRules();
    if (sectionsToExport.includes('scheduleRules')) sections.scheduleRules = homey.app.getScheduleRules();
    if (sectionsToExport.includes('autoMode')) sections.autoMode = homey.app.getAutoModeSettings();
    if (sectionsToExport.includes('displaySettings')) sections.displaySettings = homey.app.getDisplaySettings();
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
