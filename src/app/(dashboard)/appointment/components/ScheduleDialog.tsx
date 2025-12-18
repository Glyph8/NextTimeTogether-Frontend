import { getScheduleDetail } from "@/api/appointment";
import { Button } from "@/components/ui/button/Button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { useQuery } from "@tanstack/react-query";
import { parseScheduleString } from "../[scheduleId]/detail/utils/formatter";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { getPromiseMemberDetail } from "@/api/promise-view-create";
import { useGroupDetail } from "../../groups/detail/[groupId]/hooks/use-group-detail";

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
  const { data: scheduleBaseData, isPending: isScheduleBasePending } = useQuery(
    {
      queryKey: ["scheduleDetail", "base", scheduleId],
      queryFn: () => getScheduleDetail(scheduleId),
      enabled: isOpen, // 다이얼로그가 열릴 때만 fetch
    }
  );

  // 2. props의 groupId가 있으면 그걸 쓰고, 없으면 fetch한 데이터에서 가져옵니다.
  const targetGroupId = groupId ?? scheduleBaseData?.groupId ?? null;

  // 3. 결정된 targetGroupId로 그룹 정보를 가져옵니다.
  // targetGroupId가 null이면 이 훅 내부에서 처리가 되거나, 내부 쿼리가 enabled: false 되어야 합니다.
  const { groupKey, isPending: isGroupPending } = useGroupDetail(targetGroupId);

  // 4. groupKey와 scheduleBaseData가 모두 준비되었을 때 복호화 및 상세 정보를 가져옵니다.
  const { data: finalScheduleDetail, isPending: isDecryptionPending } =
    useQuery({
      queryKey: ["scheduleDetail", "decrypted", scheduleId, targetGroupId],
      // groupKey와 baseData가 모두 있어야 실행됨
      enabled: !!scheduleBaseData && (!!groupKey || !targetGroupId),
      queryFn: async () => {
        if (!scheduleBaseData) return null;

        // let decryptedUserIds: string[] = [];

        return {
          scheduleData: scheduleBaseData,
          userIds: scheduleBaseData.encUserIds.map(
            (_, index) => `익명${index + 1}`
          ),
        };

        // 그룹 ID가 없는 경우 처리
        //   if (!targetGroupId) {
        //     return {
        //       scheduleData: scheduleBaseData,
        //       userIds: scheduleBaseData.encUserIds.map(
        //         (_, index) => `익명${index + 1}`
        //       ),
        //     };
        //   }
        //   const userIds = await Promise.all(
        //     scheduleBaseData.encUserIds.map(async (id) => {
        //       return await decryptDataWithCryptoKey(
        //         id,
        //         groupKey ?? "",
        //         "group_sharekey"
        //       );
        //     })
        //   );
        //   // 멤버 상세 정보 조회
        //   const sdecryptedUserIds = await getPromiseMemberDetail(scheduleId, {
        //     userIds: userIds,
        //   });
        //   decryptedUserIds = sdecryptedUserIds.users.map(
        //     (member) => member.userName
        //   );
        //   return { scheduleData: scheduleBaseData, userIds: decryptedUserIds };
      },
    });

  // 전체 로딩 상태 관리
  const isLoading =
    isScheduleBasePending ||
    (targetGroupId && isGroupPending) ||
    isDecryptionPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle hidden>상세 일정</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="w-full p-5 bg-[#E9E9EB]"
      >
        {isLoading ? (
          <DefaultLoading />
        ) : (
          finalScheduleDetail && (
            <div className="flex flex-col justify-center items-start gap-3 overflow-auto no-scrollbar">
              <span className="flex gap-5">
                <span className="text-gray-2 text-base font-normal leading-loose">
                  제목
                </span>
                <span className="text-black-1 text-base font-medium leading-loose">
                  {finalScheduleDetail.scheduleData.title}
                </span>
              </span>

              <span className="flex gap-5">
                <span className="text-gray-2 text-base font-normal leading-loose">
                  목적
                </span>
                <div className="px-1 py-0.5 w-12 bg-indigo-600/10 rounded-lg inline-flex text-center justify-center items-center text-indigo-600 text-sm font-medium leading-none">
                  {finalScheduleDetail.scheduleData.type ?? "약속"}
                </div>
              </span>

              <span className="flex gap-5">
                <span className="text-gray-2 text-base font-normal leading-loose">
                  일시
                </span>
                <span className="text-black-1 text-base font-normal leading-loose">
                  {
                    parseScheduleString(
                      finalScheduleDetail.scheduleData.scheduleId
                    ).date
                  }{" "}
                  <br />
                  {
                    parseScheduleString(
                      finalScheduleDetail.scheduleData.scheduleId
                    ).time
                  }
                </span>
              </span>

              <span className="flex gap-5">
                <span className="text-gray-2 text-base font-normal leading-loose">
                  장소
                </span>
                <span className="text-black-1 text-base font-normal  leading-loose">
                  {finalScheduleDetail.scheduleData.placeName}
                </span>
              </span>

              <span className="flex gap-5">
                <span className="text-gray-2 text-base font-normal leading-loose">
                  그룹
                </span>
                <span className="text-black-1 text-base font-normal  leading-loose">
                  {finalScheduleDetail.scheduleData.groupName}
                </span>
              </span>

              <span className="flex gap-5">
                <span className="text-gray-2 text-base font-normal leading-5 whitespace-nowrap">
                  참여
                  <br />
                  인원
                </span>
                <span className="text-black-1 text-base font-normal  leading-loose overflow-scroll no-scrollbar">
                  {finalScheduleDetail.userIds
                    .map((member) => member)
                    .join(", ")}
                </span>
              </span>
            </div>
          )
        )}

        <DialogFooter>
          <Button
            text={"확인"}
            disabled={false}
            onClick={() => setIsOpen(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
