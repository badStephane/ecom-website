import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import Category from "./src/models/Category.js";
import Order from "./src/models/Order.js";
import User from "./src/models/User.js";

dotenv.config();

const deleteAllData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // Delete all collections (except admin user)
    console.log("🗑️  Deleting all products...");
    await Product.deleteMany({});
    console.log("✅ Products deleted");

    console.log("🗑️  Deleting all categories...");
    await Category.deleteMany({});
    console.log("✅ Categories deleted");

    console.log("🗑️  Deleting all orders...");
    await Order.deleteMany({});
    console.log("✅ Orders deleted");

    console.log("🗑️  Deleting all non-admin users...");
    const result = await User.deleteMany({ role: { $ne: "admin" } });
    console.log(`✅ ${result.deletedCount} users deleted`);

    // Show remaining data
    const adminCount = await User.countDocuments({ role: "admin" });
    const productCount = await Product.countDocuments({});
    const categoryCount = await Category.countDocuments({});
    const orderCount = await Order.countDocuments({});

    console.log("\n📊 Database Status:");
    console.log(`   Admin Users: ${adminCount}`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Orders: ${orderCount}`);

    console.log("\n✅ Database cleaned successfully!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

deleteAllData();
