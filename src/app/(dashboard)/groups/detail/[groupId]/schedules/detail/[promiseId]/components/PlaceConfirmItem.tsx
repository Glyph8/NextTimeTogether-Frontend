import { PlaceBoardItem } from "@/api/where2meet";

interface PlaceConfirmItemProps {
  placeInfo: PlaceBoardItem;
  totalMemberCount: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export const PlaceConfirmItem = ({
  placeInfo,
  totalMemberCount,
  isSelected,
  onSelect,
}: PlaceConfirmItemProps) => {
  const { id, placeName, placeAddr, voting } = placeInfo;

  return (
    <div
      onClick={() => onSelect(id)}
      className={`w-full cursor-pointer flex justify-between items-center rounded-[20px] p-4 bg-white border-1 transition-all duration-200
        ${isSelected ? "border-main shadow-sm" : "border-gray-3"}`}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-start items-center gap-2 text-base font-medium">
          <span className="text-gray-2">
            {/* 디자인에 맞춰 투표 수 / 전체 인원 표시 */}
            <span className="text-main">{voting}</span> / {totalMemberCount}
          </span>
          <span className="text-black-1 leading-tight">{placeName}</span>
        </div>
        <span className="text-gray-2 text-sm font-normal leading-tight">
          {placeAddr}
        </span>
      </div>

      {/* 라디오 버튼 UI */}
      <div className="relative flex items-center justify-center w-7 h-7">
        <div
          className={`w-6 h-6 rounded-full border-1 flex items-center justify-center
            ${isSelected ? "border-main" : "border-gray-3"}`}
        >
          {isSelected && (
            <div className="w-3.5 h-3.5 bg-main rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};