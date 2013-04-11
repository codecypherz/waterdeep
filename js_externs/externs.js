/*
 * This is assuming this line of code is executed before any compiled code is
 * loaded:
 * var appengine = goog.appengine
 */

var appengine = {};
/**
 * @param {string} token
 * @constructor
 */
appengine.Channel = function(token) {};
/**
 * @param {Object=} opt_handler
 */
appengine.Channel.prototype.open = function(opt_handler) {};
/**
 * @constructor
 */
appengine.Socket = function() {};
appengine.Socket.prototype.close = function() {};
