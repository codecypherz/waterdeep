
goog.provide('low.ui.game.Board');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.ui.game.soy');



/**
 * This is the actual "board" part of the board game.  Agents in play will be
 * rendered here along with all buildings and more.
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.game.Board = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.game.Board');
};
goog.inherits(low.ui.game.Board, goog.ui.Component);


/** @override */
low.ui.game.Board.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(low.ui.game.soy.BOARD));
};
