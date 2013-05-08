/**
 * Service for creating and joining games.
 */

goog.provide('low.service.Game');

goog.require('goog.Uri');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('low.Config');
goog.require('low.message.CreateGameRequest');
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
      uri, new low.message.CreateGameRequest(moderatorName, color));

  // Handle the response.
  deferred.addCallback(goog.bind(this.onGameCreated_, this));

  return deferred;
};


/**
 * Called when the request for games completes successfully.
 * @param {!goog.net.XhrManager.Event} event
 * @return {low.model.Game} The game that was just created.
 * @private
 */
low.service.Game.prototype.onGameCreated_ = function(event) {
  goog.log.info(this.logger, 'Game just created.');

  var gameJson;
  try {
    gameJson = event.xhrIo.getResponseJson();
  } catch (e) {
    goog.log.error(this.logger, 'Failed to get create game response JSON', e);
    throw e;
  }

  if (!gameJson) {
    var errorMsg = 'No JSON in the create game response.';
    goog.log.error(this.logger, errorMsg);
    throw Error(errorMsg);
  }

  // Convert the JSON into a model object.
  // The game is what is now passed in the deferred chain.
  return low.model.Game.fromJson(gameJson);
};
