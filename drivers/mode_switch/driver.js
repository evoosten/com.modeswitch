'use strict';

const Homey = require('homey');

class ModeSwitchDriver extends Homey.Driver {
  async onInit() {
    this.log('Mode & Switch driver ready');
  }

  async onPair(session) {
    session.setHandler('get_language', async () => ({ language: this.homey.i18n.getLanguage() }));
    session.setHandler('get_default_config', async () => ({
      name: 'Mode & Switch',
      lists: [],
      switches: [],
      defaultListId: '',
    }));

    session.setHandler('create_device', async config => this.makeDevice(config));

    session.setHandler('list_devices', async () => [
      this.makeDevice({ name: 'Mode & Switch', lists: [], switches: [], defaultListId: '' }),
    ]);
  }

  async onRepair(session, device) {
    session.setHandler('get_language', async () => ({ language: this.homey.i18n.getLanguage() }));
    session.setHandler('get_config', async () => device.exportConfig());

    session.setHandler('save_config', async config => {
      await device.importConfig(config, 'repair');
      await session.done();
      return true;
    });
  }

  makeDevice(config = {}) {
    const id = `mode-switch-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const lists = normalizeLists(config.lists || [], config.defaultListId);
    const switches = normalizeSwitches(config.switches || []);
    return {
      name: cleanName(config.name, 'Mode & Switch'),
      data: { id },
      store: {
        state: buildState(lists, switches),
      },
      settings: {
        lists_json: JSON.stringify(lists),
        switches_json: JSON.stringify(switches),
      },
    };
  }
}

function buildState(lists, switches) {
  const state = { lists: {}, switches: {} };
  for (const list of lists) state.lists[list.id] = list.activeId || null;
  for (const button of switches) state.switches[button.id] = !!button.on;
  return state;
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

module.exports = ModeSwitchDriver;
