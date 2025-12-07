"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEncryptedPromiseMemberId } from "@/api/promise-view-create";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

import { confirmPlace as confirmPlaceApi } from "@/api/where2meet";
import { PlaceConfirmItem } from "../detail/[promiseId]/components/PlaceConfirmItem";
import { usePlaceBoard } from "../detail/[promiseId]/hooks/use-place-board";
import { useConfirmSchedule } from "./use-confirm-schedule";

export interface ConfirmPlaceProps {
  placeId: number;
  aiPlaceId:number;
}

export default function ConfirmPlacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promiseId = searchParams.get("promiseId"); // 타입: string | null

  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const { confirmSchedule, isScheduleCreating } = useConfirmSchedule(promiseId || "");

  const { placeListInfo, isPending: isPlaceLoading } = usePlaceBoard(promiseId || "");

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
    mutationFn: async (placeId: number) => {
      if (!promiseId) throw new Error("약속 ID가 없습니다.");
      // aiPlaceId는 0 혹은 적절한 값 설정
      return await confirmPlaceApi(promiseId, placeId, 0); 
    },
    onSuccess: (response) => {
      // response 구조: { code: 200, result: { dateTime, title, ... } }
      console.log("📍 장소 확정 성공, 일정 생성 시작:", response);
      
      if (response.code === 200 && selectedPlaceId) {
        // [핵심] 장소 확정의 결과값을 그대로 일정 생성 훅으로 전달
        confirmSchedule({
            placeId: selectedPlaceId,
            serverResult: response.result
        });
      } else {
        alert("장소 확정 응답에 문제가 있습니다.");
      }
    },
    onError: (err) => {
      console.error(err);
      alert("장소 확정에 실패했습니다.");
    },
  });

  // // TODO : 시간 확정되었는지, 장소 확정되었는 지, 해당 데이터 요청하는 API 필요.
  // const { mutate: confirmPlace, isPending: isConfirming } = useMutation({
  //   mutationFn: async ({placeId, aiPlaceId}:ConfirmPlaceProps) => {
  //     // 가드 절: promiseId가 null이면 에러를 던져 타입 에러 방지
  //     if (!promiseId) throw new Error("약속 ID가 유효하지 않습니다.");
  //     // API 호출: (string, number) 순서 정확함
  //     return await confirmPlaceApi(promiseId, placeId, aiPlaceId);
  //   },
  //   onSuccess: () => {
  //     alert("장소가 확정되었습니다!");
  //     router.back();
  //   },
  //   onError: (err) => {
  //     console.error(err);
  //     alert("장소 확정에 실패했습니다.");
  //   },
  // });

  // const {confirm, isLoading:isLoading2} = useConfirmSchedule('PROMI-002');
//   const {confirm, isLoading:isLoading2} = useConfirmSchedule(promiseId ?? 'PROMI-002');
//   const handleConfirm = () => {
//     if (selectedPlaceId !== null) {
//       confirmPlace({
// placeId:selectedPlaceId,
//     });

//     confirm(selectedPlaceId)
//     }
//   };

  const handleConfirm = () => {
    if (selectedPlaceId !== null) {
      confirmPlace(selectedPlaceId);
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
          <button type="button" aria-label="뒤로가기" onClick={() => router.back()}>
            <LeftArrow />
          </button>
        }
        title="장소 확정하기"
        setShadow={false}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
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

        {/* <div className="w-full px-5 py-4 bg-white border-t border-gray-100 safe-area-bottom">
          <button
            onClick={handleConfirm}
            disabled={selectedPlaceId === null || isConfirming}
            className={`w-full rounded-[12px] py-4 text-white text-lg font-bold leading-tight text-center transition-colors
              ${
                selectedPlaceId !== null && !isConfirming
                  ? "bg-main hover:bg-main/90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {isConfirming ? "확정 중..." : "확정하기"}
          </button>
        </div> */}
        <div className="w-full px-5 py-4 bg-white border-t border-gray-100 safe-area-bottom">
          <button
            onClick={handleConfirm}
            disabled={selectedPlaceId === null || isProcessing}
            className={`w-full rounded-[12px] py-4 text-white text-lg font-bold leading-tight text-center transition-colors
              ${
                selectedPlaceId !== null && !isProcessing
                  ? "bg-main hover:bg-main/90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {isProcessing ? "확정 처리 중..." : "확정하기"}
          </button>
        </div>
      </div>
    </div>
  );
}