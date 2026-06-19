# 나의 가족 이야기

가족 사진과 추억을 기록하는 Next.js MVP 앱입니다. Clerk 인증으로 로그인한 사용자만 사진 갤러리를 볼 수 있고, 사진과 설명은 브라우저 localStorage에 사용자별로 저장됩니다.

## 주요 기능

- Clerk 로그인, 회원가입, 로그아웃
- 비로그인 사용자용 랜딩 페이지
- 로그인 후 사진 업로드 및 설명 입력
- masonry 레이아웃 갤러리
- 사진 클릭 시 확대 보기와 설명 표시

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 빌드 및 검사

```bash
npm run lint
npm run build
```

## 환경 변수

Clerk 사용을 위해 `.env`에 Clerk 관련 키를 설정합니다. `.env` 파일은 저장소에 커밋하지 않습니다.
