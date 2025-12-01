import { dummyPlaceInfo, dummyPlaceInfo2 } from "../../constants";
import { AddPlaceDialog } from "./where-components/AddPlaceDialog";
import { PlaceCard } from "./where-components/PlaceCard";
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { useState } from "react";

export const Where2Meet = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [delModalOpen, setDelModalOpen] = useState(true);
  const handleAddPlace = () => setAddModalOpen(true);
  return (
    <div className="flex flex-col bg-[#F9F9F9] h-full overflow-y-scroll scrollbar-hidden">
      <AddPlaceDialog isOpen={addModalOpen} setIsOpen={setAddModalOpen} />
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
          <PlaceCard placeInfo={dummyPlaceInfo} />
          <PlaceCard placeInfo={dummyPlaceInfo} />
          <PlaceCard placeInfo={dummyPlaceInfo2} />
          <PlaceCard placeInfo={dummyPlaceInfo2} />
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
