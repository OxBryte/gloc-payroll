import React, { useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { Link } from "react-router-dom";
import Drawer from "../ui/Drawer";
import { useGetWorkspace } from "../hooks/useWorkspace";
import moment from "moment";

export default function AllWorkspace() {
  const [isOpen, setIsOpen] = useState(false);
  const { workspace, isLoadingWorkspace } = useGetWorkspace();
  // console.log(workspace);

  return (
    <>
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-[24px]">Workspace</p>
          <button
            className="bg-c-bg-2 px-5 py-3 rounded-lg text-sm font-medium bg-c-color transition-colors cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            Create New Workspace
          </button>
        </div>
        {isLoadingWorkspace ? (
          <div className="w-full min-h-[320px] p-6 flex gap-3 flex-col items-center justify-center bg-white">
            <img src="loading.svg" alt="" className="w-30" />
            <p className="text-sm font-light">Loading workspace...</p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspace?.length === 0 && (
              <div className="w-full h-[320px] bg-white rounded-lg flex flex-col items-center justify-center gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                <p className="text-gray-500 text-sm font-light">
                  No workspace yet!
                </p>
                <button
                  className="bg-c-color hover:bg-c-bg px-6 py-2.5 text-white rounded-lg cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  Create Workspace
                </button>
              </div>
            )}
            {workspace?.map((space, index) => (
              <Link to="/workspace/bright-team/overview" key={index}>
                <div className="w-full h-[320px] bg-white rounded-lg flex flex-col gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
                  <div className="flex w-full items-center justify-between gap-5">
                    <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
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
                    {space.admins.length === 0 && (
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
            ))}
          </div>
        )}
      </div>
      {isOpen && <Drawer setIsOpen={setIsOpen} />}
    </>
  );
}
