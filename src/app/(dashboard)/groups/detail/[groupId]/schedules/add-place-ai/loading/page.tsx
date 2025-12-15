"use client";

import { Button } from "@/components/ui/button/Button";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import LocationLoading from "@/assets/pngs/LocationLoading.png";
import { useState } from "react";

export default function AiSearchLoadingPage() {
  const router = useRouter();
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  const [isSearching, setIsSearching] = useState(true);
  const handleAiRecommand = () => {
    router.push(`/groups/detail/${groupId}/schedules/add-place-ai/result`)
  }

  return (
    <div className="flex flex-col w-full flex-1 bg-white justify-between py-5">
      <div className="flex-1 flex flex-col pt-15 items-center">
        <Image src={LocationLoading} alt="지도 로딩" width={200}
          className={`${isSearching && 'animate-floating'}`} />

        <p className="text-xl font-medium leading-loose">
          {isSearching ? "AI가 최적의 장소를 찾고 있어요..."
            : "AI가 장소 계산을 완료했어요!"}
        </p>
        <button className="rounded-full border-main border-1 p-2"
          onClick={() => setIsSearching(prev => !prev)}>임시 장소 확인 완료 버튼</button>
      </div>

      <Button text={"장소 확인하기"} disabled={isSearching} onClick={handleAiRecommand} />
    </div>
  );
}
