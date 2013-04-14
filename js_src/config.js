/**
 * The configuration that might be used for the entire application.
 */

goog.provide('low.Config');

goog.require('goog.Disposable');
goog.require('goog.Uri');



/**
 * The configuration for the entire application.
 * @constructor
 * @extends {goog.Disposable}
 */
low.Config = function() {
  goog.base(this);

  // Parse the URL for configuration.
  var uri = goog.Uri.parse(window.location.href);

  /**
   * @type {!low.Config.Mode}
   * @private
   */
  this.mode_ = low.Config.Mode.NORMAL;

  // Figure out the mode of the application.
  var modeString = uri.getParameterValue(low.Config.UrlParameter.MODE);
  if (modeString) {
    var mode = modeString.toLowerCase();
    if (mode == low.Config.Mode.RAW) {
      this.mode_ = low.Config.Mode.RAW;
    }
  }
};
goog.inherits(low.Config, goog.Disposable);
goog.addSingletonGetter(low.Config);


/**
 * The various URL parameters to the application.
 * @enum {string}
 */
low.Config.UrlParameter = {
  MODE: 'mode'               // The mode (such as "raw" mode)
};


/**
 * The various modes of the application.
 * @enum {string}
 */
low.Config.Mode = {
  NORMAL: 'normal',
  RAW: 'raw'
};


/**
 * Gets the current mode of the application.
 * @return {!low.Config.Mode} The current mode of the application.
 */
low.Config.prototype.getMode = function() {
  return this.mode_;
};
