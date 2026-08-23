'use strict';

const FALLBACK_MODES = ['home', 'sleep', 'away', 'vacation'];

function toArray(value) { return Array.isArray(value) ? value : []; }
function callSafe(fn, fallback) { try { return typeof fn === 'function' ? fn() : fallback; } catch (err) { return fallback; } }
function getLanguage(app) { try { if (app && typeof app._getHomeyLanguage === 'function') return app._getHomeyLanguage(); } catch (err) {} return 'nl'; }
function fallbackModeLabel(mode, locale) {
  const labels = { nl: { home: 'Thuis', sleep: 'Slapen', away: 'Afwezig', vacation: 'Vakantie' }, en: { home: 'Home', sleep: 'Sleep', away: 'Away', vacation: 'Vacation' } };
  const lang = String(locale || 'nl').toLowerCase().startsWith('en') ? 'en' : 'nl';
  return (labels[lang] && labels[lang][mode]) || mode || '';
}
function getModes(app) { const modes = callSafe(app && typeof app.getAvailableModes === 'function' ? app.getAvailableModes.bind(app) : null, FALLBACK_MODES); const list = toArray(modes); return list.length ? list : FALLBACK_MODES; }
function getLabel(app, mode, locale) { try { return app && typeof app.getModeLabel === 'function' ? app.getModeLabel(mode) : fallbackModeLabel(mode, locale); } catch (err) { return fallbackModeLabel(mode, locale); } }
function getApplianceName(app, rule) { try { if (rule && rule.name) return rule.name; const locale = getLanguage(app); if (app && typeof app._getApplianceTypeLabel === 'function') return app._getApplianceTypeLabel(rule && rule.type, locale); } catch (err) {} return getLanguage(app) === 'en' ? 'Appliance' : 'Apparaat'; }
function normalizeStatus(status) { if (status === 'busy') return 'running'; if (status === 'done') return 'ready'; if (status === 'running' || status === 'ready') return status; return 'idle'; }
function cleanId(value) { return String(value || '').trim(); }
function getSourceId(input) { return cleanId(input && (input.sourceDeviceId || input.modeSourceId)) || 'controller'; }
function getListId(input) { return cleanId(input && (input.sourceListId || input.modeListId)); }

function getModeSwitchDevice(homey, deviceId) {
  try {
    const driver = homey.drivers.getDriver('mode_switch');
    const devices = driver && typeof driver.getDevices === 'function' ? driver.getDevices() : [];
    return devices.find(device => {
      const data = typeof device.getData === 'function' ? device.getData() : {};
      const dataId = String(data && data.id ? data.id : '');
      const homeyId = String(typeof device.getId === 'function' ? device.getId() : '');
      return dataId === String(deviceId || '') || homeyId === String(deviceId || '');
    }) || null;
  } catch (err) { return null; }
}

async function buildControllerModes(app, locale) {
  const modesRaw = getModes(app);
  const subModes = callSafe(app && typeof app.getSubModes === 'function' ? app.getSubModes.bind(app) : null, []) || [];
  return {
    modes: modesRaw.map(mode => {
      const sub = subModes.find(item => item.id === mode);
      return { id: mode, label: getLabel(app, mode, locale), parentMode: sub ? sub.parentMode : null };
    }),
    subModes,
    currentMode: callSafe(app && typeof app.getCurrentMode === 'function' ? app.getCurrentMode.bind(app) : null, 'home') || 'home',
    source: { type: 'controller', id: 'controller', listId: 'controller_main' },
  };
}

async function buildDeviceModes(homey, sourceId, requestedListId) {
  const device = getModeSwitchDevice(homey, sourceId);
  if (!device) throw new Error('Mode & Switch device not found');
  const exported = typeof device.exportConfig === 'function' ? device.exportConfig() : { lists: [] };
  const lists = toArray(exported.lists);
  const list = lists.find(item => item.id === requestedListId) || lists.find(item => item.id === exported.defaultListId) || lists[0];
  if (!list) throw new Error('No list configured on this device');
  const state = typeof device.getState === 'function' ? await device.getState() : { lists: {} };
  const buttons = toArray(list.buttons);
  const normalized = buttons.map(button => ({
    id: button.id,
    label: button.name || button.id,
    parentMode: button.isSubMode ? (button.parentModeId || null) : null,
    icon: button.icon || '',
    accentColor: button.accentColor || button.color || '',
    imageUrl: button.imageUrl || button.backgroundImage || '',
  }));
  const mainModes = normalized.filter(item => !item.parentMode);
  const mainIds = new Set(mainModes.map(item => item.id));
  const subModes = normalized.filter(item => item.parentMode && mainIds.has(item.parentMode));
  return {
    modes: mainModes,
    subModes,
    currentMode: (state.lists && state.lists[list.id]) || list.activeId || (buttons[0] && buttons[0].id) || '',
    switches: toArray(exported.switches).map(button => ({
      id: button.id,
      name: button.name || button.id,
      on: !!(state.switches && state.switches[button.id]),
    })),
    source: { type: 'mode_switch', id: sourceId, name: typeof device.getName === 'function' ? device.getName() : 'Mode & Switch', listId: list.id, listName: list.name },
  };
}

