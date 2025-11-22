"use client";

import React, { useState, useEffect } from "react";

interface TimeTableGridProps {
  mode: "view" | "select";
  data?: number[][]; // [dayIndex][timeIndex] -> count
  mySelection?: boolean[][]; // [dayIndex][timeIndex] -> isSelected
  onChange?: (selection: boolean[][]) => void;
  maxMembers?: number;
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const DATES = ["10/7", "10/8", "10/9", "10/10", "10/11", "10/12", "10/13"]; // Mock dates
const START_TIME = 9;
const END_TIME = 24;
const HOURS = Array.from(
  { length: END_TIME - START_TIME },
  (_, i) => START_TIME + i
);

export const TimeTableGrid = ({
  mode,
  data,
  mySelection,
  onChange,
  maxMembers = 5,
}: TimeTableGridProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<{
    day: number;
    time: number;
  } | null>(null);
  const [currentCell, setCurrentCell] = useState<{
    day: number;
    time: number;
  } | null>(null);

  // Initialize selection if not provided
  const [internalSelection, setInternalSelection] = useState<boolean[][]>(
    mySelection ||
      Array(7)
        .fill(null)
        .map(() => Array(HOURS.length).fill(false))
  );

  useEffect(() => {
    if (mySelection) {
      setInternalSelection(mySelection);
    }
  }, [mySelection]);

  const handleMouseDown = (day: number, time: number) => {
    if (mode !== "select") return;
    setIsDragging(true);
    setStartCell({ day, time });
    setCurrentCell({ day, time });
  };

  const handleMouseEnter = (day: number, time: number) => {
    if (mode !== "select" || !isDragging) return;
    setCurrentCell({ day, time });
  };

  const handleMouseUp = () => {
    if (mode !== "select" || !isDragging || !startCell || !currentCell) return;

    // Apply changes
    const newSelection = internalSelection.map((d) => [...d]);
    const minDay = Math.min(startCell.day, currentCell.day);
    const maxDay = Math.max(startCell.day, currentCell.day);
    const minTime = Math.min(startCell.time, currentCell.time);
    const maxTime = Math.max(startCell.time, currentCell.time);

    // Determine toggle state based on the start cell
    // If start cell was selected, we deselect the range. If not, we select.
    // Actually, standard behavior is usually: if start cell is false, turn all to true. If true, turn all to false.
    const startValue = internalSelection[startCell.day][startCell.time];
    const newValue = !startValue;

    for (let d = minDay; d <= maxDay; d++) {
      for (let t = minTime; t <= maxTime; t++) {
        newSelection[d][t] = newValue;
      }
    }

    setInternalSelection(newSelection);
    if (onChange) onChange(newSelection);

    setIsDragging(false);
    setStartCell(null);
    setCurrentCell(null);
  };

  // Calculate background color
  const getCellStyle = (day: number, time: number) => {
    if (mode === "view") {
      const count = data ? data[day][time] : 0;
      const opacity = count === 0 ? 0 : count / maxMembers;
      return {
        backgroundColor:
          count === 0 ? "transparent" : `rgba(139, 92, 246, ${opacity})`, // violet-500
      };
    } else {
      // Select mode
      let isSelected = internalSelection[day][time];

      // Apply drag preview
      if (isDragging && startCell && currentCell) {
        const minDay = Math.min(startCell.day, currentCell.day);
        const maxDay = Math.max(startCell.day, currentCell.day);
        const minTime = Math.min(startCell.time, currentCell.time);
        const maxTime = Math.max(startCell.time, currentCell.time);

        if (
          day >= minDay &&
          day <= maxDay &&
          time >= minTime &&
          time <= maxTime
        ) {
          const startValue = internalSelection[startCell.day][startCell.time];
          isSelected = !startValue;
        }
      }

      return {
        backgroundColor: isSelected ? "#FBBF24" : "transparent", // amber-400 for "My" selection (yellowish in image)
      };
    }
  };

  return (
    <div
      className="w-full select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header Dates */}
      <div className="flex pl-10 mb-2">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className="flex-1 flex flex-col items-center justify-center text-xs text-gray-500"
          >
            <span>{DATES[i]}</span>
            <span>{day}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="relative border-t border-gray-200">
        {HOURS.map((hour, timeIndex) => (
          <div
            key={hour}
            className="flex h-8 border-b border-gray-100 border-dashed"
          >
            {/* Time Label */}
            <div className="w-10 -mt-2 text-[10px] text-gray-400 text-right pr-2">
              {hour}:00
            </div>
            {/* Cells */}
            {DAYS.map((_, dayIndex) => (
              <div
                key={`${dayIndex}-${timeIndex}`}
                className="flex-1 border-r border-gray-100 border-dashed last:border-r-0 cursor-pointer transition-colors duration-75"
                style={getCellStyle(dayIndex, timeIndex)}
                onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex)}
              />
            ))}
          </div>
        ))}
        {/* Last time label for 24:00 */}
        <div className="flex">
          <div className="w-10 -mt-2 text-[10px] text-gray-400 text-right pr-2">
            24:00
          </div>
        </div>
      </div>
    </div>
  );
};
