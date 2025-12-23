import { getScheduleDetail, ratePlace } from "@/api/appointment";
import { parseScheduleString } from "@/app/(dashboard)/appointment/[scheduleId]/detail/utils/formatter";
import { Button } from "@/components/ui/button/Button";
import ArrowDown from "@/assets/svgs/icons/arrow-down-gray.svg";
import ArrowUp from "@/assets/svgs/icons/arrow-up-gray.svg";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import { StarRatingInput } from "./StarRatingInput";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { useGroupDetail } from "@/app/(dashboard)/groups/detail/[groupId]/hooks/use-group-detail";
import { usePromiseDecryptedMemberNames } from "@/hooks/useGetMembers";
import { ScheduleDetailSkeleton } from "@/components/ui/Loading/ScheduleDetailSkeleton";

interface RatingDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleId: string;
  isRated?: boolean;
  onRateSuccess?: () => void;
}

export const RatingDialog = ({
  isOpen,
  setIsOpen,
  scheduleId,
  isRated,
  onRateSuccess,
}: RatingDialogProps) => {
  const [showDetails, setShowDetails] = useState(false);
  // const userId = useAuthStore.getState().userId;
  const userId = localStorage.getItem("hashed_user_id_for_manager");
  const { data: scheduleDetail, isPending } = useQuery({
    queryKey: ["scheduleDetail", scheduleId],
    queryFn: async () => {
      const scheduleData = await getScheduleDetail(scheduleId);

      let decryptedUserIds: string[] = [];
      decryptedUserIds = scheduleData.encUserIds.map(
        (_id, index) => `익명 ${index + 1}`
      );
      return scheduleData;
    },
  });

  const { groupKey, isPending: isGroupPending } = useGroupDetail(scheduleDetail?.groupId || '');

  const { data: realMemberNames, isLoading: isLoadingMemberNames } =
    usePromiseDecryptedMemberNames(
      scheduleDetail?.encUserIds ?? [], // 없으면 빈 배열
      groupKey // useGroupDetail에서 가져온 키
    );
  // 5. 데이터 병합 (Presentation Logic)
  const displayData = useMemo(() => {
    if (!scheduleDetail) return null;

    // 이름 표시 우선순위 로직
    const displayNames =
      realMemberNames && realMemberNames.length > 0
        ? realMemberNames
        : scheduleDetail.encUserIds.map((_, i) => `익명${i + 1}`);

    return {
      ...scheduleDetail,
      displayNames, // string[]
      parsedDate: parseScheduleString(scheduleDetail.scheduleId),
    };
  }, [scheduleDetail, realMemberNames]);

  const [rating, setRating] = useState<number>(0);

  const isLoading =
    isPending ||
    isGroupPending ||
    isLoadingMemberNames ||
    !displayData;

  const handleRatingSubmit = async () => {
    const masterKey = await getMasterKey();
    if (!userId || !masterKey) return;
    const data = {
      pseudoId: await encryptDataClient(userId, masterKey, "psudo_id") || "",
      rating: rating,
    };
    if (rating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }
    ratePlace(Number(scheduleDetail?.placeId), data)
      .then(() => {
        toast.success("별점이 성공적으로 제출되었습니다.");
        setIsOpen(false);
        if (onRateSuccess) onRateSuccess();
      })
      .catch(() => {
        toast.error("별점 제출에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle hidden>상세 일정</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="w-full p-5 bg-[#E9E9EB]"
      >
        {isPending || !scheduleDetail || !displayData ? (
          <ScheduleDetailSkeleton />
        ) : (
          <div className="flex flex-col w-full items-center gap-1">
            {!isRated ? (
              <>
                <h1 className="text-center text-lg text-black-1 font-medium leading-tight mb-4">
                  {scheduleDetail.title} 약속에서 방문한 <br></br>
                  <span className="text-main text-lg">
                    {scheduleDetail.placeName}
                  </span>
                  은(는) 만족스러우셨나요?
                </h1>

                <p className="text-center text-base text-gray-2">
                  별점을 남기면 AI가 더 나은 장소를 추천하는데 활용돼요.
                </p>

                <div className="my-6">
                  <StarRatingInput value={rating} onChange={setRating} />
                </div>

                <button
                  className="flex py-5"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  약속 자세히 보기
                  {showDetails ? <ArrowUp /> : <ArrowDown />}
                </button>
              </>
            ) : (
              <h1 className="text-center text-lg text-black-1 font-medium leading-tight mb-4">
                이미 평가가 완료된 약속입니다.
              </h1>
            )}
          </div>
        )}
        {(showDetails || isRated) && scheduleDetail && displayData && (
          <div className="flex flex-col justify-center items-start gap-3 overflow-auto no-scrollbar">
            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                제목
              </span>
              <span className="text-black-1 text-base font-medium leading-loose">
                {scheduleDetail.title}
              </span>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                목적
              </span>
              <div className="px-1 py-0.5 w-12 bg-indigo-600/10 rounded-lg inline-flex text-center justify-center items-center text-indigo-600 text-sm font-medium leading-none">
                {scheduleDetail.type ?? "약속"}
              </div>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                일시
              </span>
              <span className="text-black-1 text-base font-normal leading-loose">
                {
                  parseScheduleString(scheduleDetail.scheduleId)
                    .date
                }{" "}
                <br />
                {
                  parseScheduleString(scheduleDetail.scheduleId)
                    .time
                }
              </span>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                장소
              </span>
              <span className="text-black-1 text-base font-normal  leading-loose">
                {scheduleDetail.placeName}
              </span>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                그룹
              </span>
              <span className="text-black-1 text-base font-normal  leading-loose">
                {scheduleDetail.groupName}
              </span>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-5 whitespace-nowrap">
                참여
                <br />
                인원
              </span>
              <span className="text-black-1 text-base font-normal  leading-loose overflow-scroll no-scrollbar">
                {/* {scheduleDetail.userIds.map((member) => member).join(", ")} */}
                {Array.isArray(displayData.displayNames)
                  ? displayData.displayNames.join(", ")
                  : displayData.displayNames}
              </span>
            </span>
          </div>
        )}

        <DialogFooter>
          {!isRated ? (
            <Button
              text={"확인"}
              disabled={rating === 0}
              onClick={handleRatingSubmit}
            />
          ) : (
            <Button text={"닫기"} onClick={() => setIsOpen(false)} />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
