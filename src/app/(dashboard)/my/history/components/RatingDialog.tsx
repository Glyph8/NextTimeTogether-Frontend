import { getScheduleDetail, ratePlace } from "@/api/appointment";
import { parseScheduleString } from "@/app/(dashboard)/appointment/[scheduleId]/detail/utils/formatter";
import { Button } from "@/components/ui/button/Button";
import ArrowDown from "@/assets/svgs/icons/arrow-down-gray.svg";
import ArrowUp from "@/assets/svgs/icons/arrow-up-gray.svg";
import FullStar from "@/assets/svgs/fullfilled-star.svg";
import HalfStar from "@/assets/svgs/halffilled-star.svg";
import EmptyStar from "@/assets/svgs/empty-star.svg";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import { StarRatingInput } from "./StarRatingInput";

interface RatingDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleId: string;
}

export const RatingDialog = ({
  isOpen,
  setIsOpen,
  scheduleId,
}: RatingDialogProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const userId = useAuthStore.getState().userId;
  const { data: scheduleDetail, isPending } = useQuery({
    queryKey: ["scheduleDetail", scheduleId],
    queryFn: async () => {
      const scheduleData = await getScheduleDetail(scheduleId);

      let decryptedUserIds: string[] = [];
      decryptedUserIds = scheduleData.encUserIds.map(
        (_id, index) => `익명 ${index + 1}`
      );
      return { scheduleData, userIds: decryptedUserIds };
    },
  });

  const [rating, setRating] = useState<number>(0);

  const handleRatingSubmit = () => {
    const data = {
      pseudoId: userId || "",
      rating: rating,
    };
    if (rating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }
    ratePlace(Number(scheduleDetail?.scheduleData.placeName), data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle hidden>상세 일정</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="w-full p-5 bg-[#E9E9EB]"
      >
        {isPending || !scheduleDetail ? (
          <DefaultLoading />
        ) : (
          <div className="flex flex-col w-full items-center gap-1">
            <h1 className="text-center text-lg text-black-1 font-medium leading-tight mb-4">
              {scheduleDetail.scheduleData.title} 약속에서 방문한 <br></br>
              <span className="text-main text-lg">
                {scheduleDetail.scheduleData.placeName}
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
          </div>
        )}
        {showDetails && scheduleDetail && (
          <div className="flex flex-col justify-center items-start gap-3 overflow-auto no-scrollbar">
            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                제목
              </span>
              <span className="text-black-1 text-base font-medium leading-loose">
                {scheduleDetail.scheduleData.title}
              </span>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                목적
              </span>
              <div className="px-1 py-0.5 w-12 bg-indigo-600/10 rounded-lg inline-flex text-center justify-center items-center text-indigo-600 text-sm font-medium leading-none">
                {scheduleDetail.scheduleData.type ?? "약속"}
              </div>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                일시
              </span>
              <span className="text-black-1 text-base font-normal leading-loose">
                {
                  parseScheduleString(scheduleDetail.scheduleData.scheduleId)
                    .date
                }{" "}
                <br />
                {
                  parseScheduleString(scheduleDetail.scheduleData.scheduleId)
                    .time
                }
              </span>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                장소
              </span>
              <span className="text-black-1 text-base font-normal  leading-loose">
                {scheduleDetail.scheduleData.placeName}
              </span>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-loose">
                그룹
              </span>
              <span className="text-black-1 text-base font-normal  leading-loose">
                {scheduleDetail.scheduleData.groupName}
              </span>
            </span>

            <span className="flex gap-5">
              <span className="text-gray-2 text-base font-normal leading-5 whitespace-nowrap">
                참여
                <br />
                인원
              </span>
              <span className="text-black-1 text-base font-normal  leading-loose overflow-scroll no-scrollbar">
                {scheduleDetail.userIds.map((member) => member).join(", ")}
              </span>
            </span>
          </div>
        )}

        <DialogFooter>
          <Button
            text={"확인"}
            disabled={rating === 0}
            onClick={handleRatingSubmit}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
