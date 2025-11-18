import Product from "../models/Product.js";
import Category from "../models/Category.js";

// @route   GET /api/products
// @desc    Get all products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, featured } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (featured) filter.isFeatured = true;

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate("category")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        current: page,
        pages,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private
export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to create products" });
    }

    const { name, description, price, discountPrice, category, image, sizes, colors, stock } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      image,
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
    });

    await product.save();
    await product.populate("category");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update products" });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete products" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
