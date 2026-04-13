"use client";

import toast from "react-hot-toast";

import Header from "@/components/ui/header/Header";
import X from "@/assets/svgs/icons/x-black.svg";
import XWhite from "@/assets/svgs/icons/x-white.svg";
import { Button } from "@/components/ui/button/Button";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateGroup } from "./use-create-group";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Plus from "@/assets/svgs/icons/plus-white.svg";
import FullLogo from "@/assets/pngs/logo-full.png"; // 기본 이미지
import { DEFAULT_IMAGE } from "@/constants";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { uploadImage } from "@/hooks/useImageUpload";
import { useRef } from "react";

export default function CreateGroupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  // ✅ 추가: 업로드된 이미지 URL을 저장할 State
  const [groupImg, setGroupImg] = useState(DEFAULT_IMAGE);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: createGroup, isPending } = useCreateGroup();

  const handleSelectImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const url = await uploadImage(file);
      setGroupImg(url);
      toast.success("이미지가 업로드되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleCreateGroup = () => {
    createGroup(
      {
        groupName: groupName,
        groupExplain: groupDescription,
        // ✅ 수정: 실제 업로드된 이미지 URL 전송 (없으면 빈 문자열 혹은 기본값)
        groupImg: groupImg,
      },
      {
        onSuccess: () => {
          // TODO : Toast로 추후 교체
          toast.success("그룹이 성공적으로 생성되었습니다!");
          queryClient.invalidateQueries({ queryKey: ["groupList"] });
          router.push("/groups");
        },
        onError: (error: { message: string }) => {
          toast.error(`그룹 생성 실패: ${error.message}`);
        },
      }
    );
  };


  // 로딩 상태 처리
  if (isPending) {
    return <DefaultLoading />;
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
        <div
          className="relative w-16 h-16 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-[8px] border border-[#E4E4E4] bg-gray-3 overflow-hidden relative">
            <Image
              src={groupImg || FullLogo}
              alt="그룹 프로필"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <button
            type="button"
            className="w-6 h-6 rounded-full bg-gray-2 flex justify-center items-center absolute -bottom-2 -right-2 top-11 left-11 z-10"
            disabled={isUploadingImage}
          >
            <Plus />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleSelectImage}
          />
        </div>
      </div>

      <div className="flex-1 w-full h-full p-4 flex flex-col justify-between items-start">
        {/* ... (이하 기존 Form 코드와 동일) ... */}
        <div className="w-full flex flex-col gap-8">
          <div className="w-full flex flex-col gap-3">
            <span className="text-gray-1 text-sm font-normal leading-tight">
              그룹명
            </span>
            <div className="w-full flex justify-between relative">
              <input
                placeholder="그룹명을 입력해주세요."
                className="w-full py-2.5 text-black-1 text-base font-medium leading-tight border-b-1 focus:border-b-main outline-none" // outline-none 추가 추천
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
                className="w-full py-2.5 text-black-1 text-base font-medium leading-tight border-b-1 focus:border-b-main outline-none"
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
            // 로딩 중이거나, 이름/설명이 없으면 비활성화
            // (이미지는 필수가 아니라면 조건에서 뺌, 필수라면 !groupImg 추가)
            disabled={
              isPending || isUploadingImage || !groupName || !groupDescription
            }
            onClick={handleCreateGroup}
          />
        </div>
      </div>
    </div>
  );
}
