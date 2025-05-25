import React from "react";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { PiReceipt, PiUsersThreeLight } from "react-icons/pi";
import { RiAdminLine, RiHome5Line } from "react-icons/ri";
import Tabbar from "../components/layouts/Tabbar";
import { useParams } from "react-router-dom";

const data = [
  {
    id: 1,
    name: "Overview",
    icon: <RiHome5Line size={22} />,
    link: "overview",
  },
  {
    id: 2,
    name: "Payroll",
    icon: <PiReceipt size={22} />,
    link: "payroll",
  },
  {
    id: 3,
    name: "Employees",
    icon: <PiUsersThreeLight size={22} />,
    link: "employees",
  },
  {
    id: 4,
    name: "Jobs",
    icon: <HiOutlineBriefcase size={22} />,
    link: "jobs",
  },
  {
    id: 5,
    name: "Admins",
    icon: <RiAdminLine size={22} />,
    link: "admins",
  },
];

export default function Workspace() {
  const { slug } = useParams();

  return (
    <div className="w-full space-y-5">
      <div className="space-y-6 w-full">
        <div className="w-full flex items-center justify-between gap-6">
          <h1 className="text-2xl font-semibold">Bright Team</h1>
        </div>
        <Tabbar slug={slug} data={data} />

        <div className="w-full">
          <div className="w-full min-h-[calc(100vh-300px)] bg-white rounded-lg p-6">
            {/* Content will be rendered here based on the selected tab */}
            <h2 className="text-xl font-semibold">
              Welcome to {slug} Workspace
            </h2>
            <p className="text-gray-500 mt-2">
              This is where you can manage your workspace details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
