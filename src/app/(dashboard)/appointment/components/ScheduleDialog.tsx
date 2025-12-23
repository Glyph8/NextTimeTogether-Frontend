import React, { useMemo } from "react";
import { getScheduleDetail } from "@/api/appointment";
import { Button } from "@/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { parseScheduleString } from "../[scheduleId]/detail/utils/formatter";
import { useGroupDetail } from "../../groups/detail/[groupId]/hooks/use-group-detail";
import { ScheduleDetailSkeleton } from "@/components/ui/Loading/ScheduleDetailSkeleton";
import { usePromiseDecryptedMemberNames } from "@/hooks/useGetMembers";

interface ScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleId: string;
  groupId: string | null;
}

export const ScheduleDialog = ({
  isOpen,
  setIsOpen,
  scheduleId,
  groupId,
}: ScheduleDialogProps) => {
  // 1. 기본 일정 정보 조회 (가벼운 Fetching)
  // 여기서는 복호화를 하지 않고 원본 데이터만 빠르게 가져옵니다.
  const { data: scheduleBaseData, isPending: isScheduleBasePending } = useQuery({
    queryKey: ["scheduleDetail", "base", scheduleId],
    queryFn: () => getScheduleDetail(scheduleId),
    enabled: isOpen && !!scheduleId,
    staleTime: 1000 * 60 * 5,
  });

  // 2. 그룹 ID 확정
  // props로 받은 groupId가 없으면 fetch한 데이터에서 가져옵니다.
  const targetGroupId = groupId ?? scheduleBaseData?.groupId ?? null;

  // 3. 그룹 정보 조회 (targetGroupId가 확정된 후 실행)
  const { groupKey, isPending: isGroupPending } = useGroupDetail(targetGroupId);

  // 4. 참여자 이름 조회 (이미 존재하는 Hook 활용)
  // 복호화 로직을 이 훅에 위임하여, 상위 쿼리(1번)가 복잡해지는 것을 막습니다.
  const { data: realMemberNames, isLoading: isLoadingMemberNames } =
    usePromiseDecryptedMemberNames(
      scheduleBaseData?.encUserIds ?? [], // 없으면 빈 배열
      groupKey // useGroupDetail에서 가져온 키
    );
  // 5. 데이터 병합 (Presentation Logic)
  const displayData = useMemo(() => {
    if (!scheduleBaseData) return null;

    // 이름 표시 우선순위 로직
    const displayNames =
      realMemberNames && realMemberNames.length > 0
        ? realMemberNames
        : scheduleBaseData.encUserIds.map((_, i) => `익명${i + 1}`);

    return {
      ...scheduleBaseData,
      displayNames, // string[]
      parsedDate: parseScheduleString(scheduleBaseData.scheduleId),
    };
  }, [scheduleBaseData, realMemberNames]);

  // 로딩 상태 통합
  const isLoading =
    isScheduleBasePending ||
    (targetGroupId && isGroupPending) ||
    isLoadingMemberNames ||
    !displayData;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle hidden>
        {displayData ? displayData.title : "상세 일정"}
      </DialogTitle>

      <DialogContent
        showCloseButton={false}
        className="w-full p-5 bg-[#E9E9EB] max-w-sm rounded-xl"
        aria-describedby={undefined}
      >
        {isLoading ? (
          <ScheduleDetailSkeleton />
        ) : (
          <div className="flex flex-col justify-center items-start gap-3 overflow-auto no-scrollbar w-full">
            <DetailRow label="제목">
              <span className="font-medium text-black-1">
                {displayData.title}
              </span>
            </DetailRow>

            <DetailRow label="목적">
              <div className="px-2 py-0.5 bg-indigo-600/10 rounded-lg inline-flex justify-center items-center text-indigo-600 text-sm font-medium leading-none">
                {displayData.type ?? "약속"}
              </div>
            </DetailRow>

            <DetailRow label="일시">
              <span className="text-black-1">
                {displayData.parsedDate.date} <br />
                {displayData.parsedDate.time}
              </span>
            </DetailRow>

            <DetailRow label="장소">
              <span className="text-black-1">{displayData.placeName}</span>
            </DetailRow>

            <DetailRow label="그룹">
              <span className="text-black-1">{displayData.groupName}</span>
            </DetailRow>

            <DetailRow label="참여 인원">
              <span className="text-black-1 break-keep leading-relaxed">
                {/* 배열이면 join, 문자열이면 그대로 출력 */}
                {Array.isArray(displayData.displayNames)
                  ? displayData.displayNames.join(", ")
                  : displayData.displayNames}
              </span>
            </DetailRow>
          </div>
        )}

        <DialogFooter className="mt-4 sm:justify-center">
          <Button
            text="확인"
            disabled={isLoading}
            onClick={() => setIsOpen(false)}
            className="w-full"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ----------------------------------------------------------------------
// Helper Component: DetailRow
// 개선점: JS split 로직 대신 CSS flex-basis와 word-break를 활용하여 더 안전하게 처리
// ----------------------------------------------------------------------

const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex gap-4 w-full items-baseline">
      {/* w-16: 너비 고정
         shrink-0: 줄어들지 않음
         whitespace-pre-wrap: \n이 있다면 줄바꿈 허용 (혹은 필요시 <br> 사용 가능)
         break-keep: 단어 단위로 줄바꿈 (한글에 적합)
       */}
      <span className="text-gray-2 text-base font-normal leading-loose w-16 shrink-0 whitespace-pre-wrap break-keep text-left">
        {/* 화면상 "참여\n인원" 처럼 보이고 싶다면 
           label prop 자체를 "참여 인원"으로 넘기고 CSS로 처리하거나,
           특정 단어만 강제로 줄바꿈 하도록 아래처럼 처리합니다.
        */}
        {label === "참여 인원" ? (
          <>참여<br />인원</>
        ) : (
          label
        )}
      </span>
      <div className="flex-1 text-base font-normal leading-loose break-all">
        {children}
      </div>
    </div>
  );
};