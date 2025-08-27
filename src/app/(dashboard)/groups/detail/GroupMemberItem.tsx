import DefaultImg from "@/assets/svgs/icons/default-member-image.svg"

import UserMark from "@/assets/svgs/icons/group-user.svg"
import MasterMark from "@/assets/svgs/icons/group-master.svg"

interface GroupMemberItemProps {
    marker?: string[];
    image?: string;
    name: string;
}

export const GroupMemberItem = ({ marker, image, name }: GroupMemberItemProps) => {
    return (
        <div className="w-13 flex flex-col gap-0.5 items-center">
            <div className="flex justify-center items-center">
                {marker ? (
                    <>
                    {marker.includes("사용자") ? <UserMark/> : null } 
                    {marker.includes("그룹장") ? <MasterMark/> : null}
                    </>     
                ) : (
                    <div className="bg-white w-4 h-4"/>
                )
                }
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    {image ?? <DefaultImg />}
                </div>
                <p className="text-black-1 text-sm font-normal leading-none">
                    {name}
                </p>
            </div>
        </div>
    )
}