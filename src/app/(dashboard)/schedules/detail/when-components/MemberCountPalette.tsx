import React from "react";

export const MemberCountPalette = ({ maxCount = 5 }: { maxCount?: number }) => {
  const levels = Array.from({ length: maxCount + 1 }, (_, i) => i);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
      <span>0/0</span>
      <div className="flex rounded-sm overflow-hidden">
        {levels.map((level) => {
          // Using a purple color (e.g., #8B5CF6 for violet-500)
          // Opacity ranges from 0.1 (for 0) to 1 (for max) or similar logic
          // The image shows 0 as white/transparent.
          const opacity = level === 0 ? 0 : level / maxCount;
          return (
            <div
              key={level}
              className="w-8 h-4 border-r border-gray-100 last:border-r-0"
              style={{
                backgroundColor:
                  level === 0 ? "#FFFFFF" : `rgba(139, 92, 246, ${opacity})`, // violet-500
              }}
            />
          );
        })}
      </div>
      <span>
        {maxCount}/{maxCount}
      </span>
    </div>
  );
};
