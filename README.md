```
  commit 규칙
  ADD⚡(:zap:),
  FIX🔨(:hammer:),
  UPDATE🖊️(:pen:),
  DELETE🗑️(:wastebasket:)
```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run startw

# watch mode
$ pnpm run startbw

# production mode
$ npm run start:all
```

## update version

`변경사항 모두 커밋 완료 필요`

npm version patch  # 기본 버전 증가

npm version minor  # 부 버전 증가

npm version major  # 주 버전 증가

## 스케줄러 옵션

SCHEDULE # in 도커 스케줄러 실행 옵션 , 도커에서 돌가는 amr스케줄 실행 조건

LOCAL_SCHEDULE # in 로컬 스테줄러 실행 옵션 , nas 파일 업로드 실행조건

IF_ACTIVE # 로컬에서 돌아가는 nas 파일 업로드 실행조건


## docker 컨테이너 안에 있는 로그를 호스트에 복사하는 방법

docker cp schedule-server:/var/app/logs/http/2023-12-11.http.log serverlog

/var/app/logs/http 까지는 고정 밑에 파일은 YYYY-MM-DD.http.log 형태로 넣으면 됨

serverlog는 호스트에 저장할 폴더