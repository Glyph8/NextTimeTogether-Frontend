"use client";

import Image from "next/image";
import Header from "@/components/ui/header/Header";
import X from "@/assets/svgs/icons/x-black.svg";
import XWhite from "@/assets/svgs/icons/x-white.svg";
import Plus from "@/assets/svgs/icons/plus-white.svg";
import { Button } from "@/components/ui/button/Button";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// TODO : 임시 기본 이미지
import FullLogo from "@/assets/pngs/logo-full.png";
import { useCreateGroup } from "./use-create-group";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateGroupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const { mutate: createGroup, isPending } = useCreateGroup();

const handleCreateGroup = () => {
    createGroup({
      groupName: groupName,
      groupExplain: groupDescription,
      groupImg: "임시 이미지", 
      explain: "임시 설명",
    }, {
      onSuccess: () => {
        // 성공 시 TODO : Toast로 추후 교체
        alert("그룹이 성공적으로 생성되었습니다!");
        queryClient.invalidateQueries({ queryKey: ["groupList"] });
        router.push("/groups");
      },
      onError: (error: { message: string; }) => {
        // 실패 시
        alert(`그룹 생성 실패: ${error.message}`);
      }
    });
  };

  if (isPending) {
    return <div>그룹 생성 로딩중</div>;
  }

  return (
    <div className="flex flex-col w-full flex-1 bg-white pb-5">
      <Header
        leftChild={
          <Link href={"/groups"}>
            <X />
          </Link>
        }
        title={"그룹 만들기"}
      />

      <div className="w-full flex justify-center items-center px-4 md:px-40 pt-5 pb-3.5 relative">
        <div className="w-16 h-16 rounded-[8px] border border-[#E4E4E4] bg-gray-3 relative">
          <Image
            src={FullLogo}
            alt="프로필"
            width={64}
            height={64}
          />
          <button
            type="button"
            className="w-6 h-6 rounded-full bg-gray-2 flex justify-center items-center
                absolute top-11 left-11"
          >
            <Plus />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full h-full p-4 flex flex-col justify-between items-start">
        <div className="w-full flex flex-col gap-8">
          <div className="w-full flex flex-col gap-3">
            <span className="text-gray-1 text-sm font-normal leading-tight">
              그룹명
            </span>
            <div className="w-full flex justify-between relative">
              <input
                placeholder="그룹명을 입력해주세요."
                className="w-full py-2.5 text-black-1 text-base font-medium leading-tight border-b-1 focus:border-b-main"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />

              {groupName !== "" && (
                <button
                  className="absolute right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
                  onClick={() => setGroupName("")}
                >
                  <XWhite />
                </button>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <span className="text-gray-1 text-sm font-normal leading-tight">
              어떤 그룹인가요?
            </span>
            <div className="w-full flex justify-between relative">
              <input
                placeholder="그룹 설명을 입력해주세요."
                className="w-full py-2.5 text-black-1 text-base font-medium leading-tight border-b-1 focus:border-b-main"
                onChange={(e) => setGroupDescription(e.target.value)}
                value={groupDescription}
              />
              {groupDescription !== "" && (
                <button
                  className="absolute right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
                  onClick={() => setGroupDescription("")}
                >
                  <XWhite />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Button
            text={"그룹 만들기"}
            disabled={isPending || !groupName || !groupDescription} 
            onClick={handleCreateGroup}
          />
        </div>
      </div>
    </div>
  );
}
