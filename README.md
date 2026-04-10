<div align="center">

<!-- [프로젝트 로고 이미지: logo-full.png 또는 logo-full.svg] -->

# 타임투게더 (NextTimeTogether)

**시간 조율 걱정 없이 그룹 모임을 편하고 빠르게**

그룹 일정 조율부터 장소 선정까지, 모임 준비의 모든 과정을 한 곳에서.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BFF8?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [주요 기능](#2-주요-기능)
3. [기술 스택](#3-기술-스택)
4. [시작하기](#4-시작하기)
5. [환경 변수 설정](#5-환경-변수-설정)
6. [프로젝트 구조](#6-프로젝트-구조)
7. [주요 아키텍처](#7-주요-아키텍처)
8. [✨ 기술 구현 하이라이트](#8--기술-구현-하이라이트)
9. [개발 가이드](#9-개발-가이드)
10. [API 코드 자동 생성](#10-api-코드-자동-생성)

---

## 1. 프로젝트 소개

<!-- [서비스 메인 화면 스크린샷: 랜딩 페이지] -->

**타임투게더**는 그룹 모임 일정 조율을 위한 웹 애플리케이션입니다.  
여러 사람의 가능 시간을 한눈에 파악하고, 팀원들과 함께 모임 장소를 투표로 정할 수 있습니다.  
AI 추천 장소 기능을 통해 모임 준비 과정을 더욱 빠르고 간편하게 만들어 줍니다.

### 핵심 가치

- 📅 **시간 조율 간소화** — When2Meet 방식의 가용 시간 그리드로 최적의 일정을 빠르게 도출
- 📍 **장소 선정 자동화** — AI 기반 장소 추천 및 멤버 투표로 모두가 만족하는 장소 결정
- 👥 **그룹 중심 설계** — 그룹 단위로 일정을 관리하고 멤버를 초대하여 함께 조율

---

## 2. 주요 기능

### 🔐 인증
<!-- [스크린샷: 로그인 / 회원가입 화면] -->
- **일반 로그인** — 이메일 + 비밀번호 인증
- **SNS 로그인** — 네이버, 카카오, 구글 OAuth 2.0
- **단계별 회원가입 (6단계)** — 이메일 인증 → 비밀번호 → 닉네임 → 생년월일 → 관심사 → 프로필 이미지

### 👥 그룹 관리
<!-- [스크린샷: 그룹 목록 및 상세 화면] -->
- 그룹 생성 및 목록 조회
- 멤버 초대 (초대 링크 / 다이얼로그)
- 그룹 탈퇴

### 📅 일정 조율 (When2Meet)
<!-- [스크린샷: 시간 조율 그리드 화면] -->
- 날짜·시간 범위 설정으로 일정 생성
- 개인 가능 시간 입력
- 멤버별 가능 시간 현황 매트릭스 시각화
- 최종 일정 확정

### 📍 장소 선정 (Where2Meet)
<!-- [스크린샷: 장소 선정 화면] -->
- **AI 추천** — 멤버 관심사 기반 자동 장소 추천
- **직접 입력** — 원하는 장소를 직접 추가
- **투표** — 멤버들이 장소에 투표, 득표 수 실시간 표시
- 최종 장소 확정

### 🗓️ 캘린더
<!-- [스크린샷: 캘린더 뷰] -->
- FullCalendar 기반 월간 캘린더
- 확정된 일정 시각화

### 👤 마이페이지
- 프로필 정보 조회
- 참여한 일정 히스토리

---

## 3. 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **스타일링** | Tailwind CSS 4, Shadcn UI, Radix UI, Lucide React |
| **상태 관리** | Zustand 5 (클라이언트 상태), TanStack React Query 5 (서버 상태) |
| **폼 & 유효성** | React Hook Form 7, Zod 4 |
| **HTTP 클라이언트** | Axios 1 |
| **캘린더** | FullCalendar 6 (daygrid, interaction) |
| **날짜 유틸** | date-fns 4 |
| **미디어 업로드** | Cloudinary (next-cloudinary) |
| **보안** | Argon2 (비밀번호 해싱), Upstash Redis (세션), CSP 미들웨어 |
| **API 타입 생성** | swagger-typescript-api |
| **SVG 처리** | SVGR (@svgr/webpack) |
| **토스트 알림** | Sonner, react-hot-toast |

---

## 4. 시작하기

### 사전 요구사항

- **Node.js** 18 이상
- **npm** (또는 yarn / pnpm)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/Glyph8/NextTimeTogether-Frontend.git
cd NextTimeTogether-Frontend

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정 (아래 섹션 참고)
cp .env.example .env.local

# 4. 개발 서버 실행
npm run dev
```

개발 서버가 시작되면 브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

### 빌드 및 프로덕션 실행

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 린트 검사

```bash
npm run lint
```

---

## 5. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 변수를 설정합니다.

```env
# 백엔드 API 기본 URL
NEXT_PUBLIC_API_BASE_URL=https://your-api-backend.com

# Cloudinary (이미지 업로드)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Upstash Redis (세션 관리, 선택 사항)
UPSTASH_REDIS_REST_URL=https://your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

> ⚠️ `.env.local` 파일은 `.gitignore`에 포함되어 있으므로 절대 커밋하지 마세요.

---

## 6. 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   ├── login/                # 로그인
│   │   ├── register/             # 회원가입 (step1 ~ step6)
│   │   ├── sns-signup/           # SNS 로그인 (네이버, 카카오, 구글)
│   │   └── complete-signup/      # 가입 완료
│   ├── (dashboard)/              # 메인 앱 라우트 그룹
│   │   ├── appointment/          # 약속 / 일정 목록
│   │   ├── calendar/             # 캘린더 뷰
│   │   ├── groups/               # 그룹 목록, 생성, 상세
│   │   │   └── detail/[groupId]/ # 그룹 상세 & 일정 관리
│   │   └── my/                   # 마이페이지 & 히스토리
│   ├── api/                      # Next.js Route Handlers
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 랜딩 / 홈
│
├── api/                          # API 호출 레이어 (Axios 래퍼)
│   ├── index.ts                  # Axios 인스턴스 (토큰 인터셉터 포함)
│   ├── auth.ts                   # 인증 API
│   ├── calendar.ts               # 캘린더 API
│   ├── when2meet.ts              # 시간 조율 API
│   ├── where2meet.ts             # 장소 선정 API (AI 포함)
│   ├── group-view-create.ts      # 그룹 CRUD API
│   └── ...
│
├── apis/generated/               # Swagger 자동 생성 API 타입
│   └── Api.ts
│
├── components/
│   ├── shared/                   # 공통 재사용 컴포넌트
│   │   ├── BottomNav/            # 하단 내비게이션 바
│   │   ├── Dialog/               # 다이얼로그 (PlainDialog, YesNoDialog)
│   │   ├── Input/                # 입력 컴포넌트 (TextInput, RadioButton)
│   │   ├── ToastButton/          # 토스트 알림
│   │   └── Cloudinary/           # 이미지 업로드
│   └── ui/                       # Shadcn UI 기반 원자 컴포넌트
│       ├── button/
│       ├── header/
│       ├── dialog.tsx
│       ├── drawer.tsx
│       └── sonner.tsx
│
├── store/                        # Zustand 전역 상태
│   ├── auth.store.ts             # 인증 상태 (accessToken, isAuthenticated)
│   └── signupStore.ts            # 회원가입 단계별 폼 상태
│
├── hooks/                        # 커스텀 훅
│   ├── useAuthSession.ts         # 앱 마운트 시 토큰 복원
│   ├── useDebounce.ts
│   ├── useGetMembers.ts
│   └── useSelection.ts
│
├── lib/
│   ├── schemas/                  # Zod 유효성 스키마
│   ├── session.ts                # 세션 유틸리티
│   ├── redis.ts                  # Upstash Redis 클라이언트
│   └── utils.ts                  # 공통 유틸리티 (cn 등)
│
├── assets/
│   ├── pngs/                     # PNG 이미지 (로고 등)
│   └── svgs/icons/               # SVG 아이콘 (SVGR 처리)
│
├── types/                        # TypeScript 타입 정의
├── utils/                        # 유틸리티 함수
├── constants.ts                  # 앱 상수
├── middleware.ts                 # CSP 보안 헤더 미들웨어
└── providers.tsx                 # React Query, Toast 프로바이더
```

---

## 7. 주요 아키텍처

### 인증 흐름

```
로그인 요청
    → 백엔드에서 Access Token 발급
    → Zustand auth.store에 메모리 저장 (클라이언트 단일 소스)
    → 서버 전용 access_token(httpOnly) 쿠키 동기화 (SSR/BFF 전용)
    → refresh_token은 httpOnly 쿠키 단일 소스 유지
    → 모든 API 요청에 Authorization 헤더로 자동 첨부
    → 앱 재마운트 시 useAuthSession 훅으로 토큰 복원 시도
```

> Access Token은 메모리(Zustand)에만 저장하여 XSS 공격으로부터 보호합니다.

### API 레이어

```
컴포넌트
    → src/api/*.ts (비즈니스 로직 래퍼)
        → clientBaseApi (Axios 인스턴스, 토큰 자동 주입)
            → 백엔드 REST API
```

Swagger/OpenAPI로부터 자동 생성된 타입(`src/apis/generated/Api.ts`)을 기반으로, `src/api/` 레이어에서 에러 처리와 응답 변환을 담당합니다.

### 보안

| 항목 | 내용 |
|------|------|
| **CSP** | `middleware.ts`에서 nonce 기반 Content Security Policy 헤더 설정 |
| **토큰 저장** | AccessToken: 메모리(Zustand) 중심 + 서버 전용 보조 쿠키, RefreshToken: httpOnly 쿠키 단일 소스 |
| **비밀번호 해싱** | Argon2 사용 (Node.js / 브라우저 양쪽 지원) |
| **세션** | Upstash Redis 서버사이드 세션 (선택적 사용) |
| **보안 헤더** | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` |

---

## 8. ✨ 기술 구현 하이라이트

> 단순한 CRUD를 넘어, 보안·UX·실시간성을 고려해 직접 설계하고 구현한 기술 포인트들입니다.

---

### 🔐 1. E2EE 기반 클라이언트 사이드 암호화 아키텍처

**문제 인식**: 사용자 식별 정보를 서버에 평문으로 보내면, 서버 침해 시 사용자 정보가 노출됩니다. 비밀번호도 네트워크 단에서 인터셉트될 수 있습니다.

**해결책**: 브라우저 표준 Web Crypto API를 활용하여 클라이언트에서 암호화·해싱 후 서버 전송. 원본 자격증명(ID/PW)은 네트워크를 통해 절대 전송되지 않습니다.

**전체 흐름**:

```
[사용자 입력: ID + PW]
        ↓
[PBKDF2로 MasterKey 파생] ← (100,000 iterations, SHA-256)
        ↓
[HMAC-SHA256으로 해시된 UserId 생성]
[PBKDF2로 해시된 Password 생성] ← (200,000 iterations, 인증용)
        ↓
[해시값만 서버로 전송 → 인증 성공]
        ↓
[MasterKey → IndexedDB에 'extractable: false' CryptoKey로 저장]
[UserId → MasterKey로 AES-GCM 암호화 → localStorage 저장]
```

**MasterKey 파생** — `src/utils/crypto/generate-key/derive-masterkey.ts`

```typescript
export async function deriveMasterKeyPBKDF2(
  userId: string,
  password: string
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const salt = encoder.encode(userId); // userId를 salt로 사용

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256 // 256비트 키
  );

  return derivedBits;
}
```

**IndexedDB에 '추출 불가' CryptoKey 저장** — `src/utils/client/key-storage.ts`

```typescript
export async function storeMasterKey(masterKey: ArrayBuffer): Promise<void> {
  // extractable: false → JS 코드로 키 값을 꺼낼 수 없음 (XSS 방어)
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    masterKey,
    { name: "AES-GCM" },
    false,            // ← 핵심: 추출 불가
    ["encrypt", "decrypt"]
  );

  const db = await openKeyStoreDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  await new Promise<void>((resolve, reject) => {
    const request = store.put(cryptoKey, KEY_ID);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
```

**AES-GCM 암호화 (랜덤 IV 포함)** — `src/utils/client/crypto/crypto-storage.ts`

```typescript
export async function encryptStringToBase64(
  data: string,
  key: CryptoKey
): Promise<string> {
  // 매 암호화마다 새로운 12바이트 랜덤 IV 생성
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(data);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedData
  );

  // [IV(12바이트)] + [암호문]을 하나의 버퍼로 결합하여 저장
  const combinedBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combinedBuffer.set(iv, 0);
  combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.length);

  return arrayBufferToBase64(combinedBuffer.buffer);
}
```

> 이 구조 덕분에 서버 DB나 localStorage가 탈취되더라도 원본 사용자 정보는 복원할 수 없습니다.

---

### 🔑 2. Silent Token Refresh (BFF 패턴)

**문제 인식**: AccessToken을 localStorage에 저장하면 XSS 공격에 취약합니다. RefreshToken을 클라이언트에 노출하면 토큰 탈취 위험이 있습니다.

**해결책**: `AccessToken`은 **Zustand 메모리 중심**으로 사용하고, 서버 컴포넌트/BFF 호출 호환을 위해 **서버 전용 `access_token` httpOnly 쿠키**를 동기화합니다. `RefreshToken`은 **`refresh_token` httpOnly 쿠키 단일 소스**로 유지합니다. 페이지 새로고침 시 Next.js Server Action(BFF)으로 AccessToken을 재발급하고 실패 시 인증 흔적을 일괄 정리합니다.

**세션 복원 흐름** — `src/hooks/useAuthSession.ts`

```typescript
export const useAuthSession = () => {
  const { accessToken, setAccessToken, userId, setUserId, clearAccessToken } = useAuthStore();

  useEffect(() => {
    // 이미 메모리에 세션이 있으면 복원 불필요
    if (accessToken && userId) { setIsRestoring(false); return; }

    const restoreSession = async () => {
      try {
        // 1. IndexedDB에서 MasterKey 가져오기
        const masterKey = await getMasterKey();
        if (!masterKey) throw new Error("MasterKey 없음. 로그인 필요.");

        // 2. AES-GCM으로 암호화된 userId 복호화
        const encryptedUserId = localStorage.getItem("encrypted_user_id");
        const userId = await decryptStringFromBase64(encryptedUserId!, masterKey);

        // 3. httpOnly 쿠키의 RefreshToken으로 새 AccessToken 발급 (Server Action)
        const refreshResult = await refreshAccessToken();
        if (!refreshResult.success) throw new Error(refreshResult.error);

        // 4. 복원된 데이터를 Zustand(메모리)에 저장
        setUserId(userId);
        setAccessToken(refreshResult.accessToken!);
      } catch (err) {
        clearAccessToken();
        localStorage.removeItem("encrypted_user_id");
        router.replace("/login");
      }
    };

    restoreSession();
  }, [accessToken, userId, ...]);
};
```

**Server Action (BFF)** — `src/app/(auth)/login/refresh.action.ts`

```typescript
"use server";

export async function refreshAccessToken(): Promise<RefreshActionState> {
  // httpOnly 쿠키는 서버에서만 읽을 수 있음 (클라이언트 JS 접근 불가)
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) return { success: false, error: "No refresh token." };

  const response = await axios.post(`${MAIN_BACKEND_URL}/auth/refresh`, null, {
    headers: { "Refresh-token": refreshToken },
  });

  if (response.data.code === 200 && response.headers["authorization"]) {
    return { success: true, accessToken: response.headers["authorization"] };
  }
  // 실패 시 만료된 쿠키 제거
  cookieStore.set("refresh_token", "", { maxAge: 0, path: "/" });
  return { success: false, error: "Session expired." };
}
```

| 저장 위치 | 데이터 | 이유 |
|-----------|--------|------|
| **Zustand (메모리)** | AccessToken | 클라이언트 API 인증의 기준 상태 |
| **httpOnly 쿠키 (서버 전용)** | AccessToken (`access_token`) | SSR/BFF 서버 경로 호환용 |
| **httpOnly 쿠키** | RefreshToken (`refresh_token`) | 세션 유지 단일 소스, JS 접근 불가 |
| **IndexedDB** | 추출불가 CryptoKey | JS로 키 값 추출 불가 → XSS 방어 |
| **localStorage** | 암호화된 UserId | 복호화 키 없이는 무의미한 데이터 |

---

### ⏱️ 3. 실시간 시간 조율판 — Smart Polling 전략

**문제 인식**: 여러 멤버가 동시에 가능 시간을 입력하므로 실시간으로 화면을 갱신해야 합니다. 하지만 WebSocket 없이 폴링만 쓰면 사용자가 드래그 중일 때 UI가 덮어씌워지는 문제가 발생합니다.

**해결책**: TanStack React Query의 `refetchInterval`을 사용자 입력 상태(`isInputMode`)에 따라 동적으로 제어합니다. 드래그 시작 시 폴링 중단 → 드래그 완료 후 즉시 재개.

**스마트 폴링 훅** — `src/app/.../when-components/use-promise-time.ts`

```typescript
export const usePromiseTime = (promiseId: string, isInputMode: boolean = false) => {
  const boardQuery = useQuery<TimeBoardResponse>({
    queryKey: TIME_KEYS.board(promiseId),
    queryFn: () => getPromiseTimeBoard(promiseId),

    // 핵심: 드래그 중(isInputMode=true)이면 폴링 중단
    refetchInterval: isInputMode ? false : 5000,

    // 백그라운드 탭에서는 서버 자원 낭비 방지
    refetchIntervalInBackground: false,

    // 탭 복귀 시 즉시 최신 데이터 반영
    refetchOnWindowFocus: true,

    // staleTime 0: 폴링/포커스 이벤트마다 무조건 서버 데이터 신뢰
    staleTime: 0,

    // 새 데이터 로딩 중에도 기존 데이터 유지 → UI 깜빡임 방지
    placeholderData: (previousData) => previousData,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserTimeSlotReqDTO) => updateMyTimetable(promiseId, data),
    onSuccess: () => {
      // 내 시간 저장 즉시 보드 데이터 갱신
      queryClient.invalidateQueries({ queryKey: TIME_KEYS.board(promiseId) });
      toast.success("시간표가 저장되었습니다!");
    },
  });

  return { boardQuery, updateMutation, confirmMutation };
};
```

---

### 🖱️ 4. 드래그 기반 시간 선택 그리드 (Pointer Events API)

**문제 인식**: `mousedown` / `touchstart` 이벤트를 개별적으로 처리하면 모바일/데스크탑 환경에서 구현이 복잡해집니다. 또한 드래그로 영역을 선택할 때 스크롤과의 충돌을 막아야 합니다.

**해결책**: W3C 표준 **Pointer Events API** (`onPointerDown`, `onPointerEnter`, `onPointerUp`)를 사용하여 마우스·터치·스타일러스를 단일 API로 처리. `touchAction: "none"`으로 스크롤 충돌 방지.

**핵심 구현** — `src/app/.../when-components/TimeTableGrid.tsx`

```typescript
// 드래그 시작: 시작 셀 기록
const handlePointerDown = (day: number, time: number, e: React.PointerEvent) => {
  if (mode === "view") { onCellClick?.(day, time); return; }
  if (disabledSlots?.[day]?.[time]) return; // 비활성화 셀 무시

  e.preventDefault(); // 터치 스크롤 방지
  setIsDragging(true);
  onDragStart?.(); // 부모에 드래그 시작 알림 → 폴링 중단
  setStartCell({ day, time });
  setCurrentCell({ day, time });
};

// 드래그 완료: 시작~끝 셀 범위의 모든 셀 상태 일괄 토글
const handlePointerUp = () => {
  if (!isDragging || !startCell || !currentCell) {
    setIsDragging(false); return;
  }
  onDragEnd?.(); // 부모에 드래그 끝 알림 → 폴링 재개

  const newSelection = internalSelection.map((d) => [...d]);
  const minDay = Math.min(startCell.day, currentCell.day);
  const maxDay = Math.max(startCell.day, currentCell.day);
  const minTime = Math.min(startCell.time, currentCell.time);
  const maxTime = Math.max(startCell.time, currentCell.time);

  // 시작 셀의 기존 값에 따라 전체 범위를 선택/해제
  const newValue = !internalSelection[startCell.day][startCell.time];

  for (let d = minDay; d <= maxDay; d++) {
    for (let t = minTime; t <= maxTime; t++) {
      if (disabledSlots?.[d]?.[t]) continue; // 비활성화 셀 건너뜀
      newSelection[d][t] = newValue;
    }
  }

  setInternalSelection(newSelection);
  onChange?.(newSelection);
  setIsDragging(false);
};

// 각 셀에 적용되는 JSX
<div
  style={{ ...getCellStyle(dayIndex, timeIndex), touchAction: "none" }}
  onPointerDown={(e) => handlePointerDown(dayIndex, timeIndex, e)}
  onPointerEnter={() => handlePointerEnter(dayIndex, timeIndex)}
/>
```

**멤버 참여 현황 시각화** — 참여 인원 수에 따라 투명도(opacity)가 달라지는 히트맵 색상 계산:

```typescript
const getCellStyle = (day: number, time: number) => {
  if (mode === "view") {
    const count = data ? data[day][time] : 0;
    const opacity = count === 0 ? 0 : count / maxMembers;
    return {
      backgroundColor:
        count === 0 ? "transparent" : `rgba(139, 92, 246, ${opacity})`,
    };
  }
  // select 모드: 드래그 미리보기 반영
  let isSelected = internalSelection[day][time];
  if (isDragging && startCell && currentCell) {
    const inRange =
      day >= Math.min(startCell.day, currentCell.day) &&
      day <= Math.max(startCell.day, currentCell.day) &&
      time >= Math.min(startCell.time, currentCell.time) &&
      time <= Math.max(startCell.time, currentCell.time);
    if (inRange) isSelected = !internalSelection[startCell.day][startCell.time];
  }
  return { backgroundColor: isSelected ? "#FBBF24" : "transparent" };
};
```

---

### 🛡️ 5. CSP 미들웨어 — 다층 보안 헤더

**문제 인식**: XSS·클릭재킹·MIME 스니핑 등 일반적인 웹 공격을 방어하려면 HTTP 응답 헤더를 적절히 설정해야 합니다.

**해결책**: Next.js 미들웨어에서 모든 요청마다 nonce를 생성하고, CSP(Content Security Policy) 및 보안 헤더를 자동으로 적용합니다.

**미들웨어 구현** — `src/middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  // 매 요청마다 고유한 nonce 생성 (인라인 스크립트 허용 제어용)
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' ${cloudinaryWidgetDomain};
    style-src  'self' 'unsafe-inline';
    img-src    'self' blob: data: ${cloudinaryDomain};
    connect-src 'self' ${apiBaseUrl};
    font-src   'self' data:;
    object-src 'none';
    base-uri   'self';
    form-action 'self';
    frame-ancestors 'none';           // 클릭재킹 방지
    frame-src  'self' ${cloudinaryWidgetDomain};
    upgrade-insecure-requests;
  `;

  response.headers.set("Content-Security-Policy", ...);
  response.headers.set("X-Content-Type-Options", "nosniff");          // MIME 스니핑 방지
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)");                   // 최소 권한 원칙

  return response;
}
```

---

## 9. 개발 가이드

### SVG 아이콘 사용법

이 프로젝트는 SVG를 두 가지 방식으로 처리합니다.

| 위치 | 처리 방식 | 사용법 |
|------|-----------|--------|
| `src/assets/svgs/` | **SVGR** → React 컴포넌트 변환 | `import Icon from '@/assets/svgs/icons/search.svg'` → `<Icon />` |
| 그 외 폴더 | URL 기반 (asset 처리) | `import iconUrl from './icon.svg'` → `<Image src={iconUrl} />` |

> SVG 크기를 변경해야 할 경우, SVG 파일에서 `width`, `height` 속성을 직접 제거하세요.  
> 설정 파일: `src/svgr.d.ts`, `next.config.ts`

### 폰트

- 기본 폰트: **Pretendard**
- 설정 위치: `src/app/fonts.ts`
- CSS 변수: `--font-pretendard`

### 상태 관리 가이드

- **서버 상태** (API 데이터): TanStack React Query 사용
- **전역 클라이언트 상태** (인증, 다단계 폼): Zustand 사용
- **로컬 UI 상태**: React `useState` / `useReducer` 사용

### 컴포넌트 작성 규칙

- `src/components/ui/` — Shadcn UI 원자 컴포넌트 (직접 수정 가능)
- `src/components/shared/` — 페이지를 가리지 않고 재사용 가능한 컴포넌트
- 각 페이지 폴더 내 `components/` — 해당 페이지·기능 전용 컴포넌트

### 코드 스타일

- ESLint + `eslint-config-next` 기반
- TypeScript strict 모드 활성화
- 경로 별칭: `@/*` → `src/*`

---

## 10. API 코드 자동 생성

백엔드 Swagger 문서를 기반으로 TypeScript API 클라이언트 코드를 자동 생성합니다.

```bash
# 기본 생성
npm run gen:api

# 모듈 분리 생성
npm run gen:api:split

# 로컬 스펙 파일 기반 생성
npm run generate:api:local
```

생성 결과물은 `src/apis/generated/Api.ts`에 저장됩니다.  
API 스펙 소스: `https://meetnow.duckdns.org/v3/api-docs`

---

<div align="center">

**NextTimeTogether Frontend** · Built with ❤️ using Next.js & React

</div>
