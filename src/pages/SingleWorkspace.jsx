import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { PiReceipt, PiUsersThreeLight } from "react-icons/pi";
import { RiAdminLine, RiHome5Line } from "react-icons/ri";
import { ChevronLeft, Edit2, Upload, Check, X, Loader2 } from "lucide-react";
import Tabbar from "../components/layouts/Tabbar";
import Overview from "../components/features/workspace/Overview";
import Payroll from "../components/features/workspace/Payroll";
import Employees from "../components/features/workspace/Employees";
import Admins from "../components/features/workspace/Admins";
import Jobs from "../components/features/workspace/Jobs";
import {
  useGetSingleWorkspace,
  useUpdateWorkspace,
} from "../components/hooks/useWorkspace";
import CreateJob from "../components/features/workspace/CreateJob";

export default function SingleWorkspace() {
  const { slug, id: activeLink } = useParams();
  const location = useLocation();
  const createIt = location.search;

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

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
      content: createIt ? <CreateJob /> : <Jobs />,
    },
    {
      id: 5,
      name: "Admins",
      icon: <RiAdminLine size={22} />,
      link: "admins",
      content: <Admins />,
    },
  ];

  const { singleWorkspace, isLoadingSingleWorkspace, error } =
    useGetSingleWorkspace(slug);

  const { updateWorkspaceFn, isUpdating } = useUpdateWorkspace();

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      await updateWorkspaceFn({ id: singleWorkspace?.id, body: formData });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim() || newName === singleWorkspace?.name) {
      setIsEditingName(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", newName);

    try {
      await updateWorkspaceFn({ id: singleWorkspace?.id, body: formData });
      setIsEditingName(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoadingSingleWorkspace) {
    return (
      <div className="w-full h-full min-h-[70dvh] flex flex-col gap-3 items-center justify-center">
        <img src="/loading.svg" alt="" className="w-30" />
        <p className="text-gray-500">Loading workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[70dvh] flex flex-col gap-3 items-center justify-center">
        <img src="/error.svg" alt="" className="w-36" />
        <p className="text-gray-500 text-center max-w-[230px]">
          {error?.message}
        </p>
      </div>
    );
  }

  // find the tab whose `link` matches the URL param
  const activeTab = data.find((tab) => tab.link === activeLink);

  return (
    <div className="w-full space-y-5">
      <div className="space-y-6 w-full">
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-fit border border-gray-200 p-3 rounded-lg hover:bg-white cursor-pointer"
              onClick={() => window.history.back()}
            >
              <ChevronLeft size={20} />
            </div>

            {/* Logo with Upload Overlay */}
            <div className="relative group overflow-hidden rounded-lg w-12 h-12 border border-gray-100">
              <img
                src={singleWorkspace?.logo}
                alt=""
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload size={16} className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUpdating}
                />
              </label>
              {isUpdating && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-c-color" />
                </div>
              )}
            </div>

            {/* Name Editing Section */}
            <div className="flex items-center gap-2 flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full max-w-md">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 text-2xl font-semibold bg-gray-50 border-b-2 border-c-color outline-none px-1 py-0.5"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNameUpdate();
                      if (e.key === "Escape") setIsEditingName(false);
                    }}
                  />
                  <button
                    onClick={handleNameUpdate}
                    disabled={isUpdating}
                    className="p-1 hover:bg-green-50 rounded text-green-600 transition-colors"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1 hover:bg-red-50 rounded text-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold">
                    {singleWorkspace?.name}
                  </h1>
                  <div
                    className="text-gray-400 hover:text-c-color cursor-pointer transition-colors p-1"
                    onClick={() => {
                      setNewName(singleWorkspace?.name || "");
                      setIsEditingName(true);
                    }}
                  >
                    <Edit2 size={16} />
                  </div>
                </>
              )}
            </div>
          </div>
          <p>{singleWorkspace?.description}</p>
          <div className="space-y-2">
            <p className="text-xs text-gray-700">Created by</p>
            <div className="flex items-center gap-2">
              <img
                src={singleWorkspace?.userId?.avatar}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">
                {singleWorkspace?.userId?.fullName}
              </span>
            </div>
          </div>
        </div>
        <Tabbar slug={slug} data={data} />

        <div className="w-full">
          <div className="w-full min-h-[calc(100vh-300px)] bg-white rounded-lg p-3 md:p-6">
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
