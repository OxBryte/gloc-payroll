import React from "react";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { PiReceipt, PiUsersThreeLight } from "react-icons/pi";
import { RiAdminLine, RiHome5Line } from "react-icons/ri";
import Tabbar from "../components/layouts/Tabbar";
import { useParams } from "react-router-dom";
import Overview from "../components/features/workspace/Overview";
import Payroll from "../components/features/workspace/Payroll";
import Employees from "../components/features/workspace/Employees";
import { useGetSingleWorkspace } from "../components/hooks/useWorkspace";

const data = [
  {
    id: 1,
    name: "Overview",
    icon: <RiHome5Line size={22} />,
    link: "overview",
    content: <Overview />,
  },
  {
    id: 2,
    name: "Payroll",
    icon: <PiReceipt size={22} />,
    link: "payroll",
    content: <Payroll />,
  },
  {
    id: 3,
    name: "Employees",
    icon: <PiUsersThreeLight size={22} />,
    link: "employees",
    content: <Employees />,
  },
  {
    id: 4,
    name: "Jobs",
    icon: <HiOutlineBriefcase size={22} />,
    link: "jobs",
    content: <Overview />,
  },
  {
    id: 5,
    name: "Admins",
    icon: <RiAdminLine size={22} />,
    link: "admins",
  },
];

export default function SingleWorkspace() {
  const { slug, id: activeLink } = useParams();

  const { singleWorkspace, isLoadingSingleWorkspace } =
    useGetSingleWorkspace(slug);
  console.log("Single Workspace Data:", singleWorkspace);

  if (isLoadingSingleWorkspace) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading workspace...</p>
      </div>
    );
  }

  // find the tab whose `link` matches the URL param
  const activeTab = data.find((tab) => tab.link === activeLink);

  return (
    <div className="w-full space-y-5">
      <div className="space-y-6 w-full">
        <div className="w-full flex items-center justify-between gap-6">
          <h1 className="text-2xl font-semibold">{singleWorkspace?.name}</h1>
        </div>
        <Tabbar slug={slug} data={data} />

        <div className="w-full">
          <div className="w-full min-h-[calc(100vh-300px)] bg-white rounded-lg p-6">
            {activeTab ? (
              activeTab.content
            ) : (
              <div className="text-center text-gray-500">
                Select a tab or check the URL.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
