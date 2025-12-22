import { useParams } from "next/navigation";
import { usePlaceBoard } from "./hooks/use-place-board";
import { AddPlaceDialog } from "./where-components/AddPlaceDialog";
import { PlaceCard } from "./where-components/PlaceCard";
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { useState } from "react";
import { PlaceCardSkeleton } from "@/components/ui/Loading/PlaceCardSkeleton";
import { EncryptedPromiseMemberId } from "@/api/promise-view-create";

interface Where2MeetProps {
  encMemberIdList: EncryptedPromiseMemberId
}

export const Where2Meet = ({
  encMemberIdList
}:Where2MeetProps ) => {
  const params = useParams<{ promiseId: string }>();
  const promiseId = params.promiseId;
  // const { placeListInfo, isPending, error, page, setPage } =
   const { placeListInfo, isPending, error } =
    usePlaceBoard(promiseId);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const handleAddPlace = () => setAddModalOpen(true);

  return (
    <div className="flex flex-col bg-[#F9F9F9] h-full overflow-y-scroll scrollbar-hidden">
      <AddPlaceDialog isOpen={addModalOpen} setIsOpen={setAddModalOpen}  promiseId={ promiseId} />
      <YesNoDialog
        isOpen={delModalOpen}
        setIsOpen={setDelModalOpen}
        title={
          <span>
            <span className="text-main">장소</span>를 삭제하시겠어요?
          </span>
        }
        acceptedTitle={
          <span>
            <span className="text-main">장소</span>를 삭제했어요.
          </span>
        }
        rejectText={"취소"}
        acceptText={"삭제"}
        extraHandleReject={() => {}}
        extraHandleAccept={() => {}}
      />
      <div className="flex flex-col gap-3 px-4 py-5 items-center bg-white">
        <div className="text-center text-black-1 text-lg font-semibold leading-tight">
          장소 게시판
        </div>
        <div className="text-center text-gray-2 text-sm font-normal leading-tight">
          모임을 원하는 장소에 투표해주세요.
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center gap-5.5 w-full p-4 bg-[#F9F9F9]">
        <div className="w-full flex flex-col gap-2">
          {isPending ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <PlaceCardSkeleton key={index} />
              ))}
            </>
          ) : error ? (
            <div className="text-center py-10 text-gray-500">
              데이터를 불러오는데 실패했습니다.
            </div>
          ) : (
            <>
              {placeListInfo?.places.map((place) => (
                <PlaceCard
                  promiseId={promiseId}
                  placeInfo={place}
                  totalMemberCount={encMemberIdList.userIds.length}
                  key={place.id}
                />
              ))}
              {placeListInfo?.places.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  등록된 장소가 없습니다.
                </div>
              )}
            </>
          )}
        </div>

 <button
          className="w-[40%] rounded-[8px] px-5 py-2.5 bg-main text-white text-base font-medium leading-tight text-center"
          onClick={handleAddPlace}
        >
          장소 추가하기
        </button>
      </div>
    </div>
  );
};
