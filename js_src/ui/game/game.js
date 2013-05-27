
goog.provide('low.ui.game.Game');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.ui.game.Board');
goog.require('low.ui.game.Players');
goog.require('low.ui.game.soy');



/**
 * The game page component.  This is where the game is actually played.
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.game.Game = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.game.Game');

  /** @private {!low.ui.game.Board} */
  this.board_ = new low.ui.game.Board();
  this.addChild(this.board_);

  /** @private {!low.ui.game.Players} */
  this.players_ = new low.ui.game.Players();
  this.addChild(this.players_);
};
goog.inherits(low.ui.game.Game, goog.ui.Component);


/** @override */
low.ui.game.Game.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(low.ui.game.soy.GAME));

  this.board_.render(this.getElement());
  this.players_.render(this.getElement());
};
