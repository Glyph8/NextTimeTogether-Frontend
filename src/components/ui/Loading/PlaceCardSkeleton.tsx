
import React from "react";

export const PlaceCardSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="mt-2 w-full h-10 bg-gray-200 rounded-lg"></div>
    </div>
  );
};