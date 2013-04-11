/**
 * Main bootstrapping file which gets the entire application going.
 */

/** @suppress {extraProvide} Needed to specify root for compiler. */
goog.provide('low');
goog.provide('low.Main');

goog.require('goog.Disposable');
goog.require('goog.debug.Console');
/** @suppress {extraRequire} Added for compilation warnings. */
goog.require('goog.debug.ErrorHandler');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
/** @suppress {extraRequire} Added for compilation warnings. */
goog.require('goog.events.EventHandler');
/** @suppress {extraRequire} Added for compilation warnings. */
goog.require('goog.net.XhrLite');
goog.require('low.Config');



/**
 * The container for all the main components of the application.
 * @constructor
 * @extends {goog.Disposable}
 */
low.Main = function() {
  goog.base(this);

  /** @protected {!goog.debug.Logger} */
  this.logger = goog.debug.Logger.getLogger('low.Main');

  /** @private {!low.Config} */
  this.config_ = low.Config.getInstance();

  // Set up logging for the entire application.
  if (!goog.debug.Console.instance) {
    goog.debug.Console.instance = new goog.debug.Console();
  }
  var console = goog.debug.Console.instance;
  console.setCapturing(true);

  if (this.config_.isRawMode()) {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.INFO);
  } else {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.WARNING);
  }
  this.logger.info('Finished setting up logging');

  // Register an unload event to properly clean up resources.
  window.onbeforeunload = goog.bind(this.onUnload_, this);
};
goog.inherits(low.Main, goog.Disposable);


/**
 * Called when the application unloads.
 * @private
 */
low.Main.prototype.onUnload_ = function() {
  this.disposeInternal();
};
