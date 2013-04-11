
@echo off
gjslint ^
  -r ../js_src ^
  --closurized_namespaces="goog,low" ^
  --strict ^
  --check_html
