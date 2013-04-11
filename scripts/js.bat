
@echo off

echo ==============
echo Building JS...
echo ==============
..\closure\bin\build\closurebuilder.py ^
  --root ..\closure\ ^
  --root ..\js_src\ ^
  --root ..\js_generated\ ^
  -n low ^
  -c ..\closure\compiler\compiler.jar ^
  -o compiled ^
  -f --compilation_level=ADVANCED_OPTIMIZATIONS ^
  -f --warning_level=VERBOSE ^
  -f --closure_entry_point=low.Main ^
  -f --accept_const_keyword ^
  -f --externs=..\js_externs\externs.js ^
  --output_file=..\war\generated\low.js
echo Finished building low.js.

echo =====================
echo Finished building JS.
echo =====================
