
@echo off
echo Deleting all old soy files.
rmdir /s /q ..\js_generated
mkdir ..\js_generated

echo Building all soy templates...
java -jar ..\closure\soy\SoyToJsSrcCompiler.jar ^
  --shouldProvideRequireSoyNamespaces ^
  --shouldGenerateJsdoc ^
  --inputPrefix ..\js_src\ ^
  --outputPathFormat ..\js_generated\{INPUT_DIRECTORY}{INPUT_FILE_NAME_NO_EXT}_soy.js ^
  ui\game\game.soy ^
  ui\home\home.soy ^
  ui\loading\loading.soy ^
  ui\waiting\waiting.soy

echo Finished building the soy templates.
