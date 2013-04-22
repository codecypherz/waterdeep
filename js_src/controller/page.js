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
goog.require('goog.object');
goog.require('goog.string');
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

  /** @private {!low.ui.Page} */
  this.currentPage_ = this.getPageForCurrentToken_();

  // No harm in setting the token here since not listening yet.
  if (this.currentPage_ != this.history_.getToken()) {
    goog.log.info(this.logger, 'Setting the token to be ' + this.currentPage_);
    this.history_.setToken(this.currentPage_);
  }

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
 * @return {!low.ui.Page} The current page.
 */
low.controller.Page.prototype.getCurrentPage = function() {
  return this.currentPage_;
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
 * Updates the current page based on the hash tag.
 * @param {!goog.history.Event} e
 * @private
 */
low.controller.Page.prototype.onNavigate_ = function(e) {
  goog.log.info(this.logger, 'History event fired: ' + e.token +
      ', browser navigated ' + e.isNavigation);
  this.update_();
};


/**
 * Updates the current page based on the hash tag.
 * @private
 */
low.controller.Page.prototype.update_ = function() {
  var page = this.getPageForCurrentToken_();
  if (this.currentPage_ == page) {
    return;
  }
  this.currentPage_ = page;
  this.dispatchEvent(low.controller.Page.EventType.PAGE_CHANGED);
};


/**
 * Maps the current history token back to a page.
 * @return {!low.ui.Page} The page for the token.
 * @private
 */
low.controller.Page.prototype.getPageForCurrentToken_ = function() {
  var token = this.history_.getToken();
  var foundPage = /** @type {low.ui.Page} */ (goog.object.findValue(
      low.ui.Page,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(value, token) == 0;
      }));
  return foundPage || low.ui.Page.HOME;
};
