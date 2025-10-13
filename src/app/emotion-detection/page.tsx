"use client";

import React from "react";

const EmotionDetection = () => {
  return (
    <div className="flex flex-col items-center h-full justify-center gap-6 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 size-full">
        {/* Camera Section */}
        <div className="flex-3 size-full flex justify-center items-center">
          <div className="bg-gray-200 aspect-square h-[75%] rounded-lg flex items-center justify-center">
            <p>Camera will go here</p>
          </div>
        </div>

        {/* Predictions Section */}
        <div className="flex-1 w-full sm:h-full">
          <div className="bg-slate-50 h-full rounded-lg outline-1 flex items-center justify-center">
            <p>Predictions will go here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetection;
