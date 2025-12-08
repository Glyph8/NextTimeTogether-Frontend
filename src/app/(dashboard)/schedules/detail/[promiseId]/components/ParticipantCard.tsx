import DefaultProfile from "@/assets/svgs/icons/default-member-image.svg";
import UserMarker from "@/assets/svgs/icons/group-user.svg";
import MasterMarker from "@/assets/svgs/icons/group-master.svg";
import { useAuthStore } from "@/store/auth.store";

interface ParticipantCardProps {
  name: string;
  isMaster: boolean;
}

export const ParticipantCard = ({ name, isMaster }: ParticipantCardProps) => {
  // TODO 아아디 구분 뭘로할지 확정되면 맞추기
  // TODO : promiseKey로 복호화?

  const userId = useAuthStore.getState().userId;
  return (
    <div className="flex gap-3 justify-start items-center">
      <DefaultProfile />
      <span className="flex gap-1 text-black-1 text-base font-normal leading-tight">
        {name === localStorage.getItem("encrypted_user_id") && <UserMarker />}
        {isMaster && <MasterMarker />}
        {name}
      </span>
    </div>
  );
};
