/**
 * The waiting page component.  This is where players wait to find other players
 * before starting a game.
 */

goog.provide('low.ui.waiting.WaitingRoom');

goog.require('goog.array');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low');
goog.require('low.model.Page');
goog.require('low.service.Game');
goog.require('low.service.Token');
goog.require('low.ui');
goog.require('low.ui.waiting.Player');
goog.require('low.ui.waiting.soy');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.waiting.WaitingRoom = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.waiting.WaitingRoom');

  /** @private {!low.service.Token} */
  this.tokenService_ = low.service.Token.getInstance();

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();

  /** @private {low.model.Game} */
  this.game_ = this.gameService_.getCurrentGame();
};
goog.inherits(low.ui.waiting.WaitingRoom, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
low.ui.waiting.WaitingRoom.Id_ = {
  LEAVE_BUTTON: low.getUniqueId('leave-button'),
  PLAYERS: low.getUniqueId('players')
};


/** @override */
low.ui.waiting.WaitingRoom.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.waiting.soy.WAITING_ROOM, {
        ids: this.makeIds(low.ui.waiting.WaitingRoom.Id_)
      }));

  var playersContainer = low.ui.getElementByFragment(
      this, low.ui.waiting.WaitingRoom.Id_.PLAYERS);

  // Render self first.
  var self = this.game_.getSelf();
  var playerComponent = new low.ui.waiting.Player(self);
  this.addChild(playerComponent);
  playerComponent.render(playersContainer);

  // Render the rest of the players.
  goog.array.forEach(this.game_.getPlayers(), function(player) {
    if (!player.isSelf()) {
      playerComponent = new low.ui.waiting.Player(player);
      this.addChild(playerComponent);
      playerComponent.render(playersContainer);
    }
  }, this);
};


/** @override */
low.ui.waiting.WaitingRoom.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      this.getElementByFragment(
          low.ui.waiting.WaitingRoom.Id_.LEAVE_BUTTON),
      goog.events.EventType.CLICK,
      this.leave_);
};


/**
 * Leaves the waiting room.
 * @private
 */
low.ui.waiting.WaitingRoom.prototype.leave_ = function() {
  goog.log.info(this.logger, 'Leaving the waiting room.');

  // TODO Actually leave the game.  Delete the game if moderator.

  this.tokenService_.setCurrentToken(low.model.Page.HOME);
};
