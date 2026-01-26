import axios from "axios";
import { getCookie } from "../lib/utils";

const apiURL = import.meta.env.VITE_API_URL;

/**
 * Create a new wallet
 * POST /wallet/create
 */
export async function createWallet(body) {
  try {
    const token = getCookie("token");

    const { data } = await axios.post(`${apiURL}wallet/create`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while creating wallet"
    );
  }
}

/**
 * Get all wallets for the authenticated user
 * GET /wallets
 */
export async function getWallets() {
  try {
    const token = getCookie("token");

    const { data } = await axios.get(`${apiURL}wallets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching wallets"
    );
  }
}

/**
 * Get transaction history for all wallets
 * GET /wallets/history
 */
export async function getWalletsHistory(params = {}) {
  try {
    const token = getCookie("token");

    const { data } = await axios.get(`${apiURL}wallets/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params, // Optional query params like ?limit=10&offset=0
    });
    return data;
  } catch (error) {
    console.error("Error fetching wallets history:", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching wallets history"
    );
  }
}

/**
 * Get a specific wallet by ID
 * GET /wallet/{id}
 */
export async function getWalletById(walletId) {
  try {
    const token = getCookie("token");

    const { data } = await axios.get(`${apiURL}wallet/${walletId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching wallet"
    );
  }
}

/**
 * Get balance for a specific wallet
 * GET /wallet/{id}/balance
 */
export async function getWalletBalance(walletId) {
  try {
    const token = getCookie("token");

    const { data } = await axios.get(`${apiURL}wallet/${walletId}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching wallet balance"
    );
  }
}

/**
 * Update wallet details
 * PUT /wallet/{id}
 */
export async function updateWallet(walletId, body) {
  try {
    const token = getCookie("token");

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

    const { data } = await axios.put(`${apiURL}wallet/${walletId}`, body, config);
    return data;
  } catch (error) {
    console.error("Error updating wallet:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while updating wallet"
    );
  }
}
