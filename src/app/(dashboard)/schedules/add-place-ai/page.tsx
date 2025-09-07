"use client";

import { Button } from "@/components/ui/button/Button";
import { SearchBar } from "./components/SearchBar";

export default function AddPlaceAIPage() {
  return (
    <div className="flex flex-col w-full flex-1 bg-white justify-between py-5">
      <div>
        <div className="pt-2 pb-5 text-black-1 text-xl font-medium leading-8">
          <p>어느 장소 근처로</p>
          <p>추천받을까요?</p>
        </div>
        <SearchBar/>1
      </div>
      <Button text={"장소 등록하기"} disabled={false} onClick={() => {}} />
    </div>
  );
}
