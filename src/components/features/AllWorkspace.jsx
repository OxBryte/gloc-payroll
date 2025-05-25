import React, { useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { Link } from "react-router-dom";
import Drawer from "../ui/Drawer";

export default function AllWorkspace() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-[24px]">Workspace</p>
          <button className="bg-c-bg-2 px-5 py-3 rounded-lg text-sm font-medium bg-c-color transition-colors" onClick={() => setIsOpen(true)}>
            Create New Workspace
          </button>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/workspace/bright-team/overview">
            <div className="w-full h-[300px] bg-white rounded-lg flex flex-col gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
              <div className="flex w-full items-center justify-between gap-5">
                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                <button className="">
                  <GoKebabHorizontal size={26} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[20px] font-semibold">Bright Team</p>
                <p className="text-gray-500 text-sm font-light">
                  This is a description of the workspace. It can be a brief
                  overview or any other relevant information...
                </p>
              </div>
              <hr className="border-black/10" />
              <div className="space-y-2">
                <p className="font-light text-xs">Members/Staffs</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <p className="text-gray-500 text-sm">+2 more</p>
                </div>
              </div>
              {/* <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">Last updated: 2 days ago</p>
              </div> */}
            </div>
          </Link>
          <Link to="/workspace/bright-team/overview">
            <div className="w-full h-[300px] bg-white rounded-lg flex flex-col gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
              <div className="flex w-full items-center justify-between gap-5">
                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                <button className="">
                  <GoKebabHorizontal size={26} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[20px] font-semibold">Workspace Name</p>
                <p className="text-gray-500 text-sm font-light">
                  This is a description of the workspace. It can be a brief
                  overview or any other relevant information...
                </p>
              </div>
              <hr className="border-black/10" />
              <div className="space-y-2">
                <p className="font-light text-xs">Members/Staffs</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <p className="text-gray-500 text-sm">+2 more</p>
                </div>
              </div>
              {/* <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">Last updated: 2 days ago</p>
              </div> */}
            </div>
          </Link>
          <Link to="/workspace/bright-team/overview">
            <div className="w-full h-[300px] bg-white rounded-lg flex flex-col gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
              <div className="flex w-full items-center justify-between gap-5">
                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                <button className="">
                  <GoKebabHorizontal size={26} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[20px] font-semibold">Workspace Name</p>
                <p className="text-gray-500 text-sm font-light">
                  This is a description of the workspace. It can be a brief
                  overview or any other relevant information...
                </p>
              </div>
              <hr className="border-black/10" />
              <div className="space-y-2">
                <p className="font-light text-xs">Members/Staffs</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <p className="text-gray-500 text-sm">+2 more</p>
                </div>
              </div>
              {/* <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">Last updated: 2 days ago</p>
              </div> */}
            </div>
          </Link>
          <Link to="/workspace/bright-team/overview">
            <div className="w-full h-[300px] bg-white rounded-lg flex flex-col gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
              <div className="flex w-full items-center justify-between gap-5">
                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                <button className="">
                  <GoKebabHorizontal size={26} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[20px] font-semibold">Workspace Name</p>
                <p className="text-gray-500 text-sm font-light">
                  This is a description of the workspace. It can be a brief
                  overview or any other relevant information...
                </p>
              </div>
              <hr className="border-black/10" />
              <div className="space-y-2">
                <p className="font-light text-xs">Members/Staffs</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <p className="text-gray-500 text-sm">+2 more</p>
                </div>
              </div>
              {/* <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">Last updated: 2 days ago</p>
              </div> */}
            </div>
          </Link>
          <Link to="/workspace/bright-team/overview">
            <div className="w-full h-[300px] bg-white rounded-lg flex flex-col gap-4 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
              <div className="flex w-full items-center justify-between gap-5">
                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                <button className="">
                  <GoKebabHorizontal size={26} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[20px] font-semibold">Workspace Name</p>
                <p className="text-gray-500 text-sm font-light">
                  This is a description of the workspace. It can be a brief
                  overview or any other relevant information...
                </p>
              </div>
              <hr className="border-black/10" />
              <div className="space-y-2">
                <p className="font-light text-xs">Members/Staffs</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <p className="text-gray-500 text-sm">+2 more</p>
                </div>
              </div>
              {/* <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">Last updated: 2 days ago</p>
              </div> */}
            </div>
          </Link>
        </div>
      </div>
      {isOpen && <Drawer setIsOpen={setIsOpen} />}
    </>
  );
}
