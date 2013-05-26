/**
 * This is the highest level bootstrapping file for a JS test.  All tests
 * require this file and are thus initialized by it.
 */


/**
 * Writes a script tag with the src set to the file name given.
 * @param {string} fileName The value of the src.
 * @private
 */
function writeScriptTag_(fileName) {
  document.write(
      '<script type="text/javascript" src="' + fileName + '"></script>');
}

// Write the common dependencies.
writeScriptTag_('/closure/goog/base.js');
writeScriptTag_('/generated/deps.js');
writeScriptTag_('/js_externs/externs.js');

// Run through some more initialization.
writeScriptTag_('/js_src/test/testrequires.js');
writeScriptTag_('/js_src/test/testinit.js');
