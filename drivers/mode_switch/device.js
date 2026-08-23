'use strict';

const Homey = require('homey');

const MAX_LIST_CAPABILITIES = 10;
const MAX_SWITCH_CAPABILITIES = 20;

class ModeSwitchDevice extends Homey.Device {
  async onInit() {
    this.config = this.loadConfigFromSettings();
    this.registerCapabilityListeners();
    await this.ensureState();
    await this.reconcileDynamicCapabilities();
    await this.updateCapabilitySummary();
    this.log(`${this.getName()} ready`);
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    const oldConfig = this.config || this.loadConfig(oldSettings);
    const newConfig = this.loadConfig(newSettings);

    this.config = newConfig;
    await this.ensureState();
    await this.reconcileDynamicCapabilities();
    await this.updateCapabilitySummary();

    if (changedKeys.includes('lists_json')) {
      await this.triggerChangedListModes(oldConfig, newConfig);
    }

    if (changedKeys.includes('switches_json')) {
      await this.triggerChangedSwitches(oldConfig, newConfig);
    }
  }

  registerCapabilityListeners() {
    for (let index = 1; index <= MAX_LIST_CAPABILITIES; index++) {
      const capabilityId = getListCapabilityId(index);
      this.registerCapabilityListener(capabilityId, async value => {
        const list = this.getListForCapability(capabilityId);
        if (!list) return;
        await this.setListMode(list.id, value, 'device');
      });
    }

    for (let index = 1; index <= MAX_SWITCH_CAPABILITIES; index++) {
      const capabilityId = getSwitchCapabilityId(index);
      this.registerCapabilityListener(capabilityId, async value => {
        const button = this.getSwitchForCapability(capabilityId);
        if (!button) return;
        await this.setSwitchState(button.id, !!value, 'device');
      });
    }
  }

  exportConfig() {
    const settings = this.getSettings();
    const config = this.loadConfig(settings);
    return {
      name: this.getName(),
      lists: config.lists,
      switches: config.switches,
      defaultListId: (config.lists.find(list => list.isDefault) || config.lists[0] || {}).id || '',
    };
  }

  async importConfig(config, source = 'repair') {
    const oldConfig = this.config || this.loadConfigFromSettings();
    const lists = normalizeLists(config.lists || [], config.defaultListId);
    const switches = normalizeSwitches(config.switches || []);
    const newConfig = { lists, switches };

    if (config.name && config.name !== this.getName()) {
      await this.setName(config.name);
    }

    await this.setSettings({
      lists_json: JSON.stringify(lists),
      switches_json: JSON.stringify(switches),
    });

    this.config = newConfig;
    await this.ensureStateFromConfig(newConfig);
    await this.reconcileDynamicCapabilities();
    await this.updateCapabilitySummary();
    await this.triggerChangedListModes(oldConfig, newConfig).catch(this.error);
    await this.triggerChangedSwitches(oldConfig, newConfig).catch(this.error);
    this.log(`Configuration updated by ${source}`);
  }

  loadConfigFromSettings() {
    return this.loadConfig(this.getSettings());
  }

  loadConfig(settings) {
    return {
      lists: normalizeLists(parseJson(settings.lists_json, [])),
      switches: normalizeSwitches(parseJson(settings.switches_json, [])),
    };
  }

  async ensureState() {
    const state = (await this.getStoreValue('state')) || { lists: {}, switches: {} };
    state.lists = state.lists || {};
    state.switches = state.switches || {};

    for (const list of this.config.lists) {
      const activeId = list.activeId || (list.buttons[0] && list.buttons[0].id) || null;
      if (!state.lists[list.id]) state.lists[list.id] = activeId;
      if (list.activeId && state.lists[list.id] !== list.activeId) state.lists[list.id] = list.activeId;
    }

    for (const button of this.config.switches) {
      if (typeof state.switches[button.id] !== 'boolean') state.switches[button.id] = !!button.on;
      if (typeof button.on === 'boolean') state.switches[button.id] = button.on;
    }

    await this.setStoreValue('state', state);
  }

  async ensureStateFromConfig(config) {
    this.config = config;
    await this.ensureState();
  }


  getDefaultListId(lists = null) {
    const availableLists = Array.isArray(lists) ? lists : (Array.isArray(this.config && this.config.lists) ? this.config.lists : []);
    const configured = availableLists.find(list => list.isDefault);
    return (configured || availableLists[0] || {}).id || '';
  }

  getCapabilityLists() {
    const lists = Array.isArray(this.config && this.config.lists) ? this.config.lists.slice(0, MAX_LIST_CAPABILITIES) : [];
    const defaultListId = this.getDefaultListId(lists);
    if (!defaultListId || !lists.some(list => list.id === defaultListId)) return lists;
    return lists.filter(list => list.id !== defaultListId).concat(lists.find(list => list.id === defaultListId));
  }

