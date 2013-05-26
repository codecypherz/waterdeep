
goog.provide('low.service.Game');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('low.ServletPath');
goog.require('low.message.CreateGameRequest');
goog.require('low.message.JoinGameRequest');
goog.require('low.message.JoinGameResponse');
goog.require('low.message.LeaveGameRequest');
goog.require('low.model.Game');
goog.require('low.service.Channel');
goog.require('low.service.Cookie');
goog.require('low.service.Xhr');



/**
 * Service for creating and joining games.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
low.service.Game = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.service.Game');

  /** @private {!low.service.Xhr} */
  this.xhrService_ = low.service.Xhr.getInstance();

  /** @private {!low.service.Cookie} */
  this.cookieService_ = low.service.Cookie.getInstance();

  /** @private {!low.service.Channel} */
  this.channelService_ = low.service.Channel.getInstance();

  /**
   * The currently active game.
   * @private {low.model.Game}
   */
  this.currentGame_ = null;
};
goog.inherits(low.service.Game, goog.events.EventTarget);
goog.addSingletonGetter(low.service.Game);


/**
 * @return {low.model.Game} The currently active game.
 */
low.service.Game.prototype.getCurrentGame = function() {
  return this.currentGame_;
};


/**
 * Creates the game by first setting up the channel, then creating the game.
 * @param {string} moderatorName The name of the moderator creating the game.
 * @param {!low.model.Player.Color} color The player color.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.createGame = function(moderatorName, color) {
  goog.asserts.assert(!this.currentGame_,
      'Cannot create - client already has a game going.');
  goog.log.info(this.logger, moderatorName + ' is creating a new game.');

  // Create the channel if it doesn't already exist.
  var deferred = this.channelService_.init();

  // First, create the channel, then create the game.  This is to ensure other
  // join messages are not missed which could happen if you created the game
  // first, then created the channel.
  deferred.addCallback(

      // Channel successfully initialized.
      function() {
        // Returning a deferred here will block the execution sequence in the
        // deferred that is returned here fires its callback/errback.
        return this.createGame_(moderatorName, color);
      },
      this);

  return deferred;
};


/**
 * Joins the game by first setting up the channel, then joining the game.
 * @param {!low.model.Game} game The game to join.
 * @param {string} name The name of the joining player.
 * @param {!low.model.Player.Color} color The player color.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.joinGame = function(game, name, color) {
  goog.asserts.assert(!this.currentGame_,
      'Cannot join - client already has a game going.');
  goog.log.info(
      this.logger, name + ' is joining a game with this key: ' + game.getKey());

  // Create the channel if it doesn't already exist.
  var deferred = this.channelService_.init();

  // First, create the channel, then join the game.  This is to ensure other
  // join messages are not missed which could happen if you joined the game
  // first, then created the channel.
  deferred.addCallback(

      // Channel successfully initialized.
      function() {
        // Returning a deferred here will block the execution sequence in the
        // deferred that is returned here fires its callback/errback.
        return this.joinGame_(game, name, color);
      },
      this);

  return deferred;
};


/**
 * Reloads the game by first ensuring the channel is open, then requesting the
 * game data this client claims to have been a part of.
 * @param {string} gameKey The game's key.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.reloadGame = function(gameKey) {
  goog.asserts.assert(!this.currentGame_,
      'Cannot reload - client already has a game going.');
  goog.log.info(this.logger, 'Reloading a game with this key: ' + gameKey);

  // Create the channel if it doesn't already exist.
  var deferred = this.channelService_.init();

  // First, create the channel, then reload the game.  This is to ensure other
  // join messages are not missed which could happen if you reloaded the game
  // first, then created the channel.
  deferred.addCallback(

      // Channel successfully initialized.
      function() {
        // Returning a deferred here will block the execution sequence in the
        // deferred that is returned here fires its callback/errback.
        return this.reloadGame_(gameKey);
      },
      this);

  return deferred;
};


/**
 * Leaves the current game.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.leaveCurrentGame = function() {
  goog.asserts.assert(this.currentGame_, 'There is no current game to leave');
  goog.log.info(this.logger, 'Leaving the current game.');

  // Send the request.
  var deferred = this.xhrService_.post(
      new goog.Uri().setPath(
          low.ServletPath.GAME + '/' + this.currentGame_.getKey()),
      new low.message.LeaveGameRequest());

  // Clean up no matter what.
  deferred.addBoth(
      function() {
        goog.log.info(this.logger, 'Finished leave game attempt.');
        this.currentGame_ = null;
      }, this);

  return deferred;
};


/**
 * Starts the current game.
 */
