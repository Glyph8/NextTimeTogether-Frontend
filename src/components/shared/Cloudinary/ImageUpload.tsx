"use client"; // 클라이언트 컴포넌트 필수

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (url: string) => void; // 업로드 완료 후 부모에게 URL 전달
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">이미지 업로드</h3>
      
      <CldUploadWidget
        uploadPreset="여기에_복사한_PRESET_NAME_붙여넣기" // 예: 'my-uploads'
        onSuccess={(result: any) => {
          // 업로드 성공 시 Cloudinary가 주는 정보
          // result.info.secure_url: 바로 사용할 수 있는 이미지 주소
          // result.info.public_id: 이미지 관리용 ID
          
          const uploadedUrl = result.info.secure_url;
          setImageUrl(uploadedUrl);
          onUpload(uploadedUrl); // 상위 컴포넌트로 URL 전달 (DB 저장용)
          
          console.log("업로드 성공!", result.info);
        }}
        options={{
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"], // 허용 포맷
          // sources: ['local', 'url', 'camera'], // 업로드 소스 지정 가능
        }}
      >
        {({ open }) => {
          // open() 함수를 실행하면 업로드 모달창이 뜹니다.
          return (
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              onClick={() => open()}
            >
              이미지 업로드하기
            </button>
          );
        }}
      </CldUploadWidget>

      {/* 업로드된 이미지 미리보기 */}
      {imageUrl && (
        <div className="mt-4 relative w-64 h-64">
           <Image 
             src={imageUrl} 
             alt="Uploaded Image" 
             fill 
             className="object-cover rounded-md"
           />
        </div>
      )}
    </div>
  );
}