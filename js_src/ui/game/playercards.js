
goog.provide('low.ui.game.PlayerCards');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.ui.game.soy');



/**
 * This shows the various quest and intrigue cards for a player.
 * @param {!low.model.Player} player
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.game.PlayerCards = function(player) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.game.PlayerCards');

  /** @private {!low.model.Player} */
  this.player_ = player;
};
goog.inherits(low.ui.game.PlayerCards, goog.ui.Component);


/** @override */
low.ui.game.PlayerCards.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.game.soy.PLAYER_CARDS));
};
