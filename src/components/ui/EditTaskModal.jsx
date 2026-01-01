import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { useUpdateTask } from "../hooks/useTasks";
import IconPicker from "./IconPicker";
import * as LucideIcons from "lucide-react";

export default function EditTaskModal({ task, setIsOpen }) {
  const { updateTaskFn, isPending } = useUpdateTask();
  const [selectedIcon, setSelectedIcon] = useState("CheckCircle2");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const iconName = watch("icon") || selectedIcon;
  const IconComponent = LucideIcons[iconName] || LucideIcons.CheckCircle2;

  // Pre-populate form with task data
  useEffect(() => {
    if (task) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        } catch {
          return "";
        }
      };

      const icon = task.icon || "CheckCircle2";
      setSelectedIcon(icon);
      reset({
        title: task.title || "",
        description: task.description || "",
        icon: icon,
        startDate: formatDateForInput(task.startDate),
        completionDate: formatDateForInput(task.completionDate),
      });
    }
  }, [task, reset]);

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    setValue("icon", iconName);
  };

  const onSubmit = async (data) => {
    try {
      await updateTaskFn({ taskId: task._id || task.id, body: data });
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              {...register("title", { required: "Title is required" })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
            />
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title.message}</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Description
            </label>
            <textarea
              placeholder="Enter task description"
              rows={4}
              {...register("description")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none resize-none"
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Icon <span className="text-red-500">*</span>
            </label>
            <select
              {...register("icon", { required: "Icon is required" })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none bg-white"
            >
              {ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.icon && (
              <span className="text-xs text-red-500">{errors.icon.message}</span>
            )}
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("startDate", { required: "Start date is required" })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              />
              {errors.startDate && (
                <span className="text-xs text-red-500">
                  {errors.startDate.message}
                </span>
              )}
            </div>

            {/* Completion Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Completion Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("completionDate", {
                  required: "Completion date is required",
                })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              />
              {errors.completionDate && (
                <span className="text-xs text-red-500">
                  {errors.completionDate.message}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

