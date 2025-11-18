import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetch application configuration from backend
 */
export const fetchAppConfig = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/config`);
    if (response.data && response.data.success) {
      return response.data;
    }
    // Return default config if API fails
    return {
      currency: { code: "XOF", symbol: "XOF ", name: "Franc CFA" },
      deliveryFee: 10,
    };
  } catch (error) {
    console.error("Error fetching app config:", error);
    // Return default config on error
    return {
      currency: { code: "XOF", symbol: "XOF ", name: "Franc CFA" },
      deliveryFee: 10,
    };
  }
};

export default { fetchAppConfig };
