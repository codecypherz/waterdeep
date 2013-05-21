/**
 * Service for creating and joining games.
 */

goog.provide('low.service.Game');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.async.DeferredList');
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
   * True if currently trying to create or join a game.
   * @private {boolean}
   */
  this.isBusy_ = false;

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
 * @return {boolean} True if currently trying to create a join a game.
 */
low.service.Game.prototype.isBusy = function() {
  return this.isBusy_;
};


/**
 * @param {string} moderatorName The name of the moderator creating the game.
 * @param {!low.model.Player.Color} color The player color.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.createGame = function(moderatorName, color) {
  goog.asserts.assert(!this.currentGame_,
      'Cannot create - client already has a game going.');
  goog.asserts.assert(!this.isBusy_,
      'Cannot create - currently busy.');
  goog.log.info(this.logger, moderatorName + ' is creating a new game.');
  this.isBusy_ = true;

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.ServletPath.GAMES);

  // Send the request.
  var createGameDeferred = this.xhrService_.post(
      uri,
      new low.message.CreateGameRequest(moderatorName, color),
      true);

  // Handle the response.
  createGameDeferred.addCallback(function(json) {
    goog.log.info(this.logger, 'Received create game response.');
    this.currentGame_ = low.model.Game.fromJson(json);
    this.markSelf_(this.currentGame_);
    return this.currentGame_;
  }, this);

  // Create the channel if it doesn't already exist.
  var initChannelDeferred = this.channelService_.init();

  // Wait for both async operations to finish.
  var deferred = goog.async.DeferredList.gatherResults([
    createGameDeferred,
    initChannelDeferred
  ]);
  deferred.addBoth(
      function() {
        goog.log.info(this.logger, 'Finished create game attempt.');
        this.isBusy_ = false;
      }, this);

  return deferred;
};


/**
 * @param {!low.model.Game} game The game to join.
 * @param {string} name The name of the joining player.
 * @param {!low.model.Player.Color} color The player color.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.joinGame = function(game, name, color) {
  goog.asserts.assert(!this.currentGame_,
      'Cannot join - client already has a game going.');
  goog.asserts.assert(!this.isBusy_,
      'Cannot join - currently busy.');
  goog.log.info(
      this.logger, name + ' is joining a game with this key: ' + game.getKey());
  this.isBusy_ = true;

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.ServletPath.GAME + '/' + game.getKey());

  // Send the request to join the game.
  var joinGameDeferred = this.xhrService_.post(
      uri, new low.message.JoinGameRequest(name, color), true);

  // Handle the join game response.
  joinGameDeferred.addCallback(function(json) {
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

  // Create the channel if it doesn't already exist.
  var initChannelDeferred = this.channelService_.init();

  // Wait for both async operations to finish.
  var deferred = goog.async.DeferredList.gatherResults([
    joinGameDeferred,
    initChannelDeferred
  ]);
  deferred.addBoth(
      function() {
        goog.log.info(this.logger, 'Finished join game attempt.');
        this.isBusy_ = false;
      }, this);

  return deferred;
};


/**
 * Loads the game that this client claims to have previously joined.
 * @param {string} gameKey The game's key.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.reloadGame = function(gameKey) {
  goog.asserts.assert(!this.currentGame_,
      'Cannot reload - client already has a game going.');
  goog.asserts.assert(!this.isBusy_,
      'Cannot reload - currently busy.');
  goog.log.info(this.logger, 'Reloading a game with this key: ' + gameKey);
  this.isBusy_ = true;

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.ServletPath.GAME + '/' + gameKey);

  // Send the request.
  var fetchGameDeferred = this.xhrService_.get(uri, true);

  // Handle the response.
  fetchGameDeferred.addCallback(function(json) {
    goog.log.info(this.logger, 'Received reload response.');
    this.currentGame_ = low.model.Game.fromJson(json);
    this.markSelf_(this.currentGame_);
  }, this);

  // Create the channel if it doesn't already exist.
  var initChannelDeferred = this.channelService_.init();

  // Wait for both async operations to finish.
  var deferred = goog.async.DeferredList.gatherResults([
    fetchGameDeferred,
    initChannelDeferred
  ]);
  deferred.addBoth(
      function() {
        goog.log.info(this.logger, 'Finished reload game attempt.');
        this.isBusy_ = false;
      }, this);

  return deferred;
};


/**
 * Leaves the current game.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.leaveCurrentGame = function() {
  goog.asserts.assert(this.currentGame_, 'There is no current game to leave');
  goog.asserts.assert(!this.isBusy_, 'Cannot leave - currently busy.');
  goog.log.info(this.logger, 'Leaving the current game.');
  this.isBusy_ = true;

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.ServletPath.GAME + '/' + this.currentGame_.getKey());

  // Send the request.
  var deferred = this.xhrService_.post(uri, new low.message.LeaveGameRequest());
  deferred.addBoth(
      function() {
        goog.log.info(this.logger, 'Finished leave game attempt.');
        this.isBusy_ = false;
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
