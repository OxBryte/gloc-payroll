import React from "react";
import { GoRocket } from "react-icons/go";
import { LuHandshake } from "react-icons/lu";
import { RiDashboardLine, RiSettingsLine } from "react-icons/ri";
import { Link, matchPath, useLocation } from "react-router-dom";
import { RxCaretSort } from "react-icons/rx";
import { Briefcase } from "lucide-react";

const data = [
  {
    id: 1,
    name: "Dashboard",
    icon: <RiDashboardLine size={22} />,
    link: "/",
  },
  {
    id: 2,
    name: "Workspace",
    icon: <GoRocket size={22} />,
    link: "workspace",
  },
  {
    id: 3,
    name: "Jobs (coming soon)",
    icon: <Briefcase size={22} />,
    link: "/jobs",
  },
];

const data2 = [
  {
    id: 1,
    name: "Subscription ",
    icon: <LuHandshake size={22} />,
    link: "/subscription",
  },
  {
    id: 2,
    name: "Settings",
    icon: <RiSettingsLine size={22} />,
    link: "/settings",
  },
  // {
  //   id: 3,
  //   name: "live Support",
  //   icon: <PiHeadphones size={22} />,
  //   link: "/live-support",
  // },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="hidden md:block text-white">
      <div className="bg-c-bg w-[16rem] sticky top-0 border-r border-r-white/10 h-screen">
        <div className="w-full space-y-2">
          <div className="py-5 px-3 flex items-center gap-2 border-b border-b-white/10 h-[85.12px]">
            <div
              className={`w-full h-full px-3 py-3 flex items-center justify-left`}
            >
              <img src="/glok-logo-3.svg" alt="" className="w-18" />
            </div>
          </div>
          {/* <div className="px-3">
            <div className="w-full p-2 border border-white/10 flex items-center justify-between gap-4 rounded-lg">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-lg bg-white/20"></div>
              <p className="text-sm font-light">Workspace</p>
              </div>
              <RxCaretSort />
            </div>
          </div> */}

          <div className="py-3 pr-3 flex flex-col gap-3 w-full border-b border-b-white/10">
            {data.map((item) => {
              const match = matchPath(
                { path: item.link, end: item.link === "/" },
                pathname
              );
              const isActive = Boolean(match);
              return (
                <Link to={item.link} key={item.id} className="flex">
                  {/* left indicator only if active */}
                  <div
                    className={`w-[5px] h-[50px] ${
                      isActive && "bg-c-color"
                    } rounded-r-lg`}
                  ></div>

                  <div
                    className={`flex items-center w-full h-[50px] px-3 ml-2 text-sm font-light cursor-pointer rounded-lg hover:opacity-60
                      ${isActive ? "bg-c-color text-white" : ""}`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="py-3 pr-3 flex flex-col gap-3 w-full border-b border-b-white/10">
            {data2.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link to={item.link} key={item.id} className="flex">
                  {/* left indicator only if active */}
                  <div
                    className={`w-[5px] h-[50px] ${
                      isActive && "bg-c-color"
                    } rounded-r-lg`}
                  ></div>

                  <div
                    className={`flex items-center w-full h-[50px] px-3 ml-2 text-sm font-light cursor-pointer rounded-lg hover:opacity-60
                      ${isActive ? "bg-c-color" : ""}`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
