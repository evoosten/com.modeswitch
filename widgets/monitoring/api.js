'use strict';

const FALLBACK_MODES = ['home', 'sleep', 'away', 'vacation'];

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function callSafe(fn, fallback) {
  try {
    return typeof fn === 'function' ? fn() : fallback;
  } catch (err) {
    return fallback;
  }
}

function getLanguage(app) {
  try {
    if (app && typeof app._getHomeyLanguage === 'function') return app._getHomeyLanguage();
  } catch (err) {}
  return 'nl';
}

function fallbackModeLabel(mode, locale) {
  const labels = {
    nl: { home: 'Thuis', sleep: 'Slapen', away: 'Afwezig', vacation: 'Vakantie' },
    en: { home: 'Home', sleep: 'Sleep', away: 'Away', vacation: 'Vacation' },
  };
  const lang = String(locale || 'nl').toLowerCase().startsWith('en') ? 'en' : 'nl';
  return (labels[lang] && labels[lang][mode]) || mode || '';
}

function getModes(app) {
  const modes = callSafe(app && typeof app.getAvailableModes === 'function' ? app.getAvailableModes.bind(app) : null, FALLBACK_MODES);
  const list = toArray(modes);
  return list.length ? list : FALLBACK_MODES;
}

function getLabel(app, mode, locale) {
  try {
    return app && typeof app.getModeLabel === 'function' ? app.getModeLabel(mode) : fallbackModeLabel(mode, locale);
  } catch (err) {
    return fallbackModeLabel(mode, locale);
  }
}

function getApplianceName(app, rule) {
  try {
    if (rule && rule.name) return rule.name;
    const locale = getLanguage(app);
    if (app && typeof app._getApplianceTypeLabel === 'function') return app._getApplianceTypeLabel(rule && rule.type, locale);
  } catch (err) {}
  return getLanguage(app) === 'en' ? 'Appliance' : 'Apparaat';
}

function normalizeStatus(status) {
  if (status === 'busy') return 'running';
  if (status === 'done') return 'ready';
  if (status === 'running' || status === 'ready') return status;
  return 'idle';
}

async function buildStatus(homey) {
  const app = homey && homey.app ? homey.app : {};
  const locale = getLanguage(app);
  const modesRaw = getModes(app);
  const modes = [];

  for (const mode of modesRaw) {
    var sub = app && typeof app.getSubModes === 'function' ? app.getSubModes().find(function(s){ return s.id === mode; }) : null;
    modes.push({ id: mode, label: getLabel(app, mode, locale), parentMode: sub ? sub.parentMode : null });
  }

  const applianceState = callSafe(app && typeof app.getApplianceState === 'function' ? app.getApplianceState.bind(app) : null, {}) || {};
  const applianceHistory = callSafe(app && typeof app.getApplianceHistory === 'function' ? app.getApplianceHistory.bind(app) : null, {}) || {};
  const rulesRaw = callSafe(app && typeof app.getApplianceRules === 'function' ? app.getApplianceRules.bind(app) : null, []);
  const appliances = [];

  for (const rule of toArray(rulesRaw)) {
    if (!rule || rule.enabled === false) continue;
    const state = rule.id && applianceState ? (applianceState[rule.id] || {}) : {};
    appliances.push({
      id: rule.id || '',
      name: getApplianceName(app, rule),
      type: rule.type || '',
      status: normalizeStatus(state.status),
      lastPower: typeof state.lastPower === 'number' ? Math.round(state.lastPower) : null,
      energyKwh: typeof state.finalEnergyKwh === 'number' ? Math.round(state.finalEnergyKwh * 1000) / 1000 : (typeof state.energyKwh === 'number' ? Math.round(state.energyKwh * 1000) / 1000 : null),
      durationMs: typeof state.durationMs === 'number' ? Math.max(0, Math.round(state.durationMs)) : null,
      finalDurationMs: typeof state.finalDurationMs === 'number' ? Math.max(0, Math.round(state.finalDurationMs)) : null,
      durationSeconds: typeof state.finalDurationMs === 'number' ? Math.max(0, Math.round(state.finalDurationMs / 1000)) : (typeof state.durationMs === 'number' ? Math.max(0, Math.round(state.durationMs / 1000)) : null),
      runStartedAt: state.runStartedAt || null,
      runningSince: state.runStartedAt ? new Date(state.runStartedAt).toISOString() : (state.startedAt ? new Date(state.startedAt).toISOString() : null),
      remainingTime: state.remainingTime || null,
      remainingTimeRaw: state.remainingTimeRaw ?? null,
      statusSourceValue: state.statusSourceValue ?? null,
      updatedAt: state.updatedAt || null,
      readyAt: state.readyAt || null,
      startedAt: state.startedAt || null,
      history: rule.id && applianceHistory ? toArray(applianceHistory[rule.id]).slice(0, Math.max(1, Math.min(50, Number(rule.historyLimit || 20)))) : [],
      lastSession: rule.id && applianceHistory && toArray(applianceHistory[rule.id]).length ? toArray(applianceHistory[rule.id])[0] : null,
    });
  }

  return {
    widgetVersion: '2.6.30.6',
    language: locale,
    modes,
    subModes: callSafe(app && typeof app.getSubModes === 'function' ? app.getSubModes.bind(app) : null, []) || [],
    currentMode: callSafe(app && typeof app.getCurrentMode === 'function' ? app.getCurrentMode.bind(app) : null, 'home') || 'home',
    appliances,
    updatedAt: Date.now(),
  };
}

module.exports = {
  async getStatus({ homey }) {
    return await buildStatus(homey);
  },

  async setMode({ homey, body }) {
    const app = homey && homey.app ? homey.app : {};
    const mode = body && typeof body.mode === 'string' ? body.mode : '';
    const modes = getModes(app);

    if (!modes.includes(mode)) throw new Error('Unsupported mode');
    if (typeof app.applyMode !== 'function') throw new Error(getLanguage(app) === 'en' ? 'App is not ready yet' : 'App is nog niet klaar');

    await app.applyMode(mode, { source: 'widget' });
    return await buildStatus(homey);
  },
};
