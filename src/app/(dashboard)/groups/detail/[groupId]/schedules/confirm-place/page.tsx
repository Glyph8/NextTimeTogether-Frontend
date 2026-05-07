"use client";

import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEncryptedPromiseMemberId } from "@/api/promise-view-create";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

import {
  confirmPlace as confirmPlaceApi,
  PlaceBoardItem,
} from "@/api/where2meet";
import { PlaceConfirmItem } from "../detail/[promiseId]/components/PlaceConfirmItem";
import { usePlaceBoard } from "../detail/[promiseId]/hooks/use-place-board";
import { useConfirmSchedule } from "./use-confirm-schedule";

export interface ConfirmPlaceProps {
  placeId: number;
  aiPlaceId: number;
}

export default function ConfirmPlacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promiseId = searchParams.get("promiseId"); // 타입: string | null
  const groupId = searchParams.get("groupId");

  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  // TODO :현재 성성 직후에는 groupId가 없으므로 생성 시에도 전달할 수 있도록..
  const { confirmSchedule, isScheduleCreating } = useConfirmSchedule(
    promiseId || "",
    groupId || ""
  );

  const { placeListInfo, isPending: isPlaceLoading } = usePlaceBoard(
    promiseId || ""
  );

  const { data: encPromiseMemberList, isPending: isMemberLoading } = useQuery({
    queryKey: ["promiseId", "encPromiseIds", promiseId],
    queryFn: async () => {
      if (!promiseId) return null;
      const result = await getEncryptedPromiseMemberId(promiseId);
      return result || null;
    },
    enabled: !!promiseId,
  });

  const { mutate: confirmPlace, isPending: isPlaceConfirming } = useMutation({
    // mutationFn: async (placeId: number) => {
    mutationFn: async (placeInfo: PlaceBoardItem) => {
      if (!promiseId) throw new Error("약속 ID가 없습니다.");
      if (placeInfo.aiPlace === 0) {
        return await confirmPlaceApi(promiseId, placeInfo.id);
      }
      return await confirmPlaceApi(promiseId, placeInfo.id, placeInfo.aiPlace);
    },
    onSuccess: (response) => {
      // response 구조: { code: 200, result: { dateTime, title, ... } }
      console.log("📍 장소 확정 성공, 일정 생성 시작:", response);

      if (response.code === 200 && response.result.placeId) {
        confirmSchedule({
          // placeId: selectedPlaceId,
          placeId: response.result.placeId,
          serverResult: response.result,
        });
      } else {
        toast.error("장소 확정 응답에 문제가 있습니다.");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("장소 확정에 실패했습니다.");
    },
  });

  const handleConfirm = () => {
    if (selectedPlaceId === null || !placeListInfo) return;

    const selectedPlaceObj = placeListInfo.places.find(
      (place) => place.id === selectedPlaceId
    );

    if (selectedPlaceObj) {
      confirmPlace(selectedPlaceObj);
    } else {
      toast.error("선택된 장소 정보를 찾을 수 없습니다.");
    }
  };

  const isLoading = isPlaceLoading || isMemberLoading;
  const isProcessing = isPlaceConfirming || isScheduleCreating;
  const totalMemberCount = encPromiseMemberList?.userIds.length || 0;

  // 잘못된 접근 차단
  if (!promiseId) return <div>잘못된 접근입니다.</div>;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header
        leftChild={
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => router.back()}
          >
            <LeftArrow />
          </button>
        }
        title="장소 확정하기"
        setShadow={false}
      />

      <div className="w-full flex flex-col flex-1 overflow-hidden">
        <div className="px-5 py-2 bg-white">
          <h2 className="text-black-1 text-xl font-semibold leading-tight mt-4 mb-6 whitespace-pre-line">
            확정할 장소를{"\n"}선택해주세요.
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
          {isLoading ? (
            <DefaultLoading />
          ) : (
            <div className="flex flex-col gap-3">
              {placeListInfo?.places.map((place) => (
                <PlaceConfirmItem
                  key={place.id}
                  placeInfo={place}
                  totalMemberCount={totalMemberCount}
                  isSelected={selectedPlaceId === place.id}
                  onSelect={setSelectedPlaceId}
                />
              ))}
              {placeListInfo?.places.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  후보 장소가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-full flex justify-center items-center px-5 py-4 bg-white border-t border-gray-100 safe-area-bottom">
          <button
            onClick={handleConfirm}
            disabled={selectedPlaceId === null || isProcessing}
            // 1. flex와 justify-center, items-center를 유지합니다.
            // 2. 혹시 모를 상황을 대비해 text-center를 추가합니다.
            // 3. [중요] 템플릿 리터럴 내 줄바꿈을 없애 클래스명 끊김을 방지했습니다.
            className={`w-full flex justify-center items-center text-center rounded-[12px] py-4 text-lg font-bold leading-tight transition-colors ${
              selectedPlaceId !== null && !isProcessing
                ? "bg-main hover:bg-main/90 text-white"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            {isProcessing ? "확정 처리 중..." : "확정하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
