/**
 * Service for creating and joining games.
 */

goog.provide('low.service.Game');

goog.require('goog.Uri');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('low.Config');
goog.require('low.message.CreateGameRequest');
goog.require('low.message.JoinGameRequest');
goog.require('low.message.JoinGameResponse');
goog.require('low.model.Game');
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
};
goog.inherits(low.service.Game, goog.events.EventTarget);
goog.addSingletonGetter(low.service.Game);


/**
 * @param {string} moderatorName The name of the moderator creating the game.
 * @param {!low.model.Player.Color} color The player color.
 * @return {!goog.async.Deferred}
 */
low.service.Game.prototype.createGame = function(moderatorName, color) {
  goog.log.info(this.logger, moderatorName + ' is creating a new game.');

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.Config.ServletPath.GAMES);

  // Send the request.
  var deferred = this.xhrService_.post(
      uri,
      new low.message.CreateGameRequest(moderatorName, color),
      true);

  // Handle the response.
  deferred.addCallback(function(json) {
    goog.log.info(this.logger, 'Game created.');
    return low.model.Game.fromJson(json);
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
  goog.log.info(
      this.logger, name + ' is joining a game with this key: ' + game.getKey());

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.Config.ServletPath.GAME + '/' + game.getKey());

  // Send the request.
  var deferred = this.xhrService_.post(
      uri, new low.message.JoinGameRequest(name, color), true);

  // Handle the response.
  deferred.addCallback(function(json) {
    goog.log.info(this.logger, 'Received join game response.');

    // See if the request was a success or not.
    var response = low.message.JoinGameResponse.fromJson(json);
    var joinResult = response.getResult();
    if (joinResult == low.message.JoinGameResponse.Result.SUCCESS) {
      return;
    } else {
      throw Error(joinResult);
    }

  }, this);

  return deferred;
};
