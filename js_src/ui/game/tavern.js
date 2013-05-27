
goog.provide('low.ui.game.Tavern');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.ui.game.soy');



/**
 * This shows the tavern for a player.
 * @param {!low.model.Player} player
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.game.Tavern = function(player) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.game.Tavern');

  /** @private {!low.model.Player} */
  this.player_ = player;
};
goog.inherits(low.ui.game.Tavern, goog.ui.Component);


/** @override */
low.ui.game.Tavern.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(low.ui.game.soy.TAVERN));
};
