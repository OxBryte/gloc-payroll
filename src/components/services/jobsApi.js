import axios from "axios";
import { getCookie } from "../lib/utils";

const apiURL = import.meta.env.VITE_API_URL;

export async function createJob(body) {
  try {
    // Get token from cookies
    const token = getCookie("token");

    const response = await axios.post(`${apiURL}jobs/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during while creating a job", error);
    throw new Error(
      error.response?.data?.error || "An error occurred while creating the job."
    );
  }
}

export async function getJobs(workspaceId) {
  try {
    // Get token from cookies
    const token = getCookie("token");

    const { data } = await axios.get(`${apiURL}jobs/my/jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during while fetching jobs data", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching jobs data"
    );
  }
}

export async function getAllJobs(params) {
  try {
    // Get token from cookies
    // const token = getCookie("token"); // Assuming public endpoint or auth optional, but if required:

    const { data } = await axios.get(`${apiURL}jobs`, {
      params, // Axios handles passing params object as query string: ?page=1&limit=10...
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    return data;
  } catch (error) {
    console.error("Error during while fetching all jobs", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching jobs"
    );
  }
}

export async function getJobById(jobId) {
  try {
    // Get token from cookies (optional for public jobs)
    const token = getCookie("token");

    const config = {};
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const { data } = await axios.get(`${apiURL}jobs/${jobId}`, config);
    return data;
  } catch (error) {
    console.error("Error while fetching job", error);
    throw new Error(
      error.response?.data?.error || "An error occurred while fetching the job."
    );
  }
}

export async function updateJob(jobId, body) {
  try {
    // Get token from cookies
    const token = getCookie("token");

    const response = await axios.put(`${apiURL}jobs/${jobId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while updating job", error);
    throw new Error(
      error.response?.data?.error || "An error occurred while updating the job."
    );
  }
}

export async function deleteJob(jobId) {
  try {
    // Get token from cookies
    const token = getCookie("token");

    const response = await axios.delete(`${apiURL}jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while deleting job", error);
    throw new Error(
      error.response?.data?.error || "An error occurred while deleting the job."
    );
  }
}

export async function toggleJobStatus(jobId) {
  try {
    // Get token from cookies
    const token = getCookie("token");

    const response = await axios.patch(
      `${apiURL}jobs/${jobId}/toggle-status`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while toggling job status", error);
    throw new Error(
      error.response?.data?.error ||
        "An error occurred while toggling the job status."
    );
  }
}

export async function applyForJob(formData) {
  try {
    // Get token from cookies (optional - applications might be public)
    const token = getCookie("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(`${apiURL}jobs/apply`, formData, config);
    return response.data;
  } catch (error) {
    console.error("Error while applying for job", error);
    throw new Error(
      error.response?.data?.error ||
        "An error occurred while submitting your application."
    );
  }
}
