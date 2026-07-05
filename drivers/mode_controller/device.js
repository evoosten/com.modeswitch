'use strict';

const Homey = require('homey');

const MAIN_MODES = ['home', 'sleep', 'away', 'vacation'];
const STATIC_SUB_MODES = ['none', 'home_tv', 'home_romantic', 'home_game', 'home_movie'];

class ModeControllerDevice extends Homey.Device {
  getDefaultList() {
    const defaultList = this.getSetting('default_list') || 'main_mode_selector';
    const supportedLists = ['mode_selector', 'main_mode_selector', 'sub_mode_selector'];

    return supportedLists.includes(defaultList) ? defaultList : 'main_mode_selector';
  }

  async onInit() {
    await this._ensureDefaultListLast();

    if (this.hasCapability('mode_selector')) {
      this.registerCapabilityListener('mode_selector', async value => {
        await this.homey.app.applyMode(value, { source: 'device' });
        await this.syncMode(value);
      });
    }

    if (this.hasCapability('main_mode_selector')) {
      this.registerCapabilityListener('main_mode_selector', async value => {
        await this.homey.app.applyMode(value, { source: 'device' });
        await this.syncMode(value);
      });
    }

    if (this.hasCapability('sub_mode_selector')) {
      this.registerCapabilityListener('sub_mode_selector', async value => {
        if (!value || value === 'none') return;
        await this.homey.app.applyMode(value, { source: 'device' });
        await this.syncMode(value);
      });
    }

    await this.syncMode(this.homey.app.getCurrentMode());
    this.log('Mode Controller device initialized');
  }

  async onSettings({ changedKeys }) {
    if (changedKeys.includes('default_list')) {
      await this._ensureDefaultListLast();
      await this.syncMode(this.homey.app.getCurrentMode());
    }
  }

  async _ensureDefaultListLast() {
    const supportedLists = ['mode_selector', 'main_mode_selector', 'sub_mode_selector'];
    const defaultList = this.getDefaultList();
    const desiredOrder = supportedLists.filter(capabilityId => capabilityId !== defaultList).concat(defaultList);

    if (typeof this.getCapabilities !== 'function' || typeof this.addCapability !== 'function' || typeof this.removeCapability !== 'function') {
      return;
    }

    const currentOrder = this.getCapabilities().filter(capabilityId => supportedLists.includes(capabilityId));
    if (currentOrder.join('|') === desiredOrder.join('|')) return;

    for (const capabilityId of currentOrder) {
      try {
        await this.removeCapability(capabilityId);
      } catch (error) {
        this.error(`Failed to remove capability ${capabilityId}`, error);
      }
    }

    for (const capabilityId of desiredOrder) {
      if (this.hasCapability(capabilityId)) continue;
      try {
        await this.addCapability(capabilityId);
      } catch (error) {
        this.error(`Failed to add capability ${capabilityId}`, error);
      }
    }
  }

  async _setCapabilityIfSupported(capabilityId, value, allowedValues = null) {
    if (!this.hasCapability(capabilityId)) return;
    if (allowedValues && !allowedValues.includes(value)) return;
    if (this.getCapabilityValue(capabilityId) === value) return;
    try {
      await this.setCapabilityValue(capabilityId, value);
    } catch (error) {
      this.error(`Failed to sync capability ${capabilityId} to ${value}`, error);
    }
  }

  async syncMode(mode) {
    const parentMode = typeof this.homey.app.getParentMode === 'function'
      ? this.homey.app.getParentMode(mode)
      : (MAIN_MODES.includes(mode) ? mode : 'home');
    const subMode = MAIN_MODES.includes(mode) ? 'none' : mode;

    const capabilitySync = {
      mode_selector: () => this._setCapabilityIfSupported('mode_selector', mode),
      main_mode_selector: () => this._setCapabilityIfSupported('main_mode_selector', parentMode, MAIN_MODES),
      sub_mode_selector: () => this._setCapabilityIfSupported('sub_mode_selector', subMode, STATIC_SUB_MODES),
    };

    const defaultList = this.getDefaultList();
    const syncOrder = Object.keys(capabilitySync)
      .filter(capabilityId => capabilityId !== defaultList)
      .concat(defaultList);

    for (const capabilityId of syncOrder) {
      await capabilitySync[capabilityId]();
    }
  }
}

module.exports = ModeControllerDevice;
