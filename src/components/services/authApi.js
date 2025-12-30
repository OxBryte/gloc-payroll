import axios from "axios";
import { getCookie } from "../lib/utils";

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

export async function getCurrentUser() {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    const { data } = await axios.get(`${apiURL}auth/me`, {
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

export async function forgetPassword(body) {
  try {
    const { data } = await axios.post(`${apiURL}auth/forgot-password`, body);
    return data;
  } catch (error) {
    console.error("Error during forget password:", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred during forget password"
    );
  }
}

export async function resetPassword(body) {
  try {
    const { data } = await axios.post(`${apiURL}auth/reset-password`, body);
    return data;
  } catch (error) {
    console.error("Error during reset password:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred during reset password"
    );
  }
}

export async function resendVerification(body) {
  try {
    const { data } = await axios.post(
      `${apiURL}auth/resend-verification`,
      body
    );
    return data;
  } catch (error) {
    console.error("Error during resend verification", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred during resend verification"
    );
  }
}

export async function updateUser(body) {
  try {
    // Get token from cookies
    const token = getCookie("token"); // or whatever your cookie name is

    // Check if body is FormData (for file uploads)
    const isFormData = body instanceof FormData;
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Only set Content-Type for non-FormData requests
    // FormData sets its own Content-Type with boundary
    if (!isFormData) {
      config.headers["Content-Type"] = "application/json";
    }

    const { data } = await axios.put(`${apiURL}auth/profile`, body, config);
    return data;
  } catch (error) {
    console.error("Error during update user:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred during update user"
    );
  }
}

// 2FA Functions
export async function get2FAStatus() {
  try {
    const token = getCookie("token");
    const { data } = await axios.get(`${apiURL}auth/2fa/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error getting 2FA status:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while getting 2FA status"
    );
  }
}

export async function enable2FA() {
  try {
    const token = getCookie("token");
    const { data } = await axios.post(
      `${apiURL}auth/2fa/enable`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while enabling 2FA"
    );
  }
}

export async function verify2FASetup(code) {
  try {
    const token = getCookie("token");
    const { data } = await axios.post(
      `${apiURL}auth/2fa/verify-setup`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error verifying 2FA setup:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while verifying 2FA"
    );
  }
}

export async function disable2FA(code) {
  try {
    const token = getCookie("token");
    const { data } = await axios.post(
      `${apiURL}auth/2fa/disable`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while disabling 2FA"
    );
  }
}