async function buildStatus(homey, input = {}) {
  const app = homey && homey.app ? homey.app : {};
  const locale = getLanguage(app);
  const sourceId = getSourceId(input);
  const listId = getListId(input);
  const modeData = sourceId === 'controller' ? await buildControllerModes(app, locale) : await buildDeviceModes(homey, sourceId, listId);

  const applianceState = callSafe(app && typeof app.getApplianceState === 'function' ? app.getApplianceState.bind(app) : null, {}) || {};
  const applianceHistory = callSafe(app && typeof app.getApplianceHistory === 'function' ? app.getApplianceHistory.bind(app) : null, {}) || {};
  const rulesRaw = callSafe(app && typeof app.getApplianceRules === 'function' ? app.getApplianceRules.bind(app) : null, []);
  const appliances = [];
  for (const rule of toArray(rulesRaw)) {
    if (!rule || rule.enabled === false) continue;
    const state = rule.id && applianceState ? (applianceState[rule.id] || {}) : {};
    appliances.push({
      id: rule.id || '', name: getApplianceName(app, rule), type: rule.type || '', status: normalizeStatus(state.status),
      lastPower: typeof state.lastPower === 'number' ? Math.round(state.lastPower) : null,
      energyKwh: typeof state.finalEnergyKwh === 'number' ? Math.round(state.finalEnergyKwh * 1000) / 1000 : (typeof state.energyKwh === 'number' ? Math.round(state.energyKwh * 1000) / 1000 : null),
      durationMs: typeof state.durationMs === 'number' ? Math.max(0, Math.round(state.durationMs)) : null,
      finalDurationMs: typeof state.finalDurationMs === 'number' ? Math.max(0, Math.round(state.finalDurationMs)) : null,
      durationSeconds: typeof state.finalDurationMs === 'number' ? Math.max(0, Math.round(state.finalDurationMs / 1000)) : (typeof state.durationMs === 'number' ? Math.max(0, Math.round(state.durationMs / 1000)) : null),
      runStartedAt: state.runStartedAt || null,
      runningSince: state.runStartedAt ? new Date(state.runStartedAt).toISOString() : (state.startedAt ? new Date(state.startedAt).toISOString() : null),
      updatedAt: state.updatedAt || null, readyAt: state.readyAt || null, startedAt: state.startedAt || null,
    });
  }

  return {
    widgetVersion: '3.0.1', language: locale,
    modes: modeData.modes, subModes: modeData.subModes, currentMode: modeData.currentMode, switches: modeData.switches || [], source: modeData.source,
    appliances,
    displaySettings: callSafe(app && typeof app.getDisplaySettings === 'function' ? app.getDisplaySettings.bind(app) : null, {}) || {},
    environment: await callSafe(app && typeof app.getEnvironment === 'function' ? app.getEnvironment.bind(app) : null, {}) || {},
    updatedAt: Date.now(),
  };
}

module.exports = {
  async getStatus({ homey, query }) { return buildStatus(homey, query || {}); },
  async setMode({ homey, body }) {
    const app = homey && homey.app ? homey.app : {};
    const mode = body && typeof body.mode === 'string' ? body.mode : '';
    const sourceId = getSourceId(body || {});
    const listId = getListId(body || {});
    if (sourceId === 'controller') {
      const modes = getModes(app);
      if (!modes.includes(mode)) throw new Error('Unsupported mode');
      if (typeof app.applyMode !== 'function') throw new Error(getLanguage(app) === 'en' ? 'App is not ready yet' : 'App is nog niet klaar');
      await app.applyMode(mode, { source: 'widget' });
    } else {
      const device = getModeSwitchDevice(homey, sourceId);
      if (!device) throw new Error('Mode & Switch device not found');
      const exported = typeof device.exportConfig === 'function' ? device.exportConfig() : { lists: [] };
      const list = toArray(exported.lists).find(item => item.id === listId) || toArray(exported.lists).find(item => item.id === exported.defaultListId) || toArray(exported.lists)[0];
      if (!list) throw new Error('No list configured on this device');
      await device.setListMode(list.id, mode, 'widget');
    }
    return buildStatus(homey, body || {});
  },
  async setSwitch({ homey, body }) {
    const sourceId = getSourceId(body || {});
    if (!sourceId || sourceId === 'controller') throw new Error('Choose a Mode & Switch device');
    const buttonId = cleanId(body && body.buttonId);
    const isOn = !!(body && body.isOn);
    const device = getModeSwitchDevice(homey, sourceId);
    if (!device) throw new Error('Mode & Switch device not found');
    await device.setSwitchState(buttonId, isOn, 'widget');
    return buildStatus(homey, body || {});
  },
};
