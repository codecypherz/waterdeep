
@echo off

echo.
call rmsymlinks.bat

echo.
echo ___________________________________________
echo Deploying Lords of Waterdeep to AppEngine...
echo.

"C:\Program Files\eclipse\plugins\com.google.appengine.eclipse.sdkbundle_1.7.7\appengine-java-sdk-1.7.7\bin\appcfg.cmd" ^
  update ..\war\

echo.
echo ___________________________________________
echo Deployment finished.
echo.
