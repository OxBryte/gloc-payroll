import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

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

export async function verifyEmail(body) {
  try {
    const { data } = await axios.post(`${apiURL}auth/verify-email`, body);
    return data;
  } catch (error) {
    console.error("Error during verification:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred during verification"
    );
  }
}

export async function login(body) {
  try {
    const { data } = await axios.post(`${apiURL}auth/login`, body);
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred during login"
    );
  }
}
