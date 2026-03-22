import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Nhập thông tin chìa khóa từ file .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cấu hình kho lưu trữ (Tạo thư mục riêng cho app trên mây)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'couple_app_images', // Tên thư mục trên Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4'], // Cho phép tải ảnh và video ngắn
  },
});

// 3. Giao nhiệm vụ cho Multer (Người vận chuyển)
const upload = multer({ 
    storage: storage,
    limits: { 
    fileSize: 20 * 1024 * 1024 // Giới hạn tối đa 20MB (Đủ cho ảnh và video ngắn)
  }
});

export default upload;