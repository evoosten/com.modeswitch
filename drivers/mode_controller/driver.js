'use strict';

const Homey = require('homey');

class ModeControllerDriver extends Homey.Driver {
  async onInit() {
    this.log('Mode Controller driver initialized');
  }

  async onPairListDevices() {
    return [{
      name: this.homey.__('driver.mode_controller.default_name'),
      data: {
        id: 'mode-controller-1',
      },
      store: {
        singleton: true,
      },
    }];
  }
}

module.exports = ModeControllerDriver;
