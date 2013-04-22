/**
 * The set of top-level utilities that are useful to the entire application.
 */

goog.provide('low');

goog.require('goog.events');


/**
 * Creates a unique event id.  This is a convenient alias.
 * @param {string} identifier The identifier.
 * @return {string} A unique identifier.
 */
low.getUniqueId = goog.events.getUniqueId;