  async reconcileDynamicCapabilities() {
    const state = await this.getState();

    for (let index = 1; index <= MAX_LIST_CAPABILITIES; index++) {
      const capabilityId = getListCapabilityId(index);
      const list = this.getCapabilityLists()[index - 1];

      if (list) {
        if (!this.hasCapability(capabilityId)) await this.addCapability(capabilityId).catch(this.error);

        const values = list.buttons.length
          ? list.buttons.map(button => ({
              id: button.id,
              title: localizedSame(getButtonDisplayName(button)),
            }))
          : [{ id: 'none', title: localizedNotConfigured() }];

        await this.setCapabilityOptions(capabilityId, {
          title: localizedSame(list.name),
          values,
        }).catch(this.error);

        const activeId = state.lists[list.id] || list.activeId || (list.buttons[0] && list.buttons[0].id) || 'none';
        await this.setCapabilityValue(capabilityId, activeId).catch(this.error);
      } else if (this.hasCapability(capabilityId)) {
        await this.removeCapability(capabilityId).catch(this.error);
      }
    }

    for (let index = 1; index <= MAX_SWITCH_CAPABILITIES; index++) {
      const capabilityId = getSwitchCapabilityId(index);
      const button = this.config.switches[index - 1];

      if (button) {
        if (!this.hasCapability(capabilityId)) await this.addCapability(capabilityId).catch(this.error);
        await this.setCapabilityOptions(capabilityId, {
          title: localizedSame(button.name),
        }).catch(this.error);
        await this.setCapabilityValue(capabilityId, !!state.switches[button.id]).catch(this.error);
      } else if (this.hasCapability(capabilityId)) {
        await this.removeCapability(capabilityId).catch(this.error);
      }
    }

    await this.setStoreValue('capability_map', this.getCapabilityMap()).catch(this.error);
  }

  getCapabilityMap() {
    const lists = {};
    const switches = {};

    this.getCapabilityLists().slice(0, MAX_LIST_CAPABILITIES).forEach((list, index) => {
      lists[getListCapabilityId(index + 1)] = list.id;
    });

    this.config.switches.slice(0, MAX_SWITCH_CAPABILITIES).forEach((button, index) => {
      switches[getSwitchCapabilityId(index + 1)] = button.id;
    });

    return { lists, switches };
  }

  getListForCapability(capabilityId) {
    const index = Number(capabilityId.replace('mode_switch_mode_', '')) - 1;
    return this.getCapabilityLists()[index] || null;
  }

  getSwitchForCapability(capabilityId) {
    const index = Number(capabilityId.replace('mode_switch_switch_', '')) - 1;
    return this.config.switches[index] || null;
  }

  async updateCapabilitySummary() {
    const state = await this.getState();

    await this.updateDynamicCapabilityValues(state);
  }

  async updateDynamicCapabilityValues(state) {
    for (let index = 1; index <= MAX_LIST_CAPABILITIES; index++) {
      const capabilityId = getListCapabilityId(index);
      const list = this.getCapabilityLists()[index - 1];
      if (!list || !this.hasCapability(capabilityId)) continue;
      const activeId = state.lists[list.id] || list.activeId || (list.buttons[0] && list.buttons[0].id) || 'none';
      await this.setCapabilityValue(capabilityId, activeId).catch(this.error);
    }

    for (let index = 1; index <= MAX_SWITCH_CAPABILITIES; index++) {
      const capabilityId = getSwitchCapabilityId(index);
      const button = this.config.switches[index - 1];
      if (!button || !this.hasCapability(capabilityId)) continue;
      await this.setCapabilityValue(capabilityId, !!state.switches[button.id]).catch(this.error);
    }
  }

  async getState() {
    const state = (await this.getStoreValue('state')) || { lists: {}, switches: {} };
    state.lists = state.lists || {};
    state.switches = state.switches || {};
    return state;
  }

  async setListMode(listId, modeId, source = 'app') {
    const list = this.findList(listId);
    if (!list) throw new Error('List not found');
    const mode = list.buttons.find(button => button.id === modeId);
    if (!mode) throw new Error(localizedMessage(this.homey, 'modeNotFound'));

    const state = await this.getState();
    const oldModeId = state.lists[list.id];
    state.lists[list.id] = mode.id;
    await this.setStoreValue('state', state);
    await this.updateCapabilitySummary();

    if (oldModeId !== mode.id) {
      await this.homey.app.triggerModeSwitchListModeChanged(this, list, mode).catch(this.error);
      this.log(`List ${list.name} changed to ${mode.name} by ${source}`);
    }
  }

  async setSwitchState(buttonId, isOn, source = 'app') {
    const button = this.findSwitch(buttonId);
    if (!button) throw new Error('Button not found');

    const state = await this.getState();
    const oldValue = !!state.switches[button.id];
    state.switches[button.id] = !!isOn;
    await this.setStoreValue('state', state);
    await this.updateCapabilitySummary();

    if (oldValue !== !!isOn) {
      const changedButton = { ...button, on: !!isOn };
      await this.homey.app.triggerModeSwitchSwitchChanged(this, changedButton).catch(this.error);
      this.log(`Switch ${button.name} changed to ${isOn ? 'on' : 'off'} by ${source}`);
    }
  }

  async isListModeActive(listId, modeId) {
    const state = await this.getState();
    return state.lists[listId] === modeId;
  }

