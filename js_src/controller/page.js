/**
 * Controls which page is shown to the user based on the current fragment.
 */

goog.provide('low.controller.Page');

goog.require('goog.History');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.history.EventType');
goog.require('goog.history.Html5History');
goog.require('goog.log');
goog.require('low');
goog.require('low.ui.Page');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
low.controller.Page = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.controller.Page');

  /** @private {!goog.History|!goog.history.Html5History} */
  this.history_ = this.newHistory_();

  /** @private {!low.controller.Page.Token} */
  this.currentToken_ = new low.controller.Page.Token(low.ui.Page.HOME, '');
  if (this.history_.getToken()) {
    this.currentToken_ = this.parseToken_(this.history_.getToken());
  } else {
    this.history_.setToken(this.currentToken_.toString());
  }

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
goog.inherits(low.controller.Page, goog.events.EventTarget);
goog.addSingletonGetter(low.controller.Page);


/**
 * @enum {string}
 */
low.controller.Page.EventType = {
  PAGE_CHANGED: low.getUniqueId('page-changed')
};


/**
 * @return {!low.controller.Page.Token} The current token.
 */
low.controller.Page.prototype.getCurrentToken = function() {
  return this.currentToken_;
};


/**
 * Sets the current token to be the page/gameKey.
 * @param {!low.ui.Page} page
 * @param {string=} opt_gameKey
 */
low.controller.Page.prototype.setCurrentToken = function(page, opt_gameKey) {
  var token = new low.controller.Page.Token(page, opt_gameKey);
  if (this.currentToken_.equals(token)) {
    goog.log.info(this.logger, 'Ignoring setting token to ' + token +
        ' because it\'s the current token');
    return;
  }
  // This will trigger a NAVIGATE event which will trigger a PAGE_CHANGED event.
  goog.log.info(this.logger, 'Setting current token to ' + token);
  this.history_.setToken(token.toString());
};


/**
 * Creates the history object based on HTML5 support.
 * @return {!goog.History|!goog.history.Html5History}
 * @private
 */
low.controller.Page.prototype.newHistory_ = function() {
  if (goog.history.Html5History.isSupported(goog.global)) {
    goog.log.info(this.logger, 'Using HTML5 history.');
    return new goog.history.Html5History();
  } else {
    goog.log.info(this.logger, 'Using closure history.');
    return new goog.History();
  }
};


/**
 * Updates the based on the hash tag.
 * @param {!goog.history.Event} e
 * @private
 */
low.controller.Page.prototype.onNavigate_ = function(e) {
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
  this.dispatchEvent(low.controller.Page.EventType.PAGE_CHANGED);
};


/**
 * Parses the token given token.
 * @param {string} rawHistoryToken The raw history token.
 * @return {!low.controller.Page.Token} The parsed data.
 * @private
 */
low.controller.Page.prototype.parseToken_ = function(rawHistoryToken) {

  // Split the token into its parts (e.g. waiting_room/1234).
  var parts = rawHistoryToken.split('/');
  var pagePart = parts[0];
  var gameKey = '';
  if (parts.length > 1) {
    gameKey = parts[1];
  }

  var page = /** @type {low.ui.Page} */ (
      low.stringToEnum(pagePart, low.ui.Page));
  if (!page) {
    goog.log.warning(this.logger,
        'No page found for this token: ' + rawHistoryToken);
    page = low.ui.Page.HOME;
  }

  return new low.controller.Page.Token(page, gameKey);
};



/**
 * Represents the parsed data things following the hash tag.
 * @param {!low.ui.Page} page
 * @param {string=} opt_gameKey
 * @constructor
 */
low.controller.Page.Token = function(page, opt_gameKey) {

  /** @type {!low.ui.Page} */
  this.page = page;

  /** @type {string} */
  this.gameKey = opt_gameKey || '';
};


/**
 * @return {string} The string representation of the token.
 */
low.controller.Page.Token.prototype.toString = function() {
  if (this.gameKey) {
    return this.page + '/' + this.gameKey;
  }
  return this.page;
};


/**
 * Checks if the given token is equal to this one.
 * @param {low.controller.Page.Token} other The to token to compare.
 * @return {boolean} True if the other token equals this one.
 */
low.controller.Page.Token.prototype.equals = function(other) {
  if (goog.isDefAndNotNull(other)) {
    return this.page == other.page && this.gameKey == other.gameKey;
  } else {
    return false;
  }
};
