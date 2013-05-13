/**
 * The top level container for the application that controls which component
 * is rendered for the current page.
 */

goog.provide('low.ui.PageContainer');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.ui.Component');
goog.require('low.controller.Page');
goog.require('low.ui.Page');
goog.require('low.ui.home.Home');
goog.require('low.ui.waiting.WaitingRoom');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.PageContainer = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.PageContainer');

  /** @private {!low.controller.Page} */
  this.pageController_ = low.controller.Page.getInstance();

  /**
   * Maps pages to their components.
   * @private {!Object.<low.ui.Page, Function>}
   */
  this.pageToCtorMap_ = {};

  // Map the pages.
  this.pageToCtorMap_[low.ui.Page.HOME] = low.ui.home.Home;
  this.pageToCtorMap_[low.ui.Page.WAITING_ROOM] = low.ui.waiting.WaitingRoom;
};
goog.inherits(low.ui.PageContainer, goog.ui.Component);


/** @override */
low.ui.PageContainer.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.pageController_,
      low.controller.Page.EventType.PAGE_CHANGED,
      this.renderPage_);

  this.renderPage_();
};


/**
 * Renders the current page.
 * @private
 */
low.ui.PageContainer.prototype.renderPage_ = function() {
  goog.log.info(this.logger, 'Clearing all children.');
  goog.array.forEach(this.removeChildren(true), function(child) {
    child.dispose();
  });

  var page = this.pageController_.getCurrentToken().page;
  goog.log.info(this.logger, 'Rendering page: ' + page);

  var pageCtor = this.pageToCtorMap_[page];
  goog.asserts.assert(pageCtor);
  var pageComponent = new pageCtor();
  this.addChild(pageComponent, true);
};
