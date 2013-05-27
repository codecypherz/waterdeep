/**
 * Main bootstrapping file which gets the entire application going.
 */

goog.provide('low.Main');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.debug.Console');
/** @suppress {extraRequire} Needed for compilation warnings within closure. */
goog.require('goog.debug.ErrorHandler');
/** @suppress {extraRequire} Needed for compilation warnings within closure. */
goog.require('goog.events.EventWrapper');
goog.require('goog.log');
goog.require('low.handler.PlayerJoined');
goog.require('low.handler.PlayerLeft');
goog.require('low.handler.StartGameNotification');
goog.require('low.model.PageContainer');



/**
 * The container for all the main components of the application.
 * @constructor
 * @extends {goog.Disposable}
 */
low.Main = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.Main');

  // Set up logging for the entire application.
  if (!goog.debug.Console.instance) {
    goog.debug.Console.instance = new goog.debug.Console();
  }
  var console = goog.debug.Console.instance;
  console.setCapturing(true);
  goog.log.info(this.logger, 'Finished setting up logging');

  // Register an unload event to properly clean up resources.
  window.onbeforeunload = goog.bind(this.onUnload_, this);

  // Create message handlers.
  var handlers = [
    new low.handler.PlayerJoined(),
    new low.handler.PlayerLeft(),
    new low.handler.StartGameNotification()
  ];
  goog.array.forEach(handlers, this.registerDisposable, this);

  // Create and render the UI.
  var pageContainer = new low.model.PageContainer();
  this.registerDisposable(pageContainer);
  pageContainer.render();
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
low.Main.bootstrap = function() {
  new low.Main();
};


// Ensures the symbol will be visible after compiler renaming.
goog.exportSymbol('low.Main.bootstrap', low.Main.bootstrap);
