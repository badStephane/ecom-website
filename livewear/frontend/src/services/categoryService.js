import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/categories`);
    if (response.data.success || response.status === 200) {
      return response.data.categories || response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch products by category
export const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/products?category=${categoryId}`
    );
    if (response.data.success) {
      return response.data.products;
    }
    return [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// Fetch all products
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/products`);
    if (response.data.success) {
      return response.data.products;
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
