"use client";

import { Button } from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import { AIRecommandItem } from "./components/AIRecommandItem";
import { useSelection } from "@/hooks/useSelection"; // useSelection 훅이 있다고 가정
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { useMemo, useState } from "react";
import { useRecommandList } from "./use-recommand-list";
import { AIRecommandResponse } from "@/api/where2meet";
import Loading from "./loading";
import { useAddPlaceDirect } from "../../add-place-direct/use-add-place-direct";

export default function AiSearchLoadingPage() {
  const searchParams = useSearchParams();
  
  // URL Params parsing
  const promiseId = searchParams.get("promiseId");
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lng"));
  const purpose = searchParams.get("purpose") ?? "카페/디저트";

  // 1. Data Fetching (AI Recommendation)
  const { recommandList, isPending } = useRecommandList(
    promiseId ?? "",
    latitude,
    longitude,
    purpose
  );

  // 2. Data Mutation (Reuse existing hook)
  const { mutate } = useAddPlaceDirect(promiseId);

  // State Management
  const { selectedItems, toggleItem } = useSelection(); // Returns Set<string | number>
  const [openEnroll, setOpenEnroll] = useState(false);

  // 3. Derived State: 실제 선택된 장소 객체 리스트 추출
  const selectedPlaces = useMemo(() => {
    if (!recommandList) return [];
    return recommandList.filter((place:AIRecommandResponse) => selectedItems.has(place.placeId));
  }, [recommandList, selectedItems]);

  // Handler: Toggle Selection with Validation (Max 5)
  const handleTogglePlace = (placeId: number) => {
    if (!selectedItems.has(placeId) && selectedItems.size >= 5) {
      alert("장소는 최대 5개까지 선택 가능합니다.");
      return;
    }
    toggleItem(placeId);
  };

  // Handler: Open Confirmation Dialog
  const handleAiRecommand = () => {
    setOpenEnroll(true);
  };

  // Handler: Execute Mutation (API Call)
  const handleConfirmRegistration = () => {
    if (!promiseId) return;

    // 4. Data Transformation (Mapping AI Response to DTO)
    const requestData = selectedPlaces.map((place:AIRecommandResponse) => ({
      placeName: place.placeName,
      placeAddress: place.placeAddress, // DTO 필드명에 맞게 매핑 (placeAddr -> placeAddress)
      placeInfo: place.placeInfo, // AI 추천 결과에 설명이 없다면 빈 문자열 처리
      aiPlaceId: place.placeId, // 요청하신 placeId 추가
      aiPlace: true, // 요청하신 isAiPlace=true (DTO 필드명이 aiPlace라면 이것 사용)
    }));

    // use-add-place-direct 훅의 mutate 실행
    // 성공 시 훅 내부의 onSuccess에서 페이지 이동 처리됨
    mutate(requestData); 
  };

  const labelClass =
    "flex gap-5 text-gray-2 text-base font-normal leading-loose";

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full flex-1 bg-white justify-between pb-5">
      <div className="flex flex-col gap-2 py-5">
        {(recommandList ?? []).map((place: AIRecommandResponse) => (
          <AIRecommandItem
            key={place.placeId}
            placeName={place.placeName}
            placeAddress={place.placeAddress}
            isChecked={selectedItems.has(place.placeId)}
            handleToggle={() => handleTogglePlace(place.placeId)}
          />
        ))}
      </div>
      
      <Button
        text={`장소 추가하기 (${selectedItems.size}/5)`}
        disabled={selectedItems.size === 0}
        onClick={handleAiRecommand}
      />

      <YesNoDialog
        isOpen={openEnroll}
        setIsOpen={setOpenEnroll}
        title={
          <div className="w-full flex flex-col items-center gap-8 pb-5">
            <div className="w-full flex flex-col items-start gap-4">
              <span className={labelClass}>
                선택한 장소
                <div className="flex flex-col gap-1 text-black-1">
                  {selectedPlaces.map((item:AIRecommandResponse) => (
                    <span key={item.placeId}> {item.placeName}</span>
                  ))}
                </div>
              </span>
            </div>
            <div className="w-full border-1 border-gray-3" />
            <p className="text-lg text-black-1 font-medium leading-tight">
              선택한 장소들을 게시판에 등록하시겠어요?
            </p>
          </div>
        }
        acceptedTitle={<div>장소를 성공적으로 등록했어요.</div>}
        rejectText={"취소"}
        acceptText={"등록"}
        extraHandleReject={() => {}}
        extraHandleAccept={handleConfirmRegistration}
      />
    </div>
  );
}