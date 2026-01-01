import React, { useState } from "react";
import { Plus, User } from "lucide-react";
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
  const { tasks, isLoading, error } = useGetTasks();

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-sm flex items-center gap-2 px-4 py-2 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-c-color" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">Error loading tasks: {error.message}</p>
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
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
            <p className="text-gray-500 text-lg">No tasks yet. Create your first task!</p>
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

