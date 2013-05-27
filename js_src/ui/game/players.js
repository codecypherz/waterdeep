
goog.provide('low.ui.game.Players');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.ui.game.soy');



/**
 * This component shows all the information about all the players.
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.game.Players = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.game.Players');
};
goog.inherits(low.ui.game.Players, goog.ui.Component);


/** @override */
low.ui.game.Players.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(low.ui.game.soy.PLAYERS));
};