  async isSwitchOn(buttonId) {
    const state = await this.getState();
    return !!state.switches[buttonId];
  }

  getListOptions(query = '') {
    return this.filterOptions(this.config.lists.map(list => ({ id: list.id, name: list.name })), query);
  }

  getModeOptions(listId, query = '') {
    const list = this.findList(listId);
    if (!list) return [];
    return this.filterOptions(list.buttons.map(mode => ({ id: mode.id, name: mode.name })), query);
  }

  getSwitchOptions(query = '') {
    return this.filterOptions(this.config.switches.map(button => ({ id: button.id, name: button.name })), query);
  }

  filterOptions(items, query) {
    const q = String(query || '').toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q));
  }

  findList(listId) {
    return this.config.lists.find(list => list.id === listId);
  }

  findSwitch(buttonId) {
    return this.config.switches.find(button => button.id === buttonId);
  }

  async triggerChangedListModes(oldConfig, newConfig) {
    const state = await this.getState();
    for (const list of newConfig.lists) {
      const oldList = oldConfig.lists.find(item => item.id === list.id);
      const activeId = state.lists[list.id];
      const oldActiveId = oldList && oldList.activeId;
      if (activeId && activeId !== oldActiveId) {
        const mode = list.buttons.find(button => button.id === activeId);
        if (mode) await this.homey.app.triggerModeSwitchListModeChanged(this, list, mode).catch(this.error);
      }
    }
  }

  async triggerChangedSwitches(oldConfig, newConfig) {
    const state = await this.getState();
    for (const button of newConfig.switches) {
      const oldButton = oldConfig.switches.find(item => item.id === button.id);
      const isOn = !!state.switches[button.id];
      if (!oldButton || !!oldButton.on !== isOn) {
        await this.homey.app.triggerModeSwitchSwitchChanged(this, { ...button, on: isOn }).catch(this.error);
      }
    }
  }
}

function getListCapabilityId(index) {
  return `mode_switch_mode_${index}`;
}

function getSwitchCapabilityId(index) {
  return `mode_switch_switch_${index}`;
}

function parseJson(value, fallback) {
  if (!value || !String(value).trim()) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

function normalizeLists(lists, defaultListId = '') {
  return lists
    .map((list, index) => {
      const name = cleanName(list.name, `Lijst ${index + 1}`);
      const id = cleanId(list.id || name);
      const buttons = normalizeButtons(list.buttons || []);
      const activeId = list.activeId && buttons.some(button => button.id === cleanId(list.activeId))
        ? cleanId(list.activeId)
        : (buttons[0] && buttons[0].id) || null;
      return { id, name, buttons, activeId, isDefault: cleanId(defaultListId) === id || list.isDefault === true };
    })
    .filter(list => list.id && list.name)
    .map((list, index, all) => ({
      ...list,
      isDefault: all.some(item => item.isDefault) ? list.isDefault : index === 0,
    }));
}

function normalizeButtons(buttons) {
  const normalized = buttons
    .map((button, index) => {
      const name = cleanName(button.name, `Knop ${index + 1}`);
      const id = cleanId(button.id || name);
      return {
        id,
        name,
        isSubMode: button && button.isSubMode === true,
        parentModeId: cleanId(button && button.parentModeId ? button.parentModeId : ''),
      };
    })
    .filter(button => button.id && button.name);

  const mainIds = new Set(normalized.filter(button => !button.isSubMode).map(button => button.id));
  return normalized.map(button => {
    if (!button.isSubMode || !mainIds.has(button.parentModeId) || button.parentModeId === button.id) {
      return { id: button.id, name: button.name };
    }
    return { id: button.id, name: button.name, isSubMode: true, parentModeId: button.parentModeId };
  });
}

function getButtonDisplayName(button) {
  const name = cleanName(button && button.name, 'Mode');
  return button && button.isSubMode ? `↳ ${name}` : name;
}

function normalizeSwitches(buttons) {
  return buttons
    .map((button, index) => {
      const name = cleanName(button.name, `Aan/uit ${index + 1}`);
      return { id: cleanId(button.id || name), name, on: !!button.on };
    })
    .filter(button => button.id && button.name);
}

function cleanName(value, fallback) {
  const name = String(value || '').trim();
  return name || fallback;
}

function cleanId(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}


function localizedSame(value) {
  const text = String(value || '');
  return { nl: text, en: text, de: text, fr: text, es: text };
}

function localizedNotConfigured() {
  return {
    nl: 'Niet ingesteld',
    en: 'Not configured',
    de: 'Nicht eingerichtet',
    fr: 'Non configuré',
    es: 'No configurado',
  };
}

function localizedMessage(homey, key) {
  const messages = {
    modeNotFound: {
      nl: 'Modus niet gevonden',
      en: 'Mode not found',
      de: 'Modus nicht gefunden',
      fr: 'Mode introuvable',
      es: 'Modo no encontrado',
    },
  };
  const language = String(homey?.i18n?.getLanguage?.() || 'en').toLowerCase().split('-')[0];
  const values = messages[key] || {};
  return values[language] || values.en || key;
}

module.exports = ModeSwitchDevice;
