/**
 * All messages going to the server implement this interface.
 */

goog.provide('low.message.Message');



/** @interface */
low.message.Message = function() { };


/** @return {!Object} */
low.message.Message.prototype.toJson;
