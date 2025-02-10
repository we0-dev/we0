import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // throw new Error("Please define the MONGODB_URI environment variable");
}

let isConnecting = false;

async function dbConnect() {
  try {
    console.log("MongoDB 连接状态:", mongoose.connection.readyState);

    if (mongoose.connection.readyState >= 1) {
      console.log("MongoDB 已连接");
      return;
    }

    if (isConnecting) {
      console.log("MongoDB 正在连接中...");
      return;
    }

    isConnecting = true;
    console.log("开始连接 MongoDB:", MONGODB_URI);

    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // 增加超时时间
      socketTimeoutMS: 45000,
      family: 4,
    });

    isConnecting = false;
    console.log("MongoDB 连接成功");
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error("MongoDB 连接错误:", error);
    throw error;
  }
}

export default dbConnect;
