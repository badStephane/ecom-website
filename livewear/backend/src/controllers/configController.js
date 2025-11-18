import { APP_CONSTANTS } from "../config/constants.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * @route   GET /api/config
 * @desc    Get application configuration
 * @access  Public
 */
export const getAppConfig = async (req, res) => {
  try {
    const config = {
      success: true,
      currency: {
        code: process.env.CURRENCY_CODE || APP_CONSTANTS.CURRENCY.CODE,
        symbol: process.env.CURRENCY_SYMBOL || APP_CONSTANTS.CURRENCY.SYMBOL,
        name: APP_CONSTANTS.CURRENCY.NAME,
      },
      deliveryFee: process.env.DELIVERY_FEE || APP_CONSTANTS.DELIVERY_FEE,
      appName: "Livewear",
      version: "1.0.0",
    };

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getAppConfig };