low.service.Game.prototype.startCurrentGame = function() {
  goog.log.info(this.logger, 'Starting the current game.');
  // TODO Implement.
};


/**
 * Actually creates the game by making a post request to /games.
 * @param {string} moderatorName The name of the moderator creating the game.
 * @param {!low.model.Player.Color} color The player color.
 * @return {!goog.async.Deferred}
 * @private
 */
low.service.Game.prototype.createGame_ = function(moderatorName, color) {

  // Send the request.
  var deferred = this.xhrService_.post(
      new goog.Uri().setPath(low.ServletPath.GAMES),
      new low.message.CreateGameRequest(moderatorName, color),
      true);

  // Handle the response.
  deferred.addCallback(function(json) {
    goog.log.info(this.logger, 'Received create game response.');
    this.currentGame_ = low.model.Game.fromJson(json);
    this.markSelf_(this.currentGame_);
    return this.currentGame_;
  }, this);

  return deferred;
};


/**
 * Actually joins the game by posting to /game/key with a join request.
 * @param {!low.model.Game} game The game to join.
 * @param {string} name The name of the joining player.
 * @param {!low.model.Player.Color} color The player color.
 * @return {!goog.async.Deferred}
 * @private
 */
low.service.Game.prototype.joinGame_ = function(game, name, color) {

  // Send the request to join the game.
  var deferred = this.xhrService_.post(
      new goog.Uri().setPath(low.ServletPath.GAME + '/' + game.getKey()),
      new low.message.JoinGameRequest(name, color),
      true);

  // Handle the join game response.
  deferred.addCallback(function(json) {
    goog.log.info(this.logger, 'Received join game response.');

    // See if the request was a success or not.
    var response = low.message.JoinGameResponse.fromJson(json);
    var joinResult = response.getResult();
    if (joinResult == low.message.JoinGameResponse.Result.SUCCESS) {
      this.currentGame_ = goog.asserts.assert(
          response.getGame(), 'Join success, but no game!');
      this.markSelf_(this.currentGame_);
      return;
    } else {
      throw Error(joinResult);
    }

  }, this);

  return deferred;
};


/**
 * Actually loads the game by making a GET request to /game/key.
 * @param {string} gameKey The game's key.
 * @return {!goog.async.Deferred}
 * @private
 */
low.service.Game.prototype.reloadGame_ = function(gameKey) {

  // Send the request.
  var deferred = this.xhrService_.get(
      new goog.Uri().setPath(low.ServletPath.GAME + '/' + gameKey),
      true);

  // Handle the response.
  deferred.addCallbacks(
      function(json) { // Success.
        goog.log.info(this.logger, 'Received reload response.');
        this.currentGame_ = low.model.Game.fromJson(json);
        this.markSelf_(this.currentGame_);
        return this.currentGame_;
      },
      function() {     // Failure.
        goog.log.info(this.logger, 'Reload attempt failed.');
        this.currentGame_ = null;
      },
      this);

  return deferred;
};


/**
 * Finds and marks the player representing this client.
 * @param {!low.model.Game} game
 * @private
 */
low.service.Game.prototype.markSelf_ = function(game) {
  var clientId = this.cookieService_.get(low.service.Cookie.Name.CLIENT_ID);
  var success = goog.array.some(game.getPlayers(), function(player) {
    if (player.getClientId() == clientId) {
      player.setSelf(true);
      goog.log.info(this.logger, 'Marking ' + player.getName() + ' as self.');
      return true; // Quit early.
    }
    return false; // Keep going.
  }, this);
  goog.asserts.assert(success, 'Failed to mark a player as self.');
};
