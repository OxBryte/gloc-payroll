import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;

export async function signup(body) {
  try {
    const { data } = await axios.post(`${apiURL}auth/signup`, body);
    return data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred during signup"
    );
  }
}
