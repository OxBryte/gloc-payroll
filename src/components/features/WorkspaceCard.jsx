import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { Link } from "react-router-dom";
import { truncate } from "../lib/utils";
import { useDeleteWorkspace } from "../hooks/useWorkspace";

export default function WorkspaceCard({ space }) {
  const [showOption, setShowOption] = useState(false);
  const optionsRef = useRef(null);

  const { deleteWorkspaceFn } = useDeleteWorkspace();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOption(false);
      }
    };

    if (showOption) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOption]);

  const handleKebabClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOption(!showOption);
  };

  const handleOptionClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();

    // Handle different actions
    switch (action) {
      case "edit":
        console.log("Edit clicked");
        break;
      case "delete":
        deleteWorkspaceFn(space?._id);
        console.log("Delete clicked");
        break;
      case "share":
        console.log("Share clicked");
        break;
      default:
        break;
    }

    setShowOption(false);
  };

  return (
    <div>
      <Link to={`/workspace/${space?.slug}/overview`}>
        <div className="w-full h-[320px] bg-white rounded-lg flex flex-col gap-5 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="flex w-full items-center justify-between gap-5">
            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden object-cover object-center">
              <img
                src={space?.logo}
                alt=""
                className="object-cover object-center"
              />
            </div>
            <div className="relative">
              <button
                className="cursor-pointer px-2 py-1"
                onClick={handleKebabClick}
              >
                <GoKebabHorizontal size={26} />
              </button>
              {showOption && (
                <div
                  ref={optionsRef}
                  className="absolute top-8 right-0 w-30 min-h-20 bg-gray-50 overflow-hidden rounded-lg"
                >
                  <div
                    className="p-3 w-full text-sm hover:bg-black/20 cursor-pointer"
                    onClick={(e) => handleOptionClick(e, "edit")}
                  >
                    Edit
                  </div>
                  <div
                    className="p-3 w-full text-sm hover:bg-black/20 cursor-pointer"
                    onClick={(e) => handleOptionClick(e, "delete")}
                  >
                    Delete
                  </div>
                  <div
                    className="p-3 w-full text-sm hover:bg-black/20 cursor-pointer"
                    onClick={(e) => handleOptionClick(e, "share")}
                  >
                    Share
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[20px] font-semibold">
              {space?.name}{" "}
              <span className="bg-c-color text-[10px] text-white px-2 py-1 font-medium capitalize rounded-full">
                {space?.myRole}
              </span>
            </p>
            <p className="text-gray-500 text-sm font-light">
              {truncate(space?.description, 100)}
            </p>
          </div>
          <hr className="border-black/10" />
          <div className="space-y-2">
            <p className="font-light text-xs">Admins/Staffs</p>
            {space?.admins?.length === 0 && (
              <p className="text-xs font-light text-gray-600">No admins yet</p>
            )}
            {space?.admins?.length > 0 && (
              <div className="flex items-center">
                {space?.admins.slice(0, 4).map((admin, index) => (
                  <div
                    key={admin?._id}
                    className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative"
                    style={{
                      marginLeft: index > 0 ? "-12px" : "0",
                      zIndex: space?.admins.length - index,
                    }}
                  >
                    <img
                      src={admin?.avatar || "/default-avatar.png"}
                      alt={admin?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {space?.admins.length > 4 && (
                  <div
                    className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                    style={{ marginLeft: "-8px", zIndex: 0 }}
                  >
                    +{space?.admins.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs">
              Created at: {moment(space?.createdAt).format("LLL")}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
