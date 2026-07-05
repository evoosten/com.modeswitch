'use strict';

const FALLBACK_MODES = ['home', 'sleep', 'away', 'vacation'];

function safeArray(value) { return Array.isArray(value) ? value : []; }
function safeCall(fn, fallback) { try { return typeof fn === 'function' ? fn() : fallback; } catch (err) { return fallback; } }
function lang(app) { try { return app && typeof app._getHomeyLanguage === 'function' ? app._getHomeyLanguage() : 'nl'; } catch (err) { return 'nl'; } }
function fallbackLabel(mode, locale) {
  const labels = { nl: { home: 'Thuis', sleep: 'Slapen', away: 'Afwezig', vacation: 'Vakantie' }, en: { home: 'Home', sleep: 'Sleep', away: 'Away', vacation: 'Vacation' } };
  const l = String(locale || 'nl').startsWith('en') ? 'en' : 'nl';
  return (labels[l] && labels[l][mode]) || mode;
}
function getModes(app) {
  const locale = lang(app);
  const ids = safeCall(app && app.getAvailableModes && app.getAvailableModes.bind(app), FALLBACK_MODES);
  const subModes = safeCall(app && app.getSubModes && app.getSubModes.bind(app), []);
  return safeArray(ids).map(id => {
    const sub = safeArray(subModes).find(s => s && s.id === id);
    let label = fallbackLabel(id, locale);
    try { if (app && app.getModeLabel) label = app.getModeLabel(id); } catch (err) {}
    return { id, label, parentMode: sub ? sub.parentMode : null };
  });
}
function summarizeRules(rules) {
  const list = safeArray(rules);
  return { total: list.length, enabled: list.filter(r => r && r.enabled !== false).length };
}
function buildDashboard(homey) {
  const app = homey && homey.app ? homey.app : {};
  const applianceState = safeCall(app.getApplianceState && app.getApplianceState.bind(app), {}) || {};
  const applianceRules = safeCall(app.getApplianceRules && app.getApplianceRules.bind(app), []);
  const subModes = safeCall(app.getSubModes && app.getSubModes.bind(app), []);
  const autoMode = safeCall(app.getAutoModeSettings && app.getAutoModeSettings.bind(app), {}) || {};
  const zoneRules = safeCall(app.getZoneRules && app.getZoneRules.bind(app), []);
  const temperatureRules = safeCall(app.getTemperatureRules && app.getTemperatureRules.bind(app), []);
  const scheduleRules = safeCall(app.getScheduleRules && app.getScheduleRules.bind(app), []);
  const modeRules = safeCall(app.getModeRules && app.getModeRules.bind(app), {}) || {};
  const currentMode = safeCall(app.getCurrentMode && app.getCurrentMode.bind(app), 'home') || 'home';
  const appliances = safeArray(applianceRules).map(rule => {
    const state = rule && rule.id ? (applianceState[rule.id] || {}) : {};
    return {
      id: rule.id || '', name: rule.name || rule.type || 'Apparaat', enabled: rule.enabled !== false,
      status: state.status || 'idle', lastPower: typeof state.lastPower === 'number' ? Math.round(state.lastPower) : null,
      energyKwh: typeof state.finalEnergyKwh === 'number' ? Math.round(state.finalEnergyKwh * 1000) / 1000 : (typeof state.energyKwh === 'number' ? Math.round(state.energyKwh * 1000) / 1000 : null),
      startedAt: state.startedAt || null, readyAt: state.readyAt || null,
    };
  });
  return {
    widgetVersion: '2.6.30.5', language: lang(app), currentMode,
    modes: getModes(app), subModes: safeArray(subModes), autoMode,
    applianceRules: safeArray(applianceRules), scheduleRules: safeArray(scheduleRules), zoneRules: safeArray(zoneRules), temperatureRules: safeArray(temperatureRules), appliances,
    summaries: {
      subModes: safeArray(subModes).length,
      modeRules: Object.keys(modeRules || {}).length,
      zoneRules: summarizeRules(zoneRules), temperatureRules: summarizeRules(temperatureRules),
      applianceRules: summarizeRules(applianceRules), scheduleRules: summarizeRules(scheduleRules),
    },
    updatedAt: Date.now(),
  };
}

module.exports = {
  async getDashboard({ homey }) { return buildDashboard(homey); },
  async setMode({ homey, body }) {
    const mode = body && typeof body.mode === 'string' ? body.mode : '';
    if (!mode) throw new Error('Missing mode');
    await homey.app.applyMode(mode, { source: 'settings-widget' });
    return buildDashboard(homey);
  },
  async saveSubModes({ homey, body }) {
    const subModes = await homey.app.saveSubModes(safeArray(body && body.subModes));
    return { ok: true, subModes, dashboard: buildDashboard(homey) };
  },
  async saveAppliances({ homey, body }) {
    const current = safeCall(homey.app.getApplianceRules.bind(homey.app), []);
    const updates = body && body.enabledById && typeof body.enabledById === 'object' ? body.enabledById : {};
    const next = safeArray(current).map(rule => Object.prototype.hasOwnProperty.call(updates, rule.id) ? { ...rule, enabled: updates[rule.id] === true } : rule);
    const applianceRules = await homey.app.saveApplianceRules(next);
    return { ok: true, applianceRules, dashboard: buildDashboard(homey) };
  },
  async saveAutoMode({ homey, body }) {
    const current = safeCall(homey.app.getAutoModeSettings.bind(homey.app), {}) || {};
    const input = body && body.autoMode && typeof body.autoMode === 'object' ? body.autoMode : {};
    const autoMode = await homey.app.saveAutoModeSettings({ ...current, ...input });
    return { ok: true, autoMode, dashboard: buildDashboard(homey) };
  },
  async saveScheduleRules({ homey, body }) {
    const current = safeCall(homey.app.getScheduleRules.bind(homey.app), []);
    const input = safeArray(body && body.scheduleRules);
    const byId = new Map(input.map(rule => [rule && rule.id, rule]).filter(item => item[0]));
    const next = safeArray(current).map(rule => byId.has(rule.id) ? { ...rule, ...byId.get(rule.id) } : rule);
    const scheduleRules = await homey.app.saveScheduleRules(next);
    return { ok: true, scheduleRules, dashboard: buildDashboard(homey) };
  },
};
