/**
 * All tests use this for initialization.  It's equivalent to setupPage in each
 * test.
 */

// Add these goog.requires to the testbase.js as well.
goog.require('goog.debug.Console');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');


// This function runs before any tests run.
(function() {

  // All tests should log everything.
  goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);

  // Make logging go to the console.
  if (!goog.debug.Console.instance) {
    goog.debug.Console.instance = new goog.debug.Console();
  }

  // Format the console logger.
  var logFormatter = goog.debug.Console.instance.getFormatter();
  logFormatter.showExceptionText = true;
  logFormatter.showSeverityLevel = true;
  goog.debug.Console.instance.setCapturing(true);
})();
