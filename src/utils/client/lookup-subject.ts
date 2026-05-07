import { getCurrentUserId } from "@/lib/currentUser";

const LOOKUP_INDEX_KEY = "pseudo_id_index_key";

export interface LookupSubject {
  subjectId: string;
  indexKey: string;
}

/**
 * lookup 시스템이 사용하는 사용자 식별 정보.
 * - subjectId: 현재 사용자 식별자 → AT 의 sub 클레임 (단일 진실 소스)
 * - indexKey: pseudo_id 생성에 쓰는 별도 hash → localStorage 에 별도 저장
 *             없으면 subjectId 로 fallback (이전 호환성)
 */
export function resolveLookupSubjectFromStorage(): LookupSubject {
  if (typeof window === "undefined") {
    throw new Error("lookup source can only be read in browser environments.");
  }

  const subjectId = getCurrentUserId();
  if (!subjectId) {
    throw new Error("Missing lookup subjectId — AccessToken 이 없습니다.");
  }

  const rawIndexKey = localStorage.getItem(LOOKUP_INDEX_KEY)?.trim();
  const indexKey = rawIndexKey && rawIndexKey.length > 0 ? rawIndexKey : subjectId;

  return { subjectId, indexKey };
}
