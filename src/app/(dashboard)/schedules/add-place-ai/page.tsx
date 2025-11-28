"use client";

import { Button } from "@/components/ui/button/Button";
import Search from "@/assets/svgs/icons/search.svg";
import { RecommandItem } from "./components/RecommandItem";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

export interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string; // 경도
  y: string; // 위도
  phone: string;
  place_url: string;
  category_group_code?: string;
  category_group_name?: string;
  category_name?: string;
  distance?: string;
}

export default function AddPlaceAIPage() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null); // 선택된 장소 상태 추가

  const debouncedText = useDebounce(searchText, 300);

  const { data } = useQuery<{ documents: KakaoPlace[] }>({
    queryKey: ["search", debouncedText],
    queryFn: async () => {
      if (!debouncedText) return { documents: [] };
      const res = await fetch(`/api/search?query=${debouncedText}`);
      return res.json();
    },
    enabled: debouncedText.length > 0,
  });

  const handleSelectPlace = (place: KakaoPlace) => {
    setSelectedPlace(place);
    console.log("선택된 좌표:", place.y, place.x); // 위도, 경도 확인
  };

  const handleAiRecommand = () => {
    if (!selectedPlace) return;

    // 선택된 장소의 정보를 쿼리 파라미터나 전역 상태로 넘김
    // 예: /loading?lat=...&lng=...
    const queryParams = new URLSearchParams({
      lat: selectedPlace.y,
      lng: selectedPlace.x,
      placeName: selectedPlace.place_name,
    }).toString();

    router.push(`/schedules/add-place-ai/loading?${queryParams}`);
  };

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
            className="placeholder:text-gray-2 w-full outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {searchText !== "" && data?.documents && (
          <div className="flex flex-col gap-4 rounded-4xl border border-main p-5 mt-2.5 max-h-[300px] overflow-y-auto">
            {data.documents.map((place: KakaoPlace) => (
              <div 
                key={place.id} 
                onClick={() => handleSelectPlace(place)} // 클릭 시 선택
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  selectedPlace?.id === place.id ? "bg-main/10 border border-main" : "hover:bg-gray-100"
                }`} // 선택된 항목 시각적 피드백
              >
                <RecommandItem
                  searchText={searchText}
                  placeName={place.place_name}
                  placeAddress={place.address_name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Button
        text={"AI 추천 받기"}
        disabled={!selectedPlace}
        onClick={handleAiRecommand}
      />
    </div>
  );
}
