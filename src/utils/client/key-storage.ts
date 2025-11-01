const DB_NAME = "E2EEKeyStore";
const STORE_NAME = "CryptoKeys";
const KEY_ID = "userMasterKey"; // IndexedDB에 저장될 키의 이름

/**
 * IndexedDB 연결을 열고 객체 저장소를 준비합니다.
 */
function openKeyStoreDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      // DB가 없거나 버전이 낮을 때 실행
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error("IndexedDB 열기 실패:", request.error);
      reject(request.error);
    };
  });
}

/**
 * [E2EE 핵심] masterKey(ArrayBuffer)를 '추출 불가' CryptoKey로 변환하여
 * IndexedDB에 저장합니다.
 * @param masterKey - PBKDF2로 파생된 원본 ArrayBuffer
 */
export async function storeMasterKey(masterKey: ArrayBuffer): Promise<void> {
  try {
    // 1. ArrayBuffer를 '추출 불가(extractable: false)' CryptoKey 객체로 변환
    const cryptoKey = await crypto.subtle.importKey(
      "raw",         // 키 형식
      masterKey,     // 원본 키 데이터
      { name: "AES-GCM" }, // 이 키로 사용할 알고리즘 (예: 데이터 암호화용)
      false,         // ❗️ [핵심] 추출 불가로 설정 (XSS 방어)
      ["encrypt", "decrypt"] // 이 키의 용도
    );

    // 2. IndexedDB에 CryptoKey 객체 저장
    const db = await openKeyStoreDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
        const request = store.put(cryptoKey, KEY_ID);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });

    console.log("✅ MasterKey가 IndexedDB에 안전하게 저장되었습니다 (추출 불가).");

  } catch (error) {
    console.error("MasterKey 저장 실패:", error);
    throw new Error("키를 안전하게 저장하는 데 실패했습니다.");
  }
}

/**
 * [앱 부트스트랩용] IndexedDB에서 '추출 불가' CryptoKey를 불러옵니다.
 * @returns {Promise<CryptoKey | null>} - 저장된 CryptoKey 또는 null
 */
export async function getMasterKey(): Promise<CryptoKey | null> {
  try {
    const db = await openKeyStoreDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.get(KEY_ID);

    return await new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("MasterKey 불러오기 실패:", error);
    return null;
  }
}