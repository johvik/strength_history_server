@ECHO OFF
SETLOCAL

if "%1%"=="cov" (
  set STRENGTH_HISTORY_COV=1
  mingw32-make test-cov
  :: Replace &gt; &lt; &quot;
  type coverage.html | powershell -Command "$input | ForEach-Object { $_ -replace \""&"gt;\", \"">"\" -replace \""&"lt;\", \""<"\" -replace \""&"quot;\", '\"' }" > coverage.html
) else (
  mingw32-make test
)

ENDLOCAL
