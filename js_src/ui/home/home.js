/**
 * The home page component.  This is where players can find and create games.
 */

goog.provide('low.ui.home.Home');

goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.home.Home = function() {
  goog.base(this);
};
goog.inherits(low.ui.home.Home, goog.ui.Component);


/** @override */
low.ui.home.Home.prototype.createDom = function() {
  goog.base(this, 'createDom');
  this.getElement().innerHTML = 'Home';
};
