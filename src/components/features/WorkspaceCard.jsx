import moment from "moment";
import React from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { Link } from "react-router-dom";

export default function WorkspaceCard({ space }) {
  return (
    <div>
      <Link to="/workspace/bright-team/overview">
        <div className="w-full h-[320px] bg-white rounded-lg flex flex-col gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="flex w-full items-center justify-between gap-5">
            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
              <img src={space.logo} alt="" />
            </div>
            <button className="">
              <GoKebabHorizontal size={26} />
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-[20px] font-semibold">{space.name}</p>
            <p className="text-gray-500 text-sm font-light">
              {space.description}
            </p>
          </div>
          <hr className="border-black/10" />
          <div className="space-y-2">
            <p className="font-light text-xs">Members/Staffs</p>
            {space.admins?.length === 0 && (
              <p className="text-sm font-light">No admins yet</p>
            )}
            {/* <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <p className="text-gray-500 text-sm">+2 more</p>
                    </div> */}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs">
              Created at: {moment(space.cratedAt).format("LLL")}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
