import axios from "axios";
import { getCookie } from "../lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get all tasks
 * @returns {Promise} Response with tasks array
 */
export const getTasks = async () => {
  const response = await api.get("/api/tasks");
  return response.data;
};

/**
 * Get a single task by ID
 * @param {string} taskId - Task ID
 * @returns {Promise} Response with task object
 */
export const getTaskById = async (taskId) => {
  const response = await api.get(`/api/tasks/${taskId}`);
  return response.data;
};

/**
 * Create a new task
 * @param {Object} body - Task data
 * @param {string} body.title - Task title (required)
 * @param {string} body.description - Task description
 * @param {string} body.icon - Task icon (required)
 * @param {string} body.startDate - Start date in ISO format (required)
 * @param {string} body.completionDate - Completion date in ISO format (required)
 * @returns {Promise} Response with created task
 */
export const createTask = async (body) => {
  const response = await api.post("/api/tasks", body);
  return response.data;
};

/**
 * Update a task
 * @param {string} taskId - Task ID
 * @param {Object} body - Updated task data
 * @returns {Promise} Response with updated task
 */
export const updateTask = async (taskId, body) => {
  const response = await api.put(`/api/tasks/${taskId}`, body);
  return response.data;
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise} Response
 */
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/api/tasks/${taskId}`);
  return response.data;
};

