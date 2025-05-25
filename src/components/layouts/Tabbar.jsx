import React from "react";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { PiReceipt, PiUsersThreeLight } from "react-icons/pi";
import { RiAdminLine, RiHome5Line } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";

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

export default function Tabbar(slug) {
  const { pathname } = useLocation();

  return (
    <div className="hidden md:block">
      <div className="w-full bg-gray-100 rounded-lg px-4 py-2.5 flex gap-3 w-full border-b border-b-white/10">
        {data.map((item) => {
          const isActive = pathname === item.link;
          return (
            <NavLink
              to={`/workapce/${slug}/${item.link}`}
              key={item.id}
              className="space-y-3"
            >
              {/* left indicator only if active */}
              <div
                aria-disabled={item.id === 4}
                onClick={(e) => {
                  if (item.id === 4) {
                    e.preventDefault();
                  }
                }}
                className={`flex items-center w-full h-[44px] px-3 gap-2 text-sm font-light cursor-pointer rounded-lg hover:opacity-60
                      ${isActive ? "bg-c-color text-white" : ""}`}
              >
                {item.icon}
                <span className="">
                  {item.name} {item.id === 4 && "(Coimg soon)"}{" "}
                </span>
              </div>
              {/* <div
                className={`w-full h-[5px] ${
                  isActive && "bg-c-color"
                } rounded-full transition-all duration-300`}
              ></div> */}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
