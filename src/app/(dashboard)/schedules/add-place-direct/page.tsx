"use client";

import { TextInput } from "@/components/shared/Input/TextInput";
import { useState } from "react";
import { Button } from "@/components/ui/button/Button";
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { registerPlaceBoard } from "@/api/where2meet";

export default function AddPlaceDirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promiseId = searchParams.get("promiseId");

  const [placeName, setPlaceName] = useState("");
  const [placeAddr, setPlaceAddr] = useState("");
  const [placeDescription, setPlaceDescription] = useState("");
  const [openEnroll, setOpenEnroll] = useState(false);

  const handleReturnToBoard = async () => {

    const data = [
      {
        placeName: placeName,
        placeAddress: placeAddr,
        placeInfo : placeDescription,
        aiPlace: false,
      }
    ]

    if(!promiseId){
      return;
    }

    const result = await registerPlaceBoard(promiseId, data)

    if(result.code !== 200){
      // TODO : 토스트 메세지 알림
      console.log("응답 전체", result);
      console.log("result만", result.result)
      console.warn(result.code, result.message)
      return;
    }

    router.push(`/schedules/detail/${promiseId}`);
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
            name="placeName"
            data={placeName}
            setData={setPlaceName}
            placeholder={"장소 이름을 입력해주세요"}
          />
          <TextInput
            label={"장소주소"}
            name="placeAddr"
            data={placeAddr}
            setData={setPlaceAddr}
            placeholder={"장소 주소를 입력해주세요"}
          />
          <TextInput
            label={"어떤 장소인가요? (선택)"}
            name="placeDescription"
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
                  <span className="text-black-1">
                    {placeDescription === "" ? "-" : placeDescription}
                  </span>
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
