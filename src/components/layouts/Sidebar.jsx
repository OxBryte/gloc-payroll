import React from "react";
import { GoRocket } from "react-icons/go";
import { IoDiceOutline } from "react-icons/io5";
import { LuHandshake } from "react-icons/lu";
import { PiHeadphones, PiPokerChip, PiVolleyballLight } from "react-icons/pi";
import { RiHome5Line, RiSettingsLine } from "react-icons/ri";
import { Link, matchPath, useLocation } from "react-router-dom";

const data = [
  {
    id: 1,
    name: "Dashboard",
    icon: <RiHome5Line size={22} />,
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
    name: "Payroll",
    icon: <IoDiceOutline size={22} />,
    link: "/payroll",
  },
];

const data2 = [
  {
    id: 1,
    name: "Affiliate ",
    icon: <LuHandshake size={22} />,
    link: "/affiliate",
  },
  {
    id: 2,
    name: "Settings",
    icon: <RiSettingsLine size={22} />,
    link: "/settings",
  },
  {
    id: 3,
    name: "live Support",
    icon: <PiHeadphones size={22} />,
    link: "/live-support",
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="hidden md:block text-white">
      <div className="bg-c-bg w-[16rem] sticky top-0 border-r border-r-white/10 h-screen">
        <div className="w-full space-y-4">
          <div className="py-5 px-3 flex items-center gap-2 border-b border-b-white/10 h-[85.12px]">
            <div
              className={`w-full h-full gap-2 rounded-lg px-3 py-3 font-light`}
            >
              Look up
            </div>
            {/* <div
              onClick={() => setSelectTab("Sport")}
              className={`w-full h-full gap-2 rounded-lg px-3 py-3 flex items-center justify-center text-sm font-light cursor-pointer ${
                selectTab === "Sport" ? "bg-c-color" : "bg-c-bg-2"
              }`}
            >
              <PiVolleyballLight size={22} />
              Sport
            </div> */}
          </div>

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
