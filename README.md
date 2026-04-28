<div align="center">

# NextTimeTogether Frontend

**그룹 모임의 시간·장소 조율을 위한 프론트엔드**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 요약
- Next.js App Router 기반의 일정/모임 관리 UI
- 그룹 생성/참여, 일정 조율(When2Meet 형태), 장소 선택/확정, 캘린더/마이페이지 제공
- 클라이언트 측 암호화 유틸이 존재하지만 **전체 데이터가 종단 간 암호화(E2EE)되는 구조는 아님**

---

## E2EE 여부 (정확한 현황)
**결론: 부분 적용된 클라이언트 암호화이며, 전체 E2EE는 아닙니다.**

코드 기준으로 확인되는 암호화 범위:
- **자격 증명 해싱**: 로그인 시 `PBKDF2` 기반 해시 값 전송 (`hashedUserId`, `hashedPassword`).
- **MasterKey**: `userId + password` 기반 PBKDF2로 파생, **IndexedDB에 extractable:false CryptoKey로 저장**.
- **그룹/약속 식별자 및 키 암호화**: `AES-GCM`으로 `encGroupId`, `encUserId`, `encPromiseKey` 등을 생성/복호화.
- **Lookup 식별자**: HMAC 기반 pseudo id/lookup id 생성.

암호화되지 않는 것으로 확인되는 영역(즉, E2EE 범위 밖):
- 일정 제목/설명, 시간표 데이터, 장소/주소 등 **업무 데이터 자체**
- 서버가 평문으로 처리하는 API 응답/요청 데이터(약속 상세, 장소 확정 등)

따라서 이 프로젝트는 **민감 식별자/키에 대한 클라이언트 암호화는 존재하지만, 전체 데이터의 종단 간 암호화는 구현되어 있지 않습니다.**

---

## 주요 기능 (코드 기준)
- **인증 UI 및 세션 복원**: 로그인/회원가입 화면, access/refresh 토큰 기반 세션 복원
- **그룹 관리**: 그룹 생성/상세/멤버 초대, 그룹 참여 플로우
- **약속/일정 조율**: 가용 시간 입력(시간표), 약속 상세/확정 흐름
- **장소 선택**: 장소 조회/확정 관련 화면
- **캘린더**: 일정 시각화
- **마이페이지**: 사용자 정보/히스토리 UI
- **이미지 업로드**: `/api/upload` → Cloudinary 업로드
- **장소 검색 API 프록시**: `/api/search` → Kakao Local API

---

## 기술 스택
| 영역 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript |
| 상태 관리 | Zustand, TanStack React Query |
| 폼/검증 | React Hook Form, Zod |
| 스타일링 | Tailwind CSS, Shadcn UI, Radix UI |
| 네트워킹 | Axios |
| 캘린더 | FullCalendar |
| 이미지 | next-cloudinary + Cloudinary SDK |
| 암호화 | Web Crypto API (PBKDF2, HMAC, AES-GCM) |
| 기타 | SVGR, react-hot-toast, sonner |

---

## 아키텍처/보안 요약
- **App Router 구조**: `src/app/(auth)`, `src/app/(dashboard)`, `src/app/api/*` Route Handler
- **인증 토큰**: access/refresh 토큰을 httpOnly 쿠키에 보관, access token은 Zustand 메모리에도 저장
- **세션 복원**: `useAuthSession`에서 refresh 액션을 호출하여 access token 재발급
- **클라이언트 암호화**: AES-GCM 기반 암호화/복호화 유틸 및 IndexedDB 키 저장
- **SVG 처리**: 기본 import는 SVGR, `?url` 쿼리 시 URL asset 로더
- **CSP/보안 헤더**: `src/proxy.ts`에 CSP 로직이 있으나, **현재 middleware로 연결되지 않아 기본 적용되지 않음**

---

## 환경 변수
> `.env` 파일은 저장소에 없으며, 아래 값은 코드에서 직접 참조됩니다.

### 필수
- `NEXT_PUBLIC_API_BASE_URL` : 메인 백엔드 API Base URL
- `CLOUDINARY_CLOUD_NAME` : Cloudinary 클라우드 이름 (`/api/upload`)
- `CLOUDINARY_API_KEY` : Cloudinary API Key (`/api/upload`)
- `CLOUDINARY_API_SECRET` : Cloudinary API Secret (`/api/upload`)
- `KAKAO_REST_API_KEY` : Kakao Local API 키 (`/api/search`)

### 옵션(기능 토글)
- `NEXT_PUBLIC_GROUP_LOOKUP_ENABLED` : 그룹 lookup 사용 여부 (기본 true)
- `NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST` : legacy encGroupId 동시 전송 여부 (기본 true)
- `NEXT_PUBLIC_PROMISE_LOOKUP_DUAL_REQUEST` : legacy encUserId 동시 전송 여부 (기본 true)

---

## 개발 스크립트
```bash
npm run dev      # next dev --webpack
npm run build    # next build --webpack
npm run start    # next start
npm run lint     # eslint
```

---

## API 타입 생성
```bash
npm run gen:api
npm run gen:api:split
npm run generate:api
npm run generate:api:local
```

---

## 디렉터리 구조 (요약)
```
src/
├── app/                 # App Router routes (auth, dashboard, api)
├── api/                 # Axios 기반 API 래퍼
├── apis/generated/      # Swagger 자동 생성 타입
├── assets/              # 이미지/아이콘
├── components/          # shared/ui 컴포넌트
├── hooks/               # 커스텀 훅
├── lib/                 # 쿠키/세션 유틸
├── store/               # Zustand 스토어
├── utils/               # 암호화/헬퍼/lookup 로직
└── constants.ts
```
