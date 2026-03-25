import React from 'react';

// Props 인터페이스 정의: 확장성을 위해 className도 받도록 설정
interface DefaultLoadingProps {
  isFullScreen?: boolean; // 전체 화면 모드 여부
  className?: string;     // 추가 스타일링을 위한 prop
}

export default function DefaultLoading({
  isFullScreen = true, // 기본값은 기존처럼 전체 화면으로 유지 (하위 호환성)
  className = ''
}: DefaultLoadingProps) {

  // 상황에 따른 포지셔닝 클래스 결정
  const positionClass = isFullScreen
    ? 'fixed inset-0 z-50 backdrop-blur-sm'  // 전체 화면: 뷰포트 기준 고정, 블러 효과
    : 'absolute inset-0 z-10';               // 부분 화면: 부모 기준 꽉 채움

  return (
    <div
      className={`
        flex flex-col items-center justify-center bg-white/80 
        ${positionClass} 
        ${className}
      `}
    >
      <div role="status" aria-label="로딩 중" className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-main/30 opacity-75"></div>
        <div className="relative h-8 w-8 rounded-full bg-main shadow-lg shadow-main/40"></div>
      </div>

      {/* 작은 영역에서는 텍스트가 방해될 수 있으므로, 필요하다면 isFullScreen일 때만 보이게 처리할 수도 있습니다. */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold text-black-1 animate-pulse">
          Loading...
        </h3>
        <p className="text-sm text-gray-2 font-medium min-h-[20px] transition-all duration-300">
          잠시만 기다려주세요.
        </p>
      </div>
    </div>
  )
}