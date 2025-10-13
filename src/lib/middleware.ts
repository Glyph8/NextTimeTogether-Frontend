
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

// TODO : redis를 사용하지 않게 됨. 추후에도 안쓸 시 제거. 혹은 엑세스 토큰 갱신으로 변경

/** 세션 검증용 미들웨어 */
export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session-token')?.value;
  
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redis에서 세션 확인
  const session = await redis.hgetall(`session:${sessionToken}`);
  
  if (!session || Object.keys(session).length === 0) {
    // Redis에 세션 없음 = 만료됨
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session-token'); // 쿠키도 삭제
    return response;
  }
  
  // ✨ 활동 시 세션 연장 (선택사항)
  await redis.expire(`session:${sessionToken}`, 3600);
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/main/:path*', '/dashboard/:path*'], // 보호할 경로
};