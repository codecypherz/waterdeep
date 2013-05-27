/**
 * Controls which page is shown to the user based on the current fragment.
 */

goog.provide('low.service.Token');

goog.require('goog.History');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.history.EventType');
goog.require('goog.history.Html5History');
goog.require('goog.log');
goog.require('low');
goog.require('low.model.Page');
goog.require('low.model.Token');
goog.require('low.service.Game');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
low.service.Token = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.service.Token');

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();

  /** @private {!goog.History|!goog.history.Html5History} */
  this.history_ = this.newHistory_();

  /** @private {!low.model.Token} */
  this.currentToken_ = new low.model.Token(low.model.Page.HOME);

  // Validate the token if one was already set.  This can happen with a simple
  // bookmark of the homepage or something more complicated like the user
  // refreshing in the waiting room or during a game.
  if (this.history_.getToken()) {
    this.currentToken_ = this.validateAndInit_(this.history_.getToken());
  }

  // Make sure the history token agrees with the current token in case the
  // initialization changed something.  For example, going from the waiting room
  // to the home screen because there was no game key.
  this.history_.setToken(this.currentToken_.toString());

  goog.log.info(this.logger,
      'Initializing the token to be ' + this.currentToken_);

  // Start dispatching events.
  this.history_.setEnabled(true);

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(this.history_,
      goog.history.EventType.NAVIGATE,
      this.onNavigate_);
};
goog.inherits(low.service.Token, goog.events.EventTarget);
goog.addSingletonGetter(low.service.Token);


/**
 * @enum {string}
 */
low.service.Token.EventType = {
  TOKEN_CHANGED: low.getUniqueId('token-changed')
};


/**
 * @return {!low.model.Token} The current token.
 */
low.service.Token.prototype.getCurrentToken = function() {
  return this.currentToken_;
};


/**
 * Sets the current token to be the page/gameKey.
 * @param {!low.model.Page} page
 * @param {string=} opt_gameKey
 */
low.service.Token.prototype.setCurrentToken = function(page, opt_gameKey) {
  var token = new low.model.Token(page, opt_gameKey);
  if (this.currentToken_.equals(token)) {
    goog.log.info(this.logger, 'Ignoring setting token to ' + token +
        ' because it\'s the current token');
    return;
  }

  // This will trigger a NAVIGATE event which will trigger a TOKEN_CHANGED.
  goog.log.info(this.logger, 'Setting current token to ' + token);
  this.history_.setToken(token.toString());
};


/**
 * Creates the history object based on HTML5 support.
 * @return {!goog.History|!goog.history.Html5History}
 * @private
 */
low.service.Token.prototype.newHistory_ = function() {
  if (goog.history.Html5History.isSupported(goog.global)) {
    goog.log.info(this.logger, 'Using HTML5 history.');
    return new goog.history.Html5History();
  } else {
    goog.log.info(this.logger, 'Using closure history.');
    return new goog.History();
  }
};


/**
 * Validates the token, and initializes anything needed.
 * @param {string} tokenString The token with which to initialize.
 * @return {!low.model.Token} The token to use initially.
 * @private
 */
low.service.Token.prototype.validateAndInit_ = function(tokenString) {
  var parsedToken = this.parseToken_(tokenString);

  if (parsedToken.page == low.model.Page.WAITING_ROOM ||
      parsedToken.page == low.model.Page.GAME) {
    if (parsedToken.gameKey) {

      // Start reloading the game.
      this.gameService_.reloadGame(parsedToken.gameKey).addCallbacks(
          function() { // callback
            // The game loaded, so now it's okay to load the original page.
            var currentGame = this.gameService_.getCurrentGame();
            this.setCurrentToken(parsedToken.page, currentGame.getKey());
          },
          function(e) { // errback
            goog.log.error(this.logger, 'Failed to reload the game: ' + e);
            this.setCurrentToken(low.model.Page.HOME);
          }, this);

      // Need to download game information, so start with a loading screen.
      return new low.model.Token(low.model.Page.LOADING, parsedToken.gameKey);

    } else {
      goog.log.error(this.logger,
          'Tried to load a game-specific page without a game key.');
      return new low.model.Token(low.model.Page.HOME);
    }
  }

  // Return the parsed token by default.
  return parsedToken;
};


/**
 * Updates the based on the hash tag.
 * @param {!goog.history.Event} e
 * @private
 */
low.service.Token.prototype.onNavigate_ = function(e) {
  goog.log.info(this.logger, 'History event fired: ' + e.token +
      ', browser navigated ' + e.isNavigation);

  var token = this.parseToken_(e.token);
  if (this.currentToken_.equals(token)) {
    goog.log.info(this.logger,
        'History fired token event, but token is unchanged');
    return;
  }

  goog.log.info(this.logger, 'Setting current token to ' + token);
  this.currentToken_ = token;
  this.dispatchEvent(low.service.Token.EventType.TOKEN_CHANGED);
};


/**
 * Parses the token given token.
 * @param {string} rawHistoryToken The raw history token.
 * @return {!low.model.Token} The parsed data.
 * @private
 */
low.service.Token.prototype.parseToken_ = function(rawHistoryToken) {

  // Split the token into its parts (e.g. waiting_room/1234).
  var parts = rawHistoryToken.split('/');
  var pagePart = parts[0];
  var gameKey = '';
  if (parts.length > 1) {
    gameKey = parts[1];
  }

  var page = /** @type {low.model.Page} */ (
      low.stringToEnum(pagePart, low.model.Page));
  if (!page) {
    goog.log.warning(this.logger,
        'No page found for this token: ' + rawHistoryToken);
    page = low.model.Page.HOME;
  }

  return new low.model.Token(page, gameKey);
};
