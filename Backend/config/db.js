import mongoose from "mongoose";
import dotenv from "dotenv";

// Gọi config để đọc được biến môi trường từ file .env
dotenv.config();

const connectDB = async () => {
  try {
    // Thay vì code cứng, chúng ta lấy link từ file .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Kết nối MongoDB Atlas thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1); // Ép server dừng lại nếu không có Database
  }
};

export default connectDB;