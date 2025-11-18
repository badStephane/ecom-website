/**
 * API Response Normalizer
 * Normalizes different API response formats to consistent structures
 */

export const normalizeApiResponse = (response) => {
  if (!response || !response.data) return {};

  const data = response.data;

  return {
    products: data.products,
    categories: data.categories,
    orders: data.orders,
    users: data.users,
    product: data.product,
    category: data.category,
    order: data.order,
    user: data.user,
    pagination: data.pagination,
    token: data.token,
    message: data.message,
    success: data.success
  };
};

// Extract array from response based on expected type
export const extractDataFromResponse = (response, expectedType = 'items') => {
  if (!response || !response.data) return [];

  const data = response.data;
  const typeMap = {
    products: 'products',
    categories: 'categories',
    orders: 'orders',
    users: 'users'
  };

  const field = typeMap[expectedType] || expectedType;
  return data[field] || (Array.isArray(data) ? data : []);
};
