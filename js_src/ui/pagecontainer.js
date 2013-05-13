/**
 * The top level container for the application that controls which component
 * is rendered for the current page.
 */

goog.provide('low.model.PageContainer');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.ui.Component');
goog.require('low.model.Page');
goog.require('low.service.Token');
goog.require('low.ui.home.Home');
goog.require('low.ui.waiting.WaitingRoom');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.model.PageContainer = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.model.PageContainer');

  /** @private {!low.service.Token} */
  this.tokenService_ = low.service.Token.getInstance();

  /**
   * Maps pages to their components.
   * @private {!Object.<low.model.Page, Function>}
   */
  this.pageToCtorMap_ = {};

  // Map the pages.
  this.pageToCtorMap_[low.model.Page.HOME] = low.ui.home.Home;
  this.pageToCtorMap_[low.model.Page.WAITING_ROOM] = low.ui.waiting.WaitingRoom;
};
goog.inherits(low.model.PageContainer, goog.ui.Component);


/** @override */
low.model.PageContainer.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.tokenService_,
      low.service.Token.EventType.TOKEN_CHANGED,
      this.renderPage_);

  this.renderPage_();
};


/**
 * Renders the current page.
 * @private
 */
low.model.PageContainer.prototype.renderPage_ = function() {
  goog.log.info(this.logger, 'Clearing all children.');
  goog.array.forEach(this.removeChildren(true), function(child) {
    child.dispose();
  });

  var page = this.tokenService_.getCurrentToken().page;
  goog.log.info(this.logger, 'Rendering page: ' + page);

  var pageCtor = this.pageToCtorMap_[page];
  goog.asserts.assert(pageCtor);
  var pageComponent = new pageCtor();
  this.addChild(pageComponent, true);
};
