import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/server/validateAccessToken";

const KAKAO_API_KEY = process.env.KAKAO_REST_API_KEY;

/**
 * 카카오 장소 검색 프록시.
 * 카카오 REST API 키를 클라이언트에 노출하지 않기 위해 BFF 가 대신 호출한다.
 * 인증되지 않은 사용자가 호출해 카카오 API 쿼터를 어뷰즈하는 것을 막기 위해
 * 모든 요청에 유효한 AccessToken 을 요구한다.
 */
export async function GET(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized or invalid token" },
      { status: 401 }
    );
  }

  if (!KAKAO_API_KEY) {
    console.error("[/api/search] KAKAO_REST_API_KEY 가 설정되어 있지 않습니다.");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ documents: [] });
  }

  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    });

    if (!res.ok) {
      console.error(
        `[/api/search] 카카오 API 호출 실패: ${res.status} ${res.statusText}`
      );
      return NextResponse.json(
        { error: "Upstream API error" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/search] 처리 중 에러:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
