import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, address, shippingAddress, amount } = req.body;

    // Support both 'items' and 'address' or 'shippingAddress'
    const orderItems = items || [];
    const finalAddress = address || shippingAddress;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No items in order" 
      });
    }

    if (!finalAddress) {
      return res.status(400).json({ 
        success: false,
        message: "Shipping address is required" 
      });
    }

    let totalPrice = 0;
    const processedItems = [];

    for (const item of orderItems) {
      // Support both product ID formats
      const productId = item.product || item._id;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: `Product not found` 
        });
      }

      const quantity = item.quantity || 1;
      
      if (product.stock < quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Insufficient stock for ${product.name}` 
        });
      }

      totalPrice += product.price * quantity;
      processedItems.push({
        product: product._id,
        quantity: quantity,
        price: product.price,
        size: item.size,
        color: item.color,
      });
    }

    const order = new Order({
      user: req.user.id,
      items: processedItems,
      totalPrice: amount || totalPrice,
      finalPrice: amount || totalPrice,
      shippingAddress: finalAddress,
      status: "pending"
    });

    await order.save();
    await order.populate("items.product");

    // Reduce stock
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @route   GET /api/orders
// @desc    Get all orders (Admin) or user's orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== "admin") {
      filter.user = req.user.id;
    }

    const orders = await Order.find(filter)
      .populate("user", "firstName lastName email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is admin or order owner
    if (req.user.role !== "admin" && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin only)
// @access  Private
export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update orders" });
    }

    const { status, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, trackingNumber },
      { new: true, runValidators: true }
    )
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/orders/:id
// @desc    Cancel order (customer) or Delete order (admin)
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If admin, delete the order completely
    if (req.user.role === "admin") {
      // Restore stock before deleting
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }

      await Order.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    }

    // For customers, cancel the order (change status)
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== "pending" && order.status !== "confirmed") {
      return res.status(400).json({ message: "Cannot cancel order with this status" });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
