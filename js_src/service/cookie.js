
goog.provide('low.service.Cookie');

goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.net.Cookies');



/**
 * Service for interacting with cookies.
 * @constructor
 */
low.service.Cookie = function() {

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.service.Cookie');

  /** @private {!goog.net.Cookies} */
  this.cookies_ = new goog.net.Cookies(goog.dom.getDocument());
};
goog.addSingletonGetter(low.service.Cookie);


/**
 * @enum {string}
 */
low.service.Cookie.Name = {
  CLIENT_ID: 'CLIENT_ID'
};


/**
 * Gets the cookie identified by the name.
 * @param {!low.service.Cookie.Name} cookieName
 * @return {string}
 */
low.service.Cookie.prototype.get = function(cookieName) {
  return this.cookies_.get(cookieName) || '';
};
