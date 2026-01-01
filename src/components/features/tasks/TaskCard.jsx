import React from "react";
import { Edit, Trash2, Calendar, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { truncate } from "../../lib/utils";

export default function TaskCard({ task, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full transition-all duration-200">
      <div className="flex flex-col justify-between w-full">
        {/* Left side - Content */}
        <div className="flex items-start gap-3 p-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="relative w-5 h-5 bg-c-color/30 rounded-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-c-color rounded-full"></div>
              </div>
              <span className="text-sm font-normal text-gray-500">
                {formatDate(task.startDate)}
              </span>
            </div>
            <h3 className="font-medium text-md text-gray-900 capitalize">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm w-full font-light">
              {truncate(task.description, 30)}
            </p>
          </div>
        </div>

        <div className="bg-gray-200 w-full h-[1px] mx-auto" />
        <div className="w-full p-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 text-gray-600 hover:text-c-color border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Edit task"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-gray-600 hover:text-red-500 border border-gray-200 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="w-3 h-3 rounded-full bg-c-color"></div>
        </div>
      </div>
    </div>
  );
}
