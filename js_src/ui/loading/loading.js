
goog.provide('low.ui.loading.Loading');

goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.ui.loading.soy');



/**
 * The UI shown to the user as the page loads.
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.loading.Loading = function() {
  goog.base(this);
};
goog.inherits(low.ui.loading.Loading, goog.ui.Component);


/** @override */
low.ui.loading.Loading.prototype.createDom = function() {
  this.setElementInternal(
      goog.soy.renderAsElement(low.ui.loading.soy.LOADING));
};
