import React from 'react'

export default function DefaultLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">

      <div role="status" aria-label="로딩 중" className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-main/30 opacity-75"></div>
        
        <div className="relative h-8 w-8 rounded-full bg-main shadow-lg shadow-main/40"></div>
      </div>

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
