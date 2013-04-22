/**
 * The waiting page component.  This is where players wait to find other players
 * before starting a game.
 */

goog.provide('low.ui.waiting.WaitingRoom');

goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.waiting.WaitingRoom = function() {
  goog.base(this);
};
goog.inherits(low.ui.waiting.WaitingRoom, goog.ui.Component);


/** @override */
low.ui.waiting.WaitingRoom.prototype.createDom = function() {
  goog.base(this, 'createDom');
  this.getElement().innerHTML = 'Waiting';
};
