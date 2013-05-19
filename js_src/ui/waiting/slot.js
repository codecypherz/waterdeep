
goog.provide('low.ui.waiting.Slot');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.service.Game');
goog.require('low.ui.waiting.soy');



/**
 * The widget representing an empty slot for the game.  Can be open or closed.
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.waiting.Slot = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.waiting.Slot');

  // Get a reference to self.
  var gameService = low.service.Game.getInstance();
  var game = gameService.getCurrentGame();

  // TODO Implement open/close.
};
goog.inherits(low.ui.waiting.Slot, goog.ui.Component);


/** @override */
low.ui.waiting.Slot.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.waiting.soy.SLOT));
};
