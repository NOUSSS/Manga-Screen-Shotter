@echo off
echo Installation des modules npm...
npm install

if %errorlevel% neq 0 (
  echo Une erreur s'est produite lors de l'installation des modules npm.
) else (
  echo Installation réussie. Lancement du programme...
  
  call start.bat
  del "%~f0"
)
