import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useGetTasks, useUpdateTask } from "../components/hooks/useTasks";
import TaskCard from "../components/features/tasks/TaskCard";
import CreateTaskModal from "../components/ui/CreateTaskModal";
import EditTaskModal from "../components/ui/EditTaskModal";
import DeleteTaskModal from "../components/ui/DeleteTaskModal";
import { Loader2 } from "lucide-react";
import { TbLoader } from "react-icons/tb";

const COLUMNS = [
  { id: "pending", label: "Pending" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Completed" },
  { id: "archived", label: "Archived" },
];

export default function Tasks() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const { tasks, isLoading, error } = useGetTasks();
  const { updateTaskFn } = useUpdateTask();

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return {
        pending: [],
        ongoing: [],
        completed: [],
        archived: [],
      };
    }

    return {
      pending: tasks.filter(
        (task) => !task.status || task.status === "pending"
      ),
      ongoing: tasks.filter((task) => task.status === "ongoing"),
      completed: tasks.filter((task) => task.status === "completed"),
      archived: tasks.filter((task) => task.status === "archived"),
    };
  }, [tasks]);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", task._id || task.id);
    // Add visual feedback
    e.currentTarget.style.opacity = "0.5";
    e.currentTarget.style.transform = "rotate(2deg)";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.transform = "rotate(0deg)";
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask) return;

    // Determine current status (default to "pending" if no status)
    const currentStatus = draggedTask.status || "pending";

    // Don't update if dropped in the same column
    if (targetStatus === null && !currentStatus) {
      setDraggedTask(null);
      return;
    }
    if (currentStatus === targetStatus) {
      setDraggedTask(null);
      return;
    }

    // Update task status (null for "pending" means no status, which is "pending")
    const newStatus = targetStatus === null ? "pending" : targetStatus;

    // Update task status
    try {
      await updateTaskFn({
        taskId: draggedTask._id || draggedTask.id,
        body: { status: newStatus },
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }

    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-4">
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
      <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-c-color" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">Error loading tasks: {error.message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((column) => {
              const columnTasks = tasksByStatus[column.id] || [];
              const isDraggingOver = dragOverColumn === column.id;

              return (
                <div
                  key={column.id}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) =>
                    handleDrop(e, column.id === "pending" ? null : column.id)
                  }
                  className={`
                    min-h-[400px] rounded-lg transition-all duration-300 ease-in-out
                    ${
                      isDraggingOver
                        ? "bg-c-color/10 ring-2 ring-c-color/50 scale-[1.02]"
                        : "bg-gray-50"
                    }
                  `}
                >
                  {/* Column Header */}
                  <div className="sticky top-0 bg-white rounded-lg px-4 py-2.5 border border-gray-200 z-10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-700 text-sm">
                        {column.label}
                      </h3>
                      <div className="text-white flex items-center gap-1.5 bg-c-color px-2.5 py-2 rounded-full">
                        <TbLoader className="w-4 h-4" />
                        <p className=" text-xs">{columnTasks.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="p-3 space-y-2 min-h-[300px]">
                    {columnTasks.length > 0 ? (
                      columnTasks.map((task) => (
                        <div
                          key={task._id || task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          className="transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-move active:scale-[0.98]"
                        >
                          <TaskCard
                            task={task}
                            onEdit={() => setEditingTask(task)}
                            onDelete={() => setDeletingTask(task)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
                        {column.id === "pending"
                          ? "No tasks yet"
                          : `No ${column.label.toLowerCase()} tasks`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
