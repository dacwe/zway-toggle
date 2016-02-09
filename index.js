/*** Toggle Z-Way HA module *******************************************

Version: 0.0.1
-----------------------------------------------------------------------------
Author: David Wennström
Description:
    Bind any actions on one device to toggle another device
******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function Toggle (id, controller) {
    // Call superconstructor first (AutomationModule)
    Toggle.super_.call(this, id, controller);
}

inherits(Toggle, AutomationModule);

_module = Toggle;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

Toggle.prototype.init = function (config) {
    Toggle.super_.prototype.init.call(this, config);

    var self = this;

    this.handlerLevel = function (sDev) {
        var that = self;

        self.config.targets.forEach(function(el) {
	    var vDev = that.controller.devices.get(el.target);

            if (vDev) {
		var level = vDev.get('metrics:level');
		level = (level === 'on') ? 'off':'on'; 
		vDev.performCommand(level);
            }
        });
    };

    // Setup metric update event listener
    if (self.config.sourceDevice.device)
	self.controller.devices.on(self.config.sourceDevice.device, 'change:metrics:level', self.handlerLevel);
};

Toggle.prototype.stop = function () {
    var self = this;
    
    // remove event listener
    if (self.config.sourceDevice.device)
	self.controller.devices.off(self.config.sourceDevice.device,'change:metrics:level', self.handlerLevel);

    Toggle.super_.prototype.stop.call(this);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------
