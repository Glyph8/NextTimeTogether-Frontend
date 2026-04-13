# PR 리뷰 코멘트 반영 결과

아래는 [PR #33 리뷰 스레드](https://github.com/Glyph8/NextTimeTogether-Frontend/pull/33#pullrequestreview-4096258737) 기준 반영 내용입니다.

## 1) `promise-lookup.ts` 중복 HMAC 로직 정리
- `makeLookupId` 내부의 별도 HMAC 구현을 제거했습니다.
- 기존 공통 유틸 `makePseudoId`(`src/utils/client/crypto/encryptClient.ts`)를 재사용하도록 변경했습니다.
- 결과: lookup 파생 로직의 중복을 줄이고, 해시 계산 경로를 단일화했습니다.

## 2) join 페이지 `status` 변수 shadowing 제거
- 파일: `src/app/(dashboard)/groups/detail/[groupId]/schedules/join/[promiseId]/page.tsx`
- `catch` 블록의 `const status`를 `const responseStatus`로 변경했습니다.
- 결과: 컴포넌트 상태 변수(`status`)와 HTTP 상태 변수 혼동 가능성을 제거했습니다.

## 3) `join-promise.ts` lookup 입력 일관성 수정
- 파일: `src/app/(dashboard)/groups/detail/[groupId]/schedules/create/utils/join-promise.ts`
- `resolveLookupContext()` 대신 `resolveLookupContextForUser(userId, lookupIndexKey)`를 사용하도록 변경했습니다.
- `encUserId`를 만드는 동일 `userId` 기준으로 lookup을 만들고, `lookupIndexKey`는 `pseudo_id_index_key`(없으면 `userId`)를 사용하도록 맞췄습니다.
- 결과: 요청 payload 내부 식별자 기준이 일관되도록 정리했습니다.

## 4) 예상 가능한 오류 상태에서 과도한 에러 로그 축소
- 대상 파일:
  - `src/api/promise-key.ts`
  - `src/api/promise-invite-join.ts`
  - `src/api/promise-view-create.ts`
- 400/403/404/409 등 예상 가능한 실패 상태에서는 상세 `console.error(data/status/headers)` 대신 구조화된 `console.warn`만 출력하도록 조정했습니다.
- 예상 외 상태에서만 상세 에러 로그를 출력합니다.
- 결과: 민감 응답 정보 노출 가능성과 로그 노이즈를 줄였습니다.

## 5) 검증 결과
- `npm run build`: 성공
- `npm run lint`: ESLint 설정/버전 충돌로 기존 실패 상태 재현 (`Converting circular structure to JSON`)
  - 이번 변경과 직접 관련 없는 기존 환경 이슈로 확인했습니다.
