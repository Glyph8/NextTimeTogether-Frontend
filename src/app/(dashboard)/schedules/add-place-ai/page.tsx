"use client";

import { Button } from "@/components/ui/button/Button";
import Search from "@/assets/svgs/icons/search.svg";
import { dummySearchResult } from "../constants";
import { RecommandItem } from "./components/RecommandItem";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPlaceAIPage() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const handleAiRecommand = () =>{
    router.push("/schedules/add-place-ai/loading")
  }

  return (
    <div className="flex flex-col w-full flex-1 bg-white justify-between py-5">
      <div>
        <div className="pt-2 pb-5 text-black-1 text-xl font-medium leading-8">
          <p>어느 장소 근처로</p>
          <p>추천받을까요?</p>
        </div>
        <div
          className="group flex gap-3 border border-gray-2 rounded-4xl px-2 py-1.5 text-black-1 text-base font-medium leading-tight
        focus-within:border-main transition-colors"
        >
          <Search className="group-focus-within:text-main text-gray-2 transition-colors" />
          <input
            placeholder="장소를 검색해보세요."
            className="placeholder:text-gray-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {searchText !== "" && (
          <div className="flex flex-col gap-4 rounded-4xl border border-main p-5 mt-2.5">
            {dummySearchResult.map((result) => {
              return (
                <RecommandItem
                  key={result.placeName}
                  searchText={searchText}
                  placeName={result.placeName}
                  placeAddress={result.placeAddress}
                />
              );
            })}
          </div>
        )}
      </div>
      {/* 추후 장소 선택 완료 state 추가하여 disabled 관리 */}
      <Button text={"AI 추천 받기"} disabled={false} onClick={handleAiRecommand} />
    </div>
  );
}
