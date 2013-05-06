/**
 * Provides a service for shared XHR functionality such as the manager.
 */

goog.provide('low.service.Xhr');

goog.require('goog.Disposable');
goog.require('goog.async.Deferred');
goog.require('goog.events.EventHandler');
goog.require('goog.log');
goog.require('goog.net.EventType');
/** @suppress {extraRequire} Needed for compiler type warning. */
goog.require('goog.net.XhrLite');
goog.require('goog.net.XhrManager');
goog.require('goog.ui.IdGenerator');



/**
 * @constructor
 * @extends {goog.Disposable}
 */
low.service.Xhr = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.service.Xhr');

  /**
   * Generator for unique IDs to be used for requests on the XHR manager.
   * @private {!goog.ui.IdGenerator}
   */
  this.idGenerator_ = goog.ui.IdGenerator.getInstance();

  /** @private {!goog.net.XhrManager} */
  this.xhrManager_ = new goog.net.XhrManager();
  this.registerDisposable(this.xhrManager_);

  /** @private {!Object.<!goog.async.Deferred>} */
  this.pendingMap_ = {};

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(this.xhrManager_,
      goog.net.EventType.ERROR,
      this.onError_);
  handler.listen(this.xhrManager_,
      goog.net.EventType.SUCCESS,
      this.onSuccess_);
};
goog.inherits(low.service.Xhr, goog.Disposable);
goog.addSingletonGetter(low.service.Xhr);


/**
 * Sends a request to the given URI.
 * @param {!goog.Uri} uri The URI to which to make the request.
 * @return {!goog.async.Deferred.<!goog.net.XhrManager.Event>} The callback
 *     happens after the send completes successfully and the errback happens if
 *     an error occurs.
 */
low.service.Xhr.prototype.send = function(uri) {
  var deferred = new goog.async.Deferred();

  var requestId = this.idGenerator_.getNextUniqueId();
  this.xhrManager_.send(requestId, uri.toString());
  this.pendingMap_[requestId] = deferred;

  return deferred;
};


/**
 * Called when an XHR request fails.
 * @param {!goog.net.XhrManager.Event} e
 * @private
 */
low.service.Xhr.prototype.onError_ = function(e) {
  goog.log.error(this.logger, 'XHR failed');
  var deferred = this.pendingMap_[e.id];
  if (deferred) {
    deferred.errback(e);
    delete this.pendingMap_[e.id];
  } else {
    goog.log.error(this.logger, 'No deferred for failed request.');
  }
};


/**
 * Called when an XHR request succeeds.
 * @param {!goog.net.XhrManager.Event} e
 * @private
 */
low.service.Xhr.prototype.onSuccess_ = function(e) {
  var deferred = this.pendingMap_[e.id];
  if (deferred) {
    deferred.callback(e);
    delete this.pendingMap_[e.id];
  } else {
    goog.log.error(this.logger, 'No deferred for successful request.');
  }
};
