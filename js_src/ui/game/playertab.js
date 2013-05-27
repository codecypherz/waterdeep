
goog.provide('low.ui.game.PlayerTab');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.ui.game.soy');



/**
 * This represents the tab for the player.  When clicked, more information about
 * the player will be shown.
 * @param {!low.model.Player} player
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.game.PlayerTab = function(player) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.game.PlayerTab');

  /** @private {!low.model.Player} */
  this.player_ = player;
};
goog.inherits(low.ui.game.PlayerTab, goog.ui.Component);


/** @override */
low.ui.game.PlayerTab.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.game.soy.PLAYER_TAB, {
        name: this.player_.getName()
      }));
};


/**
 * @return {!low.model.Player}
 */
low.ui.game.PlayerTab.prototype.getPlayer = function() {
  return this.player_;
};
