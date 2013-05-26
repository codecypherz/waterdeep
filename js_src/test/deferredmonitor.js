
goog.provide('low.test.DeferredMonitor');



/**
 * Starts monitoring the deferred object for calls to the callback or errback.
 * Use this as a convenient way to verify deferred state within a unit test.
 * @param {!goog.async.Deferred} deferred The deferred to monitor.
 * @constructor
 */
low.test.DeferredMonitor = function(deferred) {

  /** @private {boolean} True if the callback has been called. */
  this.calledBack_ = false;

  /** @private {boolean} True if the errback has been called. */
  this.erredBack_ = false;

  // Monitor the deferred.
  deferred.addCallbacks(
      function() {
        this.calledBack_ = true;
      },
      function() {
        this.erredBack_ = true;
      },
      this);
};


/**
 * Asserts that neither the callback or errback have been called.
 */
low.test.DeferredMonitor.prototype.assertNoActivity = function() {
  assertFalse(this.calledBack_);
  assertFalse(this.erredBack_);
};


/**
 * Asserts the callback has been called back.
 */
low.test.DeferredMonitor.prototype.assertCallback = function() {
  assertTrue(this.calledBack_);
  assertFalse(this.erredBack_);
};


/**
 * Asserts the errback has been called back.
 */
low.test.DeferredMonitor.prototype.assertErrback = function() {
  assertFalse(this.calledBack_);
  assertTrue(this.erredBack_);
};
