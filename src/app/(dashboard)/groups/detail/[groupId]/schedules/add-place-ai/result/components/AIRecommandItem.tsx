import Checked from "@/assets/svgs/icons/checked.svg";
import Unchecked from "@/assets/svgs/icons/unchecked.svg";

interface AIRecommandItemProps {
  placeName: string;
  placeAddress: string;
  isChecked: boolean;
  handleToggle: () => void;
}

export const AIRecommandItem = ({
  placeName,
  placeAddress,
  isChecked,
  handleToggle,
}: AIRecommandItemProps) => {

  return (
    <div
      className="flex justify-between items-center text-base font-medium leading-tight
    border-1 border-gray-3 rounded-[20px] p-4"
    >
      <div className="flex flex-col gap-2">
        <span>{placeName}</span>
        <span className="text-sm font-normal text-gray-2">{placeAddress}</span>
      </div>

      <button className="w-7 h-7" type="button"
      onClick={handleToggle}>
        {isChecked ? <Checked className="w-7 h-7"/> : <Unchecked  className="w-7 h-7"/>}
      </button>
    </div>
  );
};
