import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json({ documents: [] });
  }
console.log("현재 사용 중인 API KEY:", process.env.KAKAO_REST_API_KEY);
  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;
    
    const res = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });
if (!res.ok) {
      // 에러의 구체적인 내용을 보기 위해 status와 statusText를 같이 로그에 남김
      console.error(`카카오 API 호출 실패: ${res.status} ${res.statusText}`);
      throw new Error(`Kakao API Error: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" }, 
      { status: 500 }
    );
  }
}