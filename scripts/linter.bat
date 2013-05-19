
@echo off
gjslint ^
  -r ../js_src ^
  --closurized_namespaces="goog,low" ^
  --strict ^
  --jslint_error=all ^
  --check_html
