function getDecodedTokenFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const encodedToken = urlObj.searchParams.get("token");
    if (!encodedToken) {
      console.error("❌ token 파라미터가 존재하지 않습니다.");
      return null;
    }

    const decoded = decodeURIComponent(encodedToken);
    return decoded;
  } catch (e) {
    console.error("❌ URL 파싱 오류:", e);
    return null;
  }
}

export default getDecodedTokenFromUrl;

// // 예시 실행
// const testUrl = "http://localhost:8080/group/join?token=groupKey123%26group42%26uuid-1234";

// const decoded = getDecodedTokenFromUrl(testUrl);
// if (decoded) {
//   console.log("🔓 디코딩된 token:", decoded);
// }
