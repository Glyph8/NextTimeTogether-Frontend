const LOOKUP_USER_ID_KEY = "hashed_user_id_for_manager";
const LOOKUP_INDEX_KEY = "pseudo_id_index_key";

export interface LookupSubject {
  subjectId: string;
  indexKey: string;
}

export function resolveLookupSubjectFromStorage(): LookupSubject {
  if (typeof window === "undefined") {
    throw new Error("lookup source can only be read in browser environments.");
  }

  const subjectId = localStorage.getItem(LOOKUP_USER_ID_KEY)?.trim();
  const rawIndexKey = localStorage.getItem(LOOKUP_INDEX_KEY)?.trim();

  if (!subjectId) {
    throw new Error("Missing lookup subjectId.");
  }

  const indexKey = rawIndexKey && rawIndexKey.length > 0 ? rawIndexKey : subjectId;

  return { subjectId, indexKey };
}
