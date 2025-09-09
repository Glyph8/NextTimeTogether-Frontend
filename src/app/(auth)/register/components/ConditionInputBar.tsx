import React from "react";
import XWhite from "@/assets/svgs/icons/x-white.svg";
import { Check } from "lucide-react";

interface Condition {
  title: string;
  isFullfilled: (_data: string) => boolean;
}

interface CheckWithWarn {
  warnMessage: string;
  isWarn: boolean;
}

interface ConditionInputBarProps {
  data: string;
  onChange: (_value: string) => void;
  placeholder?: string;
  conditions?: Condition[];
  isPassword?: boolean;
  isOnlyNumber?: boolean;
  checkWithWarn?: CheckWithWarn;
}

export default function ConditionInputBar({
  data,
  onChange,
  placeholder,
  conditions = [],
  isPassword = false,
  isOnlyNumber = false,
  checkWithWarn,
}: ConditionInputBarProps) {
  const determineType = () => {
    if (isPassword) return "password";
    if (isOnlyNumber) return "number";
    return "text";
  };

  return (
    <div className="w-full flex flex-col py-5 gap-2">
      <div
        className={`w-full flex justify-between items-center border-b-1
           
           ${
             !!checkWithWarn && checkWithWarn.isWarn
               ? "border-b-highlight-1"
               : "border-gray-3 focus-within:border-b-main"
           }`}
      >
        <input
          type={`${determineType}`}
          placeholder={placeholder}
          className="w-full placeholder-gray-2 text-base font-medium leading-11.5"
          onChange={(e) => {
            onChange(e.target.value);
          }}
          value={data}
        />
        <div className="flex gap-3 items-center">
          {data !== "" && (
            <button
              className="right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
              onClick={() => onChange("")}
            >
              <XWhite />
            </button>
          )}
        </div>
      </div>

      {!!checkWithWarn && checkWithWarn.isWarn && (
        <span className="text-highlight-1 text-sm font-medium leading-tight">
          {checkWithWarn.warnMessage}
        </span>
      )}
      <span className="flex items-center gap-1.5 text-sm font-medium leading-tight text-gray-2">
        {conditions.map((condition, index) => {
          return (
            <span
              key={condition.title + index}
              className={`flex gap-1 ${
                condition.isFullfilled(data) && "text-main"
              }`}
            >
              {condition.title}
              <Check className="w-4 h-4 " />
            </span>
          );
        })}
      </span>
    </div>
  );
}
