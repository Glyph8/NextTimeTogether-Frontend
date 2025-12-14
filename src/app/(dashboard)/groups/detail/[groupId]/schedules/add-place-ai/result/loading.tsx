"use client";

import Image from "next/image";
import LocationLoading from "@/assets/pngs/LocationLoading.png";

export default function Loading() {

  return (
    <div className="flex flex-col w-full flex-1 bg-white justify-between py-5">
      <div className="flex-1 flex flex-col pt-15 items-center">
        <Image src={LocationLoading} alt="지도 로딩" width={200}
        className={'animate-floating'}/>

        <p className="text-xl font-medium leading-loose">
          { "AI가 최적의 장소를 찾고 있어요..."}
        </p>
      </div>
      {/* <Button text={"장소 확인하기"} disabled={isSearching} onClick={handleAiRecommand} /> */}
    </div>
  );
}
