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
