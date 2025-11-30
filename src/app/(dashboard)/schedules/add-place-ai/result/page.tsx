"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { dummyAISearchResult } from "../../constants";
import { AIRecommandItem } from "./components/AIRecommandItem";
import { useSelection } from "@/hooks/useSelection";
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { useMemo, useState } from "react";
import { useRecommandList } from "./use-recommand-list";
import { AIRecommandResponse } from "@/api/where2meet";

export default function AiSearchLoadingPage() {
    const router = useRouter();
  /** id:number로 선택 관리함. */
  const { selectedItems, toggleItem } = useSelection();
  const [openEnroll, setOpenEnroll] = useState(false);
  const selectedPlaces = useMemo(() => {
    return dummyAISearchResult.filter((place) => selectedItems.has(place.id));
  }, [dummyAISearchResult, selectedItems]);

  const promiseId = 'cf41e9f8-bd3b-424c-a856-e8deff2d2cb3';
  const pseudoId  = "123";

  
  const latitude  = 123;
  const longitude = 123;

  const {
    recommandList,
    isPending,
    error,} = useRecommandList(promiseId, pseudoId, latitude, longitude)

  const handleAiRecommand = () => {
    setOpenEnroll((prev) => !prev);
  };
  const handleReturnToBoard = () => {
    router.push("/schedules/detail");
  };

  const labelClass =
    "flex gap-5 text-gray-2 text-base font-normal leading-loose";

  return (
    <div className="flex flex-col w-full flex-1 bg-white justify-between pb-5">
      <div className="flex flex-col gap-2 py-3">
        {recommandList.map((place:AIRecommandResponse) => (
          <AIRecommandItem
            placeName={place.placeName}
            placeAddress={place.placeAddr}
            key={place.placeId}
            isChecked={selectedItems.has(place.placeId)}
            handleToggle={() => toggleItem(place.placeId)}
          />
        ))}
      </div>
      <Button
        text={"장소 추가하기"}
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
                장소명
                <ul className="text-black-1">
                  {selectedPlaces.map((item) => {
                    return <li key={item.id}>{item.placeName}</li>;
                  })}
                </ul>
              </span>
            </div>
            <div className="w-full border-1 border-gray-3" />
            <p className="text-lg text-black-1 font-medium leading-tight">
              장소를 등록하시겠어요?
            </p>
          </div>
        }
        acceptedTitle={<div>장소를 성공적으로 등록했어요.</div>}
        rejectText={"취소"}
        acceptText={"등록"}
        extraHandleReject={() => {}}
        extraHandleAccept={handleReturnToBoard}
      />
    </div>
  );
}
