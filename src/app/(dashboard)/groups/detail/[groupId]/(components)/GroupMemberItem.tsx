import DefaultImg from "@/assets/svgs/icons/default-member-image.svg";
import UserMark from "@/assets/svgs/icons/group-user.svg";
import MasterMark from "@/assets/svgs/icons/group-master.svg";
import Checked from "@/assets/svgs/icons/checked.svg";
import Unchecked from "@/assets/svgs/icons/unchecked.svg";

interface GroupMemberItemProps {
  marker?: string[];
  image?: string;
  name: string;
  selectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const GroupMemberItem = ({
  marker,
  image,
  name,
  selectable = false,
  isSelected = false,
  onClick,
}: GroupMemberItemProps) => {
  const isInteractive = selectable || !!onClick;
  const Tag = isInteractive ? "button" : "div";

  return (
    <Tag
      className="w-13 flex flex-col justify-between items-center"
      type={isInteractive ? "button" : undefined}
      onClick={onClick}
    >
      <div className="w-full flex flex-col gap-0.5 justify-between items-center">
        <div className="w-full flex justify-center items-center">
          {marker ? (
            <>
              {marker.includes("사용자") ? <UserMark /> : null}
              {marker.includes("그룹장") ? <MasterMark /> : null}
            </>
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div>{image ?? <DefaultImg />}</div>
          <p className="text-black-1 text-sm font-normal leading-tight text-center break-all whitespace-normal">
            {name}
          </p>
        </div>
      </div>
      {selectable ? (
        <>
          {isSelected ? (
            <button className="w-4.5">
              <Checked />
            </button>
          ) : (
            <button className="w-4.5">
              <Unchecked />
            </button>
          )}
        </>
      ) : null}
    </Tag>
  );
};
