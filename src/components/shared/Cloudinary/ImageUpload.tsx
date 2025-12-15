"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Plus from "@/assets/svgs/icons/plus.svg"; // 아이콘 경로는 본인에 맞게
import FullLogo from "@/assets/images/full-logo.png"; // 이미지 경로는 본인에 맞게

interface CloudinaryUploadProps {
  uploadPreset: string;
  groupImg: string;
  setGroupImg: (url: string) => void;
}

export default function CloudinaryUpload({
  uploadPreset,
  groupImg,
  setGroupImg,
}: CloudinaryUploadProps) {
  const widgetRef = useRef<any>(null);
  const cloudinaryRef = useRef<any>(null);

  useEffect(() => {
    // 1. window 객체에서 cloudinary가 로드되었는지 확인
    // layout.tsx에서 불러온 스크립트가 로드되면 window.cloudinary가 생깁니다.
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      cloudinaryRef.current = (window as any).cloudinary;

      // 2. 위젯 생성 (라이브러리 없이 직접 생성)
      // 이 방식은 이미 nonce를 통과한 'window.cloudinary'를 사용하므로 안전합니다.
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // .env 확인
          uploadPreset: uploadPreset,
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
          // ⚠️ CSP 중요 설정: 위젯 내부의 인라인 스타일/스크립트 문제 완화
          sources: ["local", "url", "camera"],
          defaultSource: "local",
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            setGroupImg(result.info.secure_url);
          }
        }
      );
    }
  }, [uploadPreset, setGroupImg]);

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      // 스크립트가 아직 로드되지 않았을 경우 대비
      console.warn("Cloudinary script not loaded yet");
      // 필요하다면 여기서 Toast 메시지를 띄울 수 있습니다.
    }
  };

  return (
    <div className="relative w-16 h-16 cursor-pointer" onClick={openWidget}>
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
        className="w-6 h-6 rounded-full bg-gray-2 flex justify-center items-center absolute -bottom-2 -right-2 z-10"
      >
        <Plus />
      </button>
    </div>
  );
}