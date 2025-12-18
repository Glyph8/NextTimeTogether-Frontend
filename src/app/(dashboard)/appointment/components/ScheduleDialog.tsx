import { getScheduleDetail } from "@/api/appointment";
import { Button } from "@/components/ui/button/Button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { useQuery } from "@tanstack/react-query";
import { parseScheduleString } from "../[scheduleId]/detail/utils/formatter";

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
  //   const {
  //     data: groupDetail,
  //     groupKey,
  //     isPending: isGroupFetching,
  //   } = useGroupDetail(groupId ?? null);

  const { data: scheduleDetail, isPending } = useQuery({
    queryKey: ["scheduleDetail", scheduleId],
    queryFn: async () => {
      const scheduleData = await getScheduleDetail(scheduleId);

      let decryptedUserIds: string[] = [];
      decryptedUserIds = scheduleData.encUserIds.map(() => "알 수 없음");

      // TODO : scheduleId mem2 지원안됨.
      //   if (!groupId) {
      //     decryptedUserIds = scheduleData.encUserIds.map(() => "알 수 없음");
      //   }

      //   const userIds = await Promise.all(
      //     scheduleData.encUserIds.map(async (id) => {
      //       return await decryptDataWithCryptoKey(
      //         id,
      //         // promiseKey, // 상위 스코프의 promiseKey 사용
      //         groupKey ?? "", // TODO : 🤦‍♂️🤦‍♂️🤦‍♂️ 아니 이거 왜 groupKey로 암호화 되있냐
      //         // "promise_proxy_user",
      //         "group_sharekey"
      //       );
      //     })
      //   );

      //   const sdecryptedUserIds = await getPromiseMemberDetail(scheduleId, {
      //     userIds: userIds,
      //   });

      //   decryptedUserIds = sdecryptedUserIds.users.map(
      //     (member) => member.userName
      //   );

      //   return decryptedUserIds;
      return { scheduleData, userIds: decryptedUserIds };
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle hidden>상세 일정</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="w-full p-5 bg-[#E9E9EB]"
      >
        {isPending ? (
          <DefaultLoading />
        ) : (
          scheduleDetail && (
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
                {/* TODO : 암호화된 아이디 복호화 필요 */}
                <span className="text-black-1 text-base font-normal  leading-loose overflow-scroll no-scrollbar">
                  {scheduleDetail.userIds.map((member) => member).join(", ")}
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
