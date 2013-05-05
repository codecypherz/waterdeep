
@echo off
echo Building CSS...

java -jar ..\closure\gss\closure-stylesheets-20111230.jar ^
  --output-file ..\war\generated\low.css ^
  ..\js_src\ui\css\mixin.css ^
  ..\js_src\ui\css\base.css ^
  ..\js_src\ui\home\home.css ^
  ..\js_src\ui\waiting\waiting.css

echo Finished building CSS
