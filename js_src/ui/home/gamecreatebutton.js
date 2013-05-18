
goog.provide('low.ui.home.GameCreateButton');

goog.require('goog.log');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');
goog.require('low.model.Page');
goog.require('low.service.Game');
goog.require('low.service.Token');
goog.require('low.ui.home.GameDialog');



/**
 * When clicked, this will prompt the user to create a new game.
 * @constructor
 * @extends {goog.ui.Button}
 */
low.ui.home.GameCreateButton = function() {
  goog.base(this, null);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.GameCreateButton');

  /** @private {!low.service.Token} */
  this.tokenService_ = low.service.Token.getInstance();

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();
};
goog.inherits(low.ui.home.GameCreateButton, goog.ui.Button);


/** @override */
low.ui.home.GameCreateButton.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
      goog.ui.Component.EventType.ACTION,
      this.promptToCreate_);
};


/**
 * Prompts the user to create a new game.
 * @private
 */
low.ui.home.GameCreateButton.prototype.promptToCreate_ = function() {
  if (this.gameService_.isBusy()) {
    alert('Busy either joining or creating a game.');
    return;
  }
  goog.log.info(this.logger, 'Showing the game create dialog.');

  var gameDialog = new low.ui.home.GameDialog('Create game', 'Create');
  gameDialog.prompt().addCallback(function() {
    this.onConfirm_(gameDialog.getName(), gameDialog.getColor());
  }, this);
};


/**
 * Called when the user confirms their desire to create a game.
 * @param {string} name The name they chose.
 * @param {!low.model.Player.Color} color The color they chose.
 * @private
 */
low.ui.home.GameCreateButton.prototype.onConfirm_ = function(name, color) {
  // Create the game and go to the waiting room once complete.
  this.gameService_.createGame(name, color).addCallbacks(
      function() {
        var currentGame = this.gameService_.getCurrentGame();
        this.tokenService_.setCurrentToken(
            low.model.Page.WAITING_ROOM, currentGame.getKey());
      },
      function(e) {
        goog.log.error(this.logger, 'Failed to create the game: ' + e);
      },
      this);
};
