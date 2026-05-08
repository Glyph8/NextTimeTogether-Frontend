import Trashcan from "@/assets/svgs/icons/trashcan.svg";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { DEFAULT_IMAGE } from "@/constants";

interface GroupItemProps {
  groupId: string;
  image: string;
  title: string;
  description: string;
  members: string;
  /** 휴지통 버튼 클릭 시 호출. 호출 측이 어떤 그룹인지 캡처해 다이얼로그를 띄운다. */
  onRequestExit: () => void;
}

export const GroupItem = ({
  groupId,
  image,
  title,
  description,
  members,
  onRequestExit,
}: GroupItemProps) => {
  const router = useRouter();

  const handleToDetail = () => {
    router.push(`/groups/detail/${groupId}`);
  };

  const handleExit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRequestExit();
  };

  return (
    <div
      className="w-full flex flex-row bg-white gap-3 px-4 py-3 border-gray-3 border-1 rounded-[8px]"
      onClick={handleToDetail}
    >
      <CldImage
        src={image ?? DEFAULT_IMAGE}
        alt="image"
        width="64"
        height="64"
        className="border-gray-1 rounded-[8px]"
        crop="fill"
      />
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <p className="text-black-1 text-base font-medium leading-tight tracking-tight">
            {title}
          </p>
          <button type="button" className="w-6 h-6" onClick={handleExit}>
            <Trashcan />
          </button>
        </div>

        <span className="text-gray-2 text-sm font-normal leading-tight tracking-tight">
          {description}
        </span>
        <span className="text-gray-2 text-sm font-normal leading-tight tracking-tight">
          {members}
        </span>
      </div>
    </div>
  );
};
