"use client";

import { Button } from "@/components/ui/button/Button";
import Search from "@/assets/svgs/icons/search.svg";
import { RecommandItem } from "./components/RecommandItem";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

// 1. 카테고리 상수 데이터 분리 (유지보수성 및 타입 안정성)
const FOOD_CATEGORIES = [
  "한식",
  "중식",
  "일식",
  "양식",
  "기타 아시안",
  "카페/디저트",
  "술집/주점",
] as const;

// 2. 카테고리 타입 정의 (Type Safety)
type FoodCategory = (typeof FOOD_CATEGORIES)[number];

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
  const searchParams = useSearchParams();
  const promiseId = searchParams.get("promiseId");

  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  // 카테고리 선택 상태 추가
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);

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
    console.log("선택된 좌표:", place.y, place.x);
  };

  const handleAiRecommand = () => {
    // 4. 유효성 검사 강화 (장소 + 카테고리 + promiseId)
    if (!selectedPlace || !promiseId || !selectedCategory) {
      console.error("장소, 카테고리 또는 약속 ID가 없습니다.");
      return;
    }

    const queryParams = new URLSearchParams({
      lat: selectedPlace.y,
      lng: selectedPlace.x,
      placeName: selectedPlace.place_name,
      category: selectedCategory, // 5. 선택한 카테고리를 쿼리 파라미터로 전달
      promiseId: promiseId,
      purpose: selectedCategory,
    }).toString();

    router.push(`/schedules/add-place-ai/result?${queryParams}`);
  };

  return (
    <div className="flex flex-col w-full flex-1 bg-white justify-between py-5 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-1 hide-scrollbar">
        <div className="pt-2 pb-5 text-black-1 text-xl font-medium leading-8">
          <p>어느 장소 근처로</p>
          <p>추천받을까요?</p>
        </div>
        
        <div className="group flex gap-3 border border-gray-2 rounded-4xl px-2 py-1.5 text-black-1 text-base font-medium leading-tight focus-within:border-main transition-colors">
          <Search className="group-focus-within:text-main text-gray-2 transition-colors" />
          <input
            placeholder="장소를 검색해보세요."
            className="placeholder:text-gray-2 w-full outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {searchText !== "" && data?.documents && (
          <div className="flex flex-col gap-4 rounded-4xl border border-main p-5 mt-2.5 max-h-[200px] overflow-y-auto">
            {data.documents.map((place: KakaoPlace) => (
              <div
                key={place.id}
                onClick={() => handleSelectPlace(place)}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  selectedPlace?.id === place.id
                    ? "bg-main/10 border border-main"
                    : "hover:bg-gray-100"
                }`}
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

        <div className="mt-8">
           <div className="mb-3 text-black-1 text-lg font-medium">
            <p>어떤 종류를 원하시나요?</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FOOD_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedCategory === category
                    ? "bg-main text-white border-main shadow-md"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center pt-4">
        <Button
          text={"AI 추천 받기"}
          disabled={!selectedPlace || !selectedCategory}
          onClick={handleAiRecommand}
        />
      </div>
    </div>
  );
}