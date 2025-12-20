"use client";

import toast from "react-hot-toast";

import { Button } from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import { AIRecommandItem } from "./components/AIRecommandItem";
import { useSelection } from "@/hooks/useSelection";
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { useMemo, useState } from "react";
import { useRecommandList } from "./use-recommand-list";
import { AIRecommandResponse } from "@/api/where2meet";
import Loading from "./loading";
import { useAddPlaceDirect } from "../../add-place-direct/use-add-place-direct";

export default function AiSearchLoadingPage() {
  const searchParams = useSearchParams();

  const promiseId = searchParams.get("promiseId");
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lng"));
  const purpose = searchParams.get("purpose") ?? "카페/디저트";

  const { recommandList, isPending } = useRecommandList(
    promiseId ?? "",
    latitude,
    longitude,
    purpose
  );

  const { mutate, isPending: isAddPending } = useAddPlaceDirect(promiseId);

  const { selectedItems, toggleItem } = useSelection();
  const [openEnroll, setOpenEnroll] = useState(false);

  const selectedPlaces = useMemo(() => {
    if (!recommandList) return [];
    return recommandList.filter((place: AIRecommandResponse) => selectedItems.has(place.placeId));
  }, [recommandList, selectedItems]);

  const handleTogglePlace = (placeId: number) => {
    if (!selectedItems.has(placeId) && selectedItems.size >= 5) {
      toast.error("장소는 최대 5개까지 선택 가능합니다.");
      return;
    }
    toggleItem(placeId);
  };

  const handleAiRecommand = () => {
    setOpenEnroll(true);
  };

  const handleConfirmRegistration = () => {
    if (!promiseId) return;

    const requestData = selectedPlaces.map((place: AIRecommandResponse) => ({
      placeName: place.placeName,
      placeAddress: place.placeAddress,
      placeInfo: place.placeInfo,
      aiPlaceId: place.placeId,
      aiPlace: true,
    }));

    mutate(requestData);
  };

  const labelClass =
    "flex gap-5 text-gray-2 text-base font-normal leading-loose";

  if (isPending || isAddPending) {
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
                  {selectedPlaces.map((item: AIRecommandResponse) => (
                    <span key={item.placeId}> {item.placeName}</span>
                  ))}
                </div>
              </span>
            </div>
            <div className="w-full border-1 border-gray-3" />
            <p className="text-lg text-black-1 font-medium leading-tight">
              선택한 장소들을 등록하시겠어요?
            </p>
          </div>
        }
        acceptedTitle={<div>장소를 성공적으로 등록했어요.</div>}
        rejectText={"취소"}
        acceptText={"등록"}
        extraHandleReject={() => { }}
        extraHandleAccept={handleConfirmRegistration}
      />
    </div>
  );
}