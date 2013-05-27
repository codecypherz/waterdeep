
goog.provide('low.ui.home.GameJoinButton');

goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.ui.Button');
goog.require('low.model.Page');
goog.require('low.model.Player');
goog.require('low.service.Game');
goog.require('low.service.Token');
goog.require('low.ui.home.GameDialog');
goog.require('low.ui.home.soy');



/**
 * The component representing a single game and allows the user to join it.
 * @constructor
 * @param {!low.model.Game} game
 * @extends {goog.ui.Button}
 */
low.ui.home.GameJoinButton = function(game) {
  goog.base(this, null);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.GameJoinButton');

  /** @private {!low.model.Game} */
  this.game_ = game;

  /** @private {!low.service.Token} */
  this.tokenService_ = low.service.Token.getInstance();

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();
};
goog.inherits(low.ui.home.GameJoinButton, goog.ui.Button);


/** @private {!Object} */
low.ui.home.GameJoinButton.COLOR_TO_CSS_MAP_ = goog.object.create(
    low.model.Player.Color.BLACK, goog.getCssName('holder-black-22'),
    low.model.Player.Color.BLUE, goog.getCssName('holder-blue-22'),
    low.model.Player.Color.GREEN, goog.getCssName('holder-green-22'),
    low.model.Player.Color.RED, goog.getCssName('holder-red-22'),
    low.model.Player.Color.YELLOW, goog.getCssName('holder-yellow-22')
    );


/**
 * @enum {string}
 * @private
 */
low.ui.home.GameJoinButton.Css_ = {
  OPEN_ICON: goog.getCssName('holder-other-22')
};


/** @override */
low.ui.home.GameJoinButton.prototype.createDom = function() {

  // Create the template data.
  var playerData = [];
  for (var i = 0; i < 5; i++) {
    var player = this.game_.getPlayers()[i];
    if (player) {
      playerData.push({
        name: player.getName(),
        iconClass: low.ui.home.GameJoinButton.COLOR_TO_CSS_MAP_[
            player.getColor()],
        isModerator: player.isModerator()
      });
    } else {
      playerData.push({
        name: 'Open',
        iconClass: low.ui.home.GameJoinButton.Css_.OPEN_ICON,
        isModerator: false
      });
    }
  }

  // Render the template.
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.home.soy.GAME, {
        players: playerData
      }));
};


/** @override */
low.ui.home.GameJoinButton.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Don't using goog.ui.Component.EventType.ACTION because it's fired twice
  // when you bypass the renderer paradigm with the createDom method above.
  this.getHandler().listen(this.getElement(),
      goog.events.EventType.CLICK,
      this.promptToJoin_);
};


/**
 * Prompts the user to join a new game.
 * @private
 */
low.ui.home.GameJoinButton.prototype.promptToJoin_ = function() {
  goog.log.info(this.logger, 'Showing the game join dialog.');

  // Disable the button unless there is an error.
  this.setEnabled(false);

  var gameDialog = new low.ui.home.GameDialog('Join game', 'Join', this.game_);
  gameDialog.prompt().addCallbacks(
      function() {
        this.onConfirm_(gameDialog.getName(), gameDialog.getColor());
      },
      function() {
        this.setEnabled(true);
      },
      this);
};


/**
 * Called when the user confirms their desire to join a game.
 * @param {string} name The name they chose.
 * @param {!low.model.Player.Color} color The color they chose.
 * @private
 */
low.ui.home.GameJoinButton.prototype.onConfirm_ = function(name, color) {
  goog.log.info(this.logger, 'joining game with ' + name + ' and ' + color);
  this.gameService_.joinGame(this.game_, name, color).addCallbacks(
      function() {
        // Go to the waiting room for the current game.
        var currentGame = this.gameService_.getCurrentGame();
        this.tokenService_.setCurrentToken(
            low.model.Page.WAITING_ROOM, currentGame.getKey());
      },
      function(error) {
        goog.log.error(this.logger, 'Failed to join the game: ' + error);
        // TODO Show the error in a message bar.
      },
      this);
};
