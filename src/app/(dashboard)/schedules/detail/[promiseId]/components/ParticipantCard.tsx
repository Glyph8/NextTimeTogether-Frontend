import DefaultProfile from "@/assets/svgs/icons/default-member-image.svg";
import UserMarker from "@/assets/svgs/icons/group-user.svg";
import MasterMarker from "@/assets/svgs/icons/group-master.svg";

export const ParticipantCard = () => {
    return (
        <div className="flex gap-3 justify-start items-center">
            <DefaultProfile />
            <span className="flex gap-1 text-black-1 text-base font-normal leading-tight">
                <UserMarker />
                <MasterMarker />
                이OO
            </span>
        </div>
    )
}