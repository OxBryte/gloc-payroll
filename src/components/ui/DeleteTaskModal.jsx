import React from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { useDeleteTask } from "../hooks/useTasks";

export default function DeleteTaskModal({ task, setIsOpen }) {
  const { deleteTaskFn, isPending } = useDeleteTask();

  const handleDelete = async () => {
    try {
      await deleteTaskFn(task._id || task.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
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
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Delete Task</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-900">{task.title}</p>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
