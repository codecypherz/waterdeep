/**
 * Utility class for tests in Lords of Waterdeep.
 */

goog.setTestOnly();
goog.provide('low.test');
goog.provide('low.test.PathMatcher');
goog.provide('yugi.test');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
/** @suppress {extraRequire} */
goog.require('goog.testing.Mock');
goog.require('goog.testing.MockControl');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.events');
goog.require('goog.testing.mockmatchers');
goog.require('goog.testing.mockmatchers.ArgumentMatcher');


/**
 * Convenient reference to the argument ignorer.
 * @type {!goog.testing.mockmatchers.IgnoreArgument}
 */
low.test.ignore = goog.testing.mockmatchers.ignoreArgument;


/**
 * Mocks the class and makes the getInstance() function return the mock.
 * @param {!goog.testing.MockControl} mockControl The mock control.
 * @param {!Object} clazz The class to mock.
 * @return {!goog.testing.Mock} The mocked object.
 */
low.test.mock = function(mockControl, clazz) {
  var mock = mockControl.createLooseMock(clazz);
  clazz.getInstance = function() {
    return mock;
  };
  return clazz.getInstance();
};


/**
 * Verifies the execution of the given function.  This is a convenience method
 * so you don't have to write the $replayAll(), $verifyAll(), and $resetAll()
 * lines everywhere.
 * @param {!goog.testing.MockControl} mockControl The mock control.
 * @param {!Function} fn The function to execute after $replayAll() and before
 *     $verifyAll() and $resetAll().
 * @param {Object=} opt_this Specifies the object which "this" should point to
 *     when the function is ran.
 * @param {...*} var_args The objects to cleanup.
 */
low.test.verify = function(mockControl, fn, opt_this, var_args) {
  mockControl.$replayAll();
  fn.apply(opt_this, goog.array.slice(arguments, 3));
  mockControl.$verifyAll();
  mockControl.$resetAll();
};


/**
 * Ticks the clock and verifies.
 * @param {!goog.testing.MockControl} mockControl The mock control object.
 * @param {!goog.testing.MockClock} mockClock The mock clock.
 * @param {number} delay The delay, in milliseconds, by which to tick the clock.
 */
low.test.tickAndVerify = function(mockControl, mockClock, delay) {
  low.test.verify(mockControl, function() {
    mockClock.tick(delay);
  });
};


/**
 * Creates an sandbox element to test UI components.  It is automatically
 * appended to the document's body tag and returned to the caller for future
 * clean-up.
 * @return {!Element} The sandbox element that is now appended to the body.
 */
low.test.newSandbox = function() {
  var dom = goog.dom.getDomHelper();
  var sandbox = dom.createElement(goog.dom.TagName.DIV);
  dom.appendChild(dom.getDocument().body, sandbox);
  return sandbox;
};


/**
 * Fires a click event on the element within the replay block of a test.  This
 * is a convenience method for clicking an element and verifying expectations.
 * The most common use case is to set expectations on your mocked objects, then
 * call this method to verify clicking the element meets those expectations.
 *
 * @param {!goog.testing.MockControl} mockControl The mock control object.
 * @param {!Element} element The element to click.
 */
low.test.clickAndVerify = function(mockControl, element) {
  low.test.verify(mockControl, function() {
    goog.testing.events.fireClickSequence(element);
  });
};


/**
 * Dispatches an event on the mocked object and verifies the mock control.  This
 * is a convenience method that will correctly dispatch the event on the mocked
 * object which requires setting up the parent event target.  The event will
 * then be dispatched within the usual $replayAll(), $verifyAll(), and
 * $resetAll() section of the test.
 *
 * Example usage of this function:
 *   // Set up all expectations before event dispatch.
 *   mockedObject.someMethod().$returns(someValue);
 *   ...
 *   low.test.dispatchAndVerify(mockControl, mockedObject, someEvent);
 *   // End test - no need to call $replayAll(), $verifyAll(), or $resetAll().
 *
 * @param {!goog.testing.MockControl} mockControl The mock control object.
 * @param {*} mockedObject The mocked object on which the event should be
 *     dispatched.  This class being mocked *must* be extending
 *     {goog.events.EventTarget}.
 * @param {!goog.events.Event|string} event The event to dispatch.
 */
low.test.dispatchAndVerify =
    function(mockControl, mockedObject, event) {

  // Set the expectations for dispatching on a mocked event target.
  var mockedFunction = /** @type {!goog.events.EventTarget} */ (mockedObject).
      getParentEventTarget();
  /** @type {!goog.testing.Mock} */ (mockedFunction).$returns(null).$anyTimes();

  // Replay everything, dispatch the event, then verify.
  low.test.verify(mockControl, function() {
    goog.events.dispatchEvent(
        /** @type {!goog.events.EventTarget} */ (mockedObject), event);
  });
};


/**
 * Disposes of everything including cleaning up objects that are in the DOM then
 * performs an event listener leak check.
 * @param {...*} var_args The objects to dispose.
 */
low.test.tearDown = function(var_args) {

  // Dispose of everything.
  for (var i = 0; i < arguments.length; i++) {
    low.test.dispose(arguments[i]);
  }

  // Check for memory leaks.
  var totalListeners = goog.events.getTotalListenerCount();
  if (totalListeners) {
    // Remove all events so the next test is clean.
    goog.events.removeAll();
    // Say that this test failed.
    if (totalListeners == 1) {
      throw new Error(totalListeners + ' listener was leaked!');
    } else {
      throw new Error(totalListeners + ' listeners were leaked!');
    }
  }
};


/**
 * Disposes of any kind of object safely.  Handles all sorts of input, including
 * null, undefined, DOM nodes, goog.Disposable objects, etc.
 * @param {*} object The object to dispose.
 */
low.test.dispose = function(object) {
  if (!goog.isDefAndNotNull(object)) {
    return;
  }
  if (object instanceof goog.testing.MockControl) {
    var mc = /** @type {!goog.testing.MockControl} */ (object);
    mc.$resetAll();
    mc.$tearDown();
  } else if (object instanceof goog.testing.PropertyReplacer) {
    var pr = /** @type {!goog.testing.PropertyReplacer} */ (object);
    pr.reset();
  } else if (goog.dom.isNodeLike(object)) {
    var node = /** @type {!Node} */ (object);
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  } else {
    // The catch all which will call dispose() if it is a goog.Disposable.
    goog.dispose(object);
  }
};



/**
 * A matcher that verifies the URI passed has the given path.
 * @param {string} path The path the URI must have.
 * @constructor
 * @extends {goog.testing.mockmatchers.ArgumentMatcher}
 */
low.test.PathMatcher = function(path) {
  goog.base(this,
      function(uriParam) {
        var uri = goog.isString(uriParam) ? goog.Uri.parse(uriParam) : uriParam;
        return path == uri.getPath();
      },
      path);
};
goog.inherits(
    low.test.PathMatcher,
    goog.testing.mockmatchers.ArgumentMatcher);
