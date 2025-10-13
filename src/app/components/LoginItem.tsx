import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

interface LoginItemProps {
  icon: string | StaticImageData;
  text: string;
  route: string;
}

export default function LoginItem({ icon, text, route }: LoginItemProps) {
  return (
    <div
      className="flex justify-center items-center w-full max-w-100 h-12 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-neutral-200 
      text-center text-stone-500 text-base font-medium leading-tight px-4 py-2.5"
    >
      <div className="flex-1">
        {icon !== "none" && (
          <Image src={icon} alt={text} width={30} height={30} />
        )}
      </div>
      <Link href={route} className="flex-4">
        {text}로 로그인
      </Link>
      <div className="flex-1"></div>
    </div>
  );
}
