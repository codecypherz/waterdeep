/**
 * Main bootstrapping file which gets the entire application going.
 */

goog.provide('low');
goog.provide('low.Main');

goog.require('goog.Disposable');
goog.require('goog.debug.Console');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
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

  if (this.config_.getMode() == low.Config.Mode.RAW) {
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


/**
 * Main entry point to the program.  All bootstrapping happens here.
 */
low.bootstrap = function() {
  new low.Main();
};


// Ensures the symbol will be visible after compiler renaming.
goog.exportSymbol('low.bootstrap', low.bootstrap);
