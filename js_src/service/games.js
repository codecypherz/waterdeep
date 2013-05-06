/**
 * Service for fetching existing games.
 */

goog.provide('low.service.Games');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('low.Config');
goog.require('low.model.Game');
goog.require('low.service.Xhr');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
low.service.Games = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.service.Games');

  /** @private {!low.service.Xhr} */
  this.xhrService_ = low.service.Xhr.getInstance();
};
goog.inherits(low.service.Games, goog.events.EventTarget);
goog.addSingletonGetter(low.service.Games);


/**
 * @return {!Array.<!low.model.Game>}
 */
low.service.Games.prototype.getGames = function() {
  return this.games_;
};


/**
 * Loads the games from the server.
 * @return {!goog.async.Deferred}
 */
low.service.Games.prototype.loadGames = function() {
  goog.log.info(this.logger, 'Loading games.');

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.Config.ServletPath.GAMES);

  // Send the request.
  var deferred = this.xhrService_.send(uri);

  // Handle the response.
  deferred.addCallback(goog.bind(this.onGamesLoaded_, this));

  return deferred;
};


/**
 * Called when the request for games completes successfully.
 * @param {!goog.net.XhrManager.Event} e
 * @return {!Array.<!low.model.Game>} The parsed game objects from the response.
 * @private
 */
low.service.Games.prototype.onGamesLoaded_ = function(e) {
  goog.log.info(this.logger, 'Games just loaded.');

  var gamesJson = e.xhrIo.getResponseJson();
  if (!gamesJson) {
    throw Error('No JSON in the games response.');
  }
  if (!goog.isArray(gamesJson)) {
    throw Error('JSON was not in array format.');
  }

  // Convert all the JSON into model objects.
  var games = [];
  goog.array.forEach(gamesJson, function(gameJson) {
    games.push(low.model.Game.fromJson(gameJson));
  });

  this.games_ = games;

  // Games is what is now passed in the deferred chain.
  return games;
};
