
goog.provide('low.ui.waiting.StartGameButton');

goog.require('goog.dom.classes');
goog.require('goog.log');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');
goog.require('low.service.Game');
goog.require('low.ui.Css');



/**
 * The button that lets the moderator start the game.
 * @constructor
 * @extends {goog.ui.Button}
 */
low.ui.waiting.StartGameButton = function() {
  goog.base(this, 'Start Game');

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.waiting.StartGameButton');

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();
};
goog.inherits(low.ui.waiting.StartGameButton, goog.ui.Button);


/** @override */
low.ui.waiting.StartGameButton.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classes.add(this.getElement(), low.ui.Css.CALL_TO_ACTION);
};


/** @override */
low.ui.waiting.StartGameButton.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
      goog.ui.Component.EventType.ACTION,
      this.startGame_);
};


/**
 * Starts the current game.
 * @private
 */
low.ui.waiting.StartGameButton.prototype.startGame_ = function() {
  this.gameService_.startCurrentGame();
};
