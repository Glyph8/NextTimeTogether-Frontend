// import Image from "next/image";
import Trashcan from "@/assets/svgs/icons/trashcan.svg";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

interface GroupItemProps {
  groupId: string;
  image: string;
  title: string;
  description: string;
  members: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GroupItem = ({
  groupId,
  image,
  title,
  description,
  members,
  setIsOpen,
}: GroupItemProps) => {
  const router = useRouter();

  const handleToDetail = () => {
    router.push(`/groups/detail/${groupId}`);
  };

  const handleExit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <div
      className="w-full flex flex-row bg-white gap-3 px-4 py-3 border-gray-3 border-1 rounded-[8px]"
      onClick={handleToDetail}
    >
      <CldImage
        src={image} // 전체 URL을 넣어도 되고, 파일 ID만 넣어도 됨
        alt="image"
        width="64" // 문자열로 넣어도 됨
        height="64"
        className="border-gray-1 rounded-[8px]"
        crop="fill"
      />
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <p className="text-black-1 text-base font-medium leading-tight tracking-tight">
            {title}
          </p>
          <button className="w-6 h-6" onClick={handleExit}>
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
