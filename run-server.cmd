@echo off
setlocal enabledelayedexpansion

REM Navigate to repo root (directory of this script) and into server module
pushd "%~dp0"
cd /d "%~dp0server" || (
  echo [ERROR] Cannot find server directory relative to this script.
  popd
  exit /b 1
)

REM Detect Java and set JAVA_HOME for Maven Wrapper without changing environment permanently
set "JAVA_EXE="
for /f "delims=" %%J in ('where java 2^>nul') do (
  set "JAVA_EXE=%%J"
  goto :have_java
)
echo [ERROR] Java (java.exe) not found in PATH. Install JDK 21+ or add it to PATH.
popd
exit /b 1

:have_java
for %%K in ("%JAVA_EXE%") do set "JAVA_BIN=%%~dpK"
for %%K in ("%JAVA_BIN%") do set "JAVA_HOME=%%~dpK.."
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo JAVA_HOME=%JAVA_HOME%

REM Build the Spring Boot server (skip tests)
call mvnw.cmd -DskipTests clean package
if errorlevel 1 (
  echo [ERROR] Maven build failed.
  popd
  exit /b 1
)

REM Locate the generated JAR in target
set "JAR_PATH="
for /f "delims=" %%F in ('dir /b /a:-d target\*.jar 2^>nul') do (
  set "JAR_PATH=target\%%F"
)

if not defined JAR_PATH (
  echo [ERROR] No JAR found under %cd%\target. Expected something like server-0.0.1-SNAPSHOT.jar
  popd
  exit /b 1
)

echo Starting %JAR_PATH%
java -jar "%JAR_PATH%"
set "EXIT_CODE=%ERRORLEVEL%"

popd
exit /b %EXIT_CODE%


