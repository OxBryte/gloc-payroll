import React, { useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { PiGameController } from "react-icons/pi";

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    const container = document.getElementById("carousel-container");
    if (container) {
      const newPosition = Math.max(scrollPosition - 480, 0);
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("carousel-container");
    if (container) {
      const newPosition = scrollPosition + 480;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };
  return (
    <div className="w-full space-y-5">
      <div className="w-full flex gap-4">
        <div className="w-full h-[300px] bg-c-bg rounded-lg flex items-center justify-center"></div>
        <div className="w-full h-[300px] bg-c-bg rounded-lg flex items-center justify-center"></div>
      </div>
      <div className="space-y-3 w-full">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PiGameController size={26} className="text-c-color" />
            <p className="text-lg font-light text-white">Games</p>
          </div>
          <div className="space-x-4 flex">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-c-bg flex items-center justify-center cursor-pointer"
            >
              <BiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-c-bg flex items-center justify-center cursor-pointer"
            >
              <BiChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div
          className="flex gap-4 w-full overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          id="carousel-container"
        >
          <div className="w-[230px] h-[280px] shrink-0 bg-c-bg rounded-lg shadow-lg flex items-center justify-center">
            1
          </div>
          <div className="w-[230px] h-[280px] shrink-0 bg-c-bg rounded-lg shadow-lg flex items-center justify-center">
            2
          </div>
          <div className="w-[230px] h-[280px] shrink-0 bg-c-bg rounded-lg shadow-lg flex items-center justify-center">
            3
          </div>
          <div className="w-[230px] h-[280px] shrink-0 bg-c-bg rounded-lg shadow-lg flex items-center justify-center">
            4
          </div>
          <div className="w-[230px] h-[280px] shrink-0 bg-c-bg rounded-lg shadow-lg flex items-center justify-center">
            5
          </div>
          <div className="w-[230px] h-[280px] shrink-0 bg-c-bg rounded-lg shadow-lg flex items-center justify-center">
            6
          </div>
          <div className="w-[230px] h-[280px] shrink-0 bg-c-bg rounded-lg shadow-lg flex items-center justify-center">
            7
          </div>
        </div>
      </div>
    </div>
  );
}
