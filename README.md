
# 2025 Nexnon 웹 백엔드 과제 전형

현재 문서는 프로젝트의 실행 방법을 다루며 각 서버에대한 문서는 각 프로젝트 최상위에 존재합니다.

https://github.com/asdasfafsf/m-a-_-p-l-e/blob/main/apps/auth/readme.md

https://github.com/asdasfafsf/m-a-_-p-l-e/blob/main/apps/event/readme.md

# 실행방법

프로젝트 루트 경로에서 아래 커맨드 입력

```tsx
docker-compose up -d
```

# API

api문서는 Swagger에서 확인 가능합니다.

[http://localhost:5561/swagger](http://localhost:3005/swagger)

API 호출 시 인증이 필요한 서비스는 **Authorization: Bearer** 헤더가 필요합니다

# 데이터

사전 정의된 계정과 현재 진행중인 이벤트가 자동 생성됩니다.

# 계정

```tsx
{

    "email": "asdasfafs1@asdasfafsf.com",
    "password":"Passw0rd!@",

}
```

비밀번호는 모두 동일합니다.

asdasfafsf1 ~ 3 : ADMIN

asdasfafsf4 ~ 10 : OPERATOR

asdasfafsf11 ~ 15 : AUDITOR

asdasfafsf16 ~ 50 : USER

# 만료시간 500일짜리 토큰

테스트 편의성을 위해 2026년에 만료되는 토큰을 각 계정 유형별로 발급받아 놓았습니다. 토큰 유형은 모두 access_token이며 refresh_token은 제공되지 않습니다. 

ADMIN : asdasfafsf1@asdasfafsf.com

```tsx
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk2ZTlkOS1jMzAxLTcxNDgtODViYy0yMTRkOTIyNTg0ZGUiLCJyb2xlcyI6WyJBRE1JTiJdLCJpYXQiOjE3NDc2ODE0MjIsImV4cCI6MTc5MDg4MTQyMn0.CxMm7H-rJiu913MyU59V3FFrIqb2jX23BhNH8VSxllk
```

OPERATOR: asdasfafsf4@asdasfafsf.com

```tsx
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk2ZTlkOS1jYzg2LTc5NDUtODI0MS0yYzlmMzU5ZWVlNDUiLCJyb2xlcyI6WyJPUEVSQVRPUiJdLCJpYXQiOjE3NDc2ODE1MDQsImV4cCI6MTc5MDg4MTUwNH0.KyWpsk5Y6ESZoS1nj1szqIieORa5yIcfBhAFIIswOh8
```

AUDITOR: asdasfafsf11@asdasfafsf.com

```tsx
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk2ZTlkOS1lMjU2LTcxMjQtYTgzYi0yNzUzNzFhYWJkMjQiLCJyb2xlcyI6WyJBVURJVE9SIl0sImlhdCI6MTc0NzY4MTU3NCwiZXhwIjoxNzkwODgxNTc0fQ.fAMmQLI8dgPH_H3ukZ9zL1RkjBeaTsNjoIzjx7RLkgA
```

USER: asdasfafsf20@asdasfafsf.com

```tsx
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk2ZTlkYS0wMDcxLTczOGQtYjUwYS1lNDRiMzBkYTM3OTIiLCJyb2xlcyI6WyJVU0VSIl0sImlhdCI6MTc0NzY4MTY5MCwiZXhwIjoxNzkwODgxNjkwfQ.rwp3Usam_oqW9vjLr_i7XoEJQoPO3T1oA_0nk-igkMc
```

# 현재 진행중인 이벤트

```json
{
    "name": "주황버섯을 잡아요!",
    "description": "주황버섯을 아주 많이 잡는 이벤트입니다.",
    "state": "STARTED",
    "startedAt": "2025-05-18T11:55:29.000Z",
    "endedAt": "2030-05-30T11:55:29.000Z",
    "uuid": "0196e9e7-6092-7995-bb41-0c0f7a9a8c01",
    "createdAt": "2025-05-19T18:56:17.045Z",
    "updatedAt": "2025-05-19T18:56:17.045Z"
}
```

복사 용도

```tsx
0196e9e7-6092-7995-bb41-0c0f7a9a8c01
```
