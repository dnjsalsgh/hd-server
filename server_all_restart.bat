@echo off

rem docker rebuild 스크립트 실행
docker-compose up --build

rem npm 스크립트 실행
npm run reload:all

