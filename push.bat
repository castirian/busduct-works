@echo off
set /p msg=커밋 메시지를 입력하세요: 
git add .
git commit -m "%msg%"
git push
pause
