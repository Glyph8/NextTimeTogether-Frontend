import React, { useState, useRef, MouseEvent } from "react";
import FullStar from "@/assets/svgs/fullfilled-star.svg";
import HalfStar from "@/assets/svgs/halfcilled-star.svg";
import EmptyStar from "@/assets/svgs/empty-star.svg";

interface StarRatingInputProps {
  value: number; // 부모로부터 받는 현재 점수
  onChange: (value: number) => void; // 점수 변경 시 실행할 부모 함수
  maxStars?: number; // 확장성을 위한 prop (기본값 5)
}

export const StarRatingInput = ({
  value,
  onChange,
  maxStars = 5,
}: StarRatingInputProps) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 0.5점 단위 계산 로직
  const calculateScore = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return 0;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const scale = width / maxStars;

    // 0.5 단위로 올림 처리 (예: 1.2 -> 1.5, 1.6 -> 2.0)
    const score = Math.ceil((x / scale) * 2) / 2;
    return Math.max(0, Math.min(maxStars, score));
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setHoverRating(calculateScore(e));
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const newRating = calculateScore(e);
    onChange(newRating); // 부모의 상태 변경 함수 호출
  };

  // 호버 중이면 호버 점수, 아니면 확정된 점수 표시
  const displayScore = hoverRating || value;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        className="flex items-center gap-1 cursor-pointer touch-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((index) => (
          <div key={index} className="w-8 h-8 pointer-events-none">
            {displayScore >= index ? (
              <FullStar width="100%" height="100%" />
            ) : displayScore >= index - 0.5 ? (
              <HalfStar width="100%" height="100%" />
            ) : (
              <EmptyStar width="100%" height="100%" />
            )}
          </div>
        ))}
      </div>
      <span className="text-main text-xl font-bold">
        {displayScore > 0 ? `${displayScore}점` : "평점을 입력해주세요"}
      </span>
    </div>
  );
};
