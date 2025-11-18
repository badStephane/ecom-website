/**
 * Application Constants
 */

export const APP_CONSTANTS = {
  // Currency settings
  CURRENCY: {
    CODE: "XOF", // Franc CFA
    SYMBOL: "XOF ",
    NAME: "Franc CFA",
  },

  // Delivery and shipping
  DELIVERY_FEE: 10,

  // Order status
  ORDER_STATUS: {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
  },

  // User roles
  ROLES: {
    ADMIN: "admin",
    USER: "user",
    CUSTOMER: "customer",
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },

  // File upload limits
  FILE_UPLOAD: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_FORMATS: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
};

export default APP_CONSTANTS;
