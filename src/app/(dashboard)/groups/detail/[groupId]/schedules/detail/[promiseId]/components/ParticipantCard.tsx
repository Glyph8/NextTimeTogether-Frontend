import DefaultProfile from "@/assets/svgs/icons/default-member-image.svg";
import UserMarker from "@/assets/svgs/icons/group-user.svg";
import MasterMarker from "@/assets/svgs/icons/group-master.svg";

interface ParticipantCardProps {
  name: string;
  isMaster: boolean;
  /** 본인 여부. 호출 측에서 useCurrentUserId() 와 participant.userId 를 비교해 전달한다. */
  isCurrentUser: boolean;
}

export const ParticipantCard = ({ name, isMaster, isCurrentUser }: ParticipantCardProps) => {
  return (
    <div className="flex gap-3 justify-start items-center">
      <DefaultProfile />
      <span className="flex gap-1 text-black-1 text-base font-normal leading-tight">
        {isCurrentUser && <UserMarker />}
        {isMaster && <MasterMarker />}
        {name}
      </span>
    </div>
  );
};
