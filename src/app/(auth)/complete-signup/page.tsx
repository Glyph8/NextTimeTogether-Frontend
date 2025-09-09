"use client";

import React from "react";
import Clock from "@/assets/pngs/clock.png";
import Image from "next/image";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
export default function CompleteSignupPage() {
  const router = useRouter();
  const handleStartService = () => {
    router.push("/calendar");
  };
  return (
    <div className="relative flex flex-col justify-between items-center min-h-screen bg-white px-4 pb-5 pt-18">
      <div className="w-full max-w-200 flex flex-col justify-start text-2xl font-semibold leading-5">
        <span>시간 조율 걱정 없이</span>
        <span>
          그룹 모임을{" "}
          <span className="text-main text-2xl font-semibold leading-loose">
            편하고 빠르게
          </span>
        </span>
      </div>
      <Image
        src={Clock}
        alt="시계 아이콘"
        width={160}
        height={160}
        className="mb-15"
      />

      <Button
        text="지금 시작하기"
        disabled={false}
        onClick={handleStartService}
      />
    </div>
  );
}
