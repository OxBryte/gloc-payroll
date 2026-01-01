import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useGetTasks } from "../components/hooks/useTasks";
import TaskCard from "../components/features/tasks/TaskCard";
import CreateTaskModal from "../components/ui/CreateTaskModal";
import EditTaskModal from "../components/ui/EditTaskModal";
import DeleteTaskModal from "../components/ui/DeleteTaskModal";
import { Loader2 } from "lucide-react";

export default function Tasks() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const { tasks, isLoading, error } = useGetTasks();

  // Filter tasks based on active tab
  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const now = new Date();

    switch (activeTab) {
      case "opened":
        // Tasks where completionDate is in the future (not yet completed)
        return tasks.filter((task) => {
          if (!task.completionDate) return false;
          return new Date(task.completionDate) > now;
        });
      case "closed":
        // Tasks where completionDate is in the past (completed)
        return tasks.filter((task) => {
          if (!task.completionDate) return false;
          return new Date(task.completionDate) <= now;
        });
      case "archived":
        // Tasks with status "archived" or isArchived flag
        return tasks.filter((task) => {
          return task.status === "archived" || task.isArchived === true;
        });
      case "all":
      default:
        return tasks;
    }
  }, [tasks, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[720px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/gloc-logo.svg" alt="Logo" className="w-8" />
            </div>

            {/* Right side - Create button and Profile */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-sm flex items-center gap-2 px-3 py-2 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f0f0f] to-c-color-sec cursor-pointer hover:opacity-90 transition-opacity shadow-sm"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8">
        {/* Tabs */}
        <div className="mb-4">
          <div className="flex gap-1 items-center">
            <button
              key="all"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "all"
                  ? "text-c-color"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All
              <span className="text-[xs] text-white bg-c-color rounded-full px-2 py-1 ml-2">
                {tasks?.length || 0}
              </span>
            </button>
            <div className="w-px h-4 bg-gray-400"></div>
            {["opened", "closed", "archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors cursor-pointer
                  ${
                    activeTab === tab
                      ? "text-c-color"
                      : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="text-xs text-white bg-c-color rounded-full px-2 py-1 ml-2">
                  {filteredTasks?.filter((task) => task.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-c-color" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">Error loading tasks: {error.message}</p>
          </div>
        ) : filteredTasks && filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id || task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => setDeletingTask(task)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {activeTab === "all"
                ? "No tasks yet. Create your first task!"
                : `No ${activeTab} tasks found.`}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateTaskModal setIsOpen={setIsCreateModalOpen} />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          setIsOpen={() => setEditingTask(null)}
        />
      )}
      {deletingTask && (
        <DeleteTaskModal
          task={deletingTask}
          setIsOpen={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}
