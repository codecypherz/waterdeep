
@echo off

echo ___________________________________________
echo Creating symbolic links
rmdir ..\war\closure
rmdir ..\war\js_externs
rmdir ..\war\js_generated
rmdir ..\war\js_src
mklink /d ..\war\closure ..\closure
mklink /d ..\war\js_externs ..\js_externs
mklink /d ..\war\js_generated ..\js_generated
mklink /d ..\war\js_src ..\js_src

echo ___________________________________________
echo Running Lords of Waterdeep locally...
echo.

"C:\Program Files\eclipse\plugins\com.google.appengine.eclipse.sdkbundle_1.7.7\appengine-java-sdk-1.7.7\bin\dev_appserver.cmd" ^
   --port=8888 ..\war\

echo ___________________________________________
echo Server shut down successfully.
echo.
