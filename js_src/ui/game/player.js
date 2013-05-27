
goog.provide('low.ui.game.Player');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.ui.game.PlayerCards');
goog.require('low.ui.game.Tavern');
goog.require('low.ui.game.soy');



/**
 * This shows all the information for the player.
 * @param {!low.model.Player} player
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.game.Player = function(player) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.game.Player');

  /** @private {!low.ui.game.Tavern} */
  this.tavern_ = new low.ui.game.Tavern(player);
  this.addChild(this.tavern_);

  /** @private {!low.ui.game.PlayerCards} */
  this.cards_ = new low.ui.game.PlayerCards(player);
  this.addChild(this.cards_);
};
goog.inherits(low.ui.game.Player, goog.ui.Component);


/** @override */
low.ui.game.Player.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(low.ui.game.soy.PLAYER));

  this.tavern_.render(this.getElement());
  this.cards_.render(this.getElement());
};
