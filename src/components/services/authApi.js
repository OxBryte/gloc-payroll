import axios from "axios";
import { getCookie } from "../lib/utils";

const apiURL = import.meta.env.VITE_API_URL;

// ... existing functions ...

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
