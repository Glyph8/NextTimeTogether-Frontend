import React, { useMemo } from "react";
import Picker from "react-mobile-picker";
import { DateTimeValue } from "../hooks/use-create-promise";

interface DateTimePickerProps {
  value: DateTimeValue;
  onChange: (value: DateTimeValue) => void;
}

export default function DateTimePicker({
  value,
  onChange,
}: DateTimePickerProps) {
  // 1. 데이터 범위 생성
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => String(currentYear + i));
  }, []);

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  // 동적 일(Day) 계산: 선택된 연/월에 따라 마지막 날짜 변경
  const days = useMemo(() => {
    const year = parseInt(value.year);
    const month = parseInt(value.month);
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );
  }, [value.year, value.month]);

  const ampms = ["오전", "오후"];
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  ); // 1분 단위

  const selections = {
    year: years,
    month: months,
    day: days,
    ampm: ampms,
    hour: hours,
    minute: minutes,
  };

  const columnWidths: Record<string, string> = {
    year: "w-18", // 년도는 조금 넓게 (약 64px)
    month: "w-10", // 월은 좁게
    day: "w-10", // 일도 좁게
    ampm: "w-12", // 오전/오후 적당히
    hour: "w-10", // 시
    minute: "w-10", // 분
  };

  return (
    <div className="flex justify-center items-center bg-white rounded-lg overflow-hidden py-4 w-full">
      <Picker
        value={value}
        onChange={onChange}
        wheelMode="normal"
        height={180} // 높이를 조금 넉넉하게
        itemHeight={40}
      >
        {Object.keys(selections).map((name) => (
          <Picker.Column key={name} name={name}>
            {selections[name as keyof typeof selections].map((option) => (
              <Picker.Item key={option} value={option}>
                {({ selected }) => (
                  <div
                    className={`flex items-center justify-center h-full text-base whitespace-nowrap ${
                      columnWidths[name] || "w-10"
                    } ${selected ? "text-main font-bold" : "text-gray-1"}`}
                  >
                    {option}
                  </div>
                )}
              </Picker.Item>
            ))}
          </Picker.Column>
        ))}
      </Picker>
    </div>
  );
}
