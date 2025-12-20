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

