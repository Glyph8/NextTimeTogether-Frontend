"use client";

import { TextInput } from "@/components/shared/Input/TextInput";
import { useState } from "react";
import { Button } from "@/components/ui/button/Button";
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { useRouter } from "next/navigation";

export default function AddPlaceDirectPage() {
  const router = useRouter();
  const [placeName, setPlaceName] = useState("");
  const [placeDescription, setPlaceDescription] = useState("");
  const [openEnroll, setOpenEnroll] = useState(false);

  const handleReturnToBoard = () => {
    router.back();
  };

  const labelClass =
    "flex gap-5 text-gray-2 text-base font-normal leading-loose";

  return (
    <div className="flex flex-col w-full flex-1 bg-white justify-between py-5">
      <div>
        <div className="pt-2 pb-5 text-black-1 text-xl font-medium leading-8">
          <p>장소 정보를</p>
          <p>입력해주세요</p>
        </div>
        <div className="py-5 flex flex-col gap-5">
          <TextInput
            label={"장소명"}
            data={placeName}
            setData={setPlaceName}
            placeholder={"장소 이름을 입력해주세요"}
          />
          <TextInput
            label={"어떤 장소인가요? (선택)"}
            data={placeDescription}
            setData={setPlaceDescription}
            placeholder={"장소 설명을 입력해주세요"}
          />
        </div>

        <YesNoDialog
          isOpen={openEnroll}
          setIsOpen={setOpenEnroll}
          title={
            <div className="w-full flex flex-col items-center gap-8 pb-5">
              <div className="w-full flex flex-col items-start gap-4">
                <span className={labelClass}>
                  장소명
                  <span className="text-black-1">{placeName}</span>
                </span>
                <span className={labelClass}>
                  설명
                  <span className="text-black-1">{placeDescription === "" ? "-" : placeDescription}</span>
                </span>
              </div>

              <div className="w-full border-1 border-gray-3" />
              <p className="text-lg text-black-1 font-medium leading-tight">
                장소를 등록하시겠어요?
              </p>
            </div>
          }
          acceptedTitle={<div>장소를 성공적으로 등록했어요.</div>}
          rejectText={"취소"}
          acceptText={"등록"}
          extraHandleReject={() => {}}
          extraHandleAccept={handleReturnToBoard}
        />
      </div>

      <Button
        text={"장소 등록하기"}
        disabled={placeName === ""}
        onClick={() => setOpenEnroll((prev) => !prev)}
      />
    </div>
  );
}
