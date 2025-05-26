import axios from "axios";
import { getCookie } from "../lib/utils";

const apiURL = import.meta.env.VITE_API_URL;

export async function getWorkspace() {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const { data } = await axios.get(`${apiURL}workspace/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during while fetching user data", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching user data"
    );
  }
}
export async function getSingleWorkspace(id) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const { data } = await axios.get(`${apiURL}workspace/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during while fetching user data", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching user data"
    );
  }
}
