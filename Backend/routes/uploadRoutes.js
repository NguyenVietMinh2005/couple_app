import express from 'express';
import upload from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/upload (Chỉ nhận 1 file tên là 'image')
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    // Nếu không có file gửi lên
    if (!req.file) {
      return res.status(400).json({ message: 'Không tìm thấy file ảnh nào!' });
    }

    // req.file.path chính là đường Link URL thật do Cloudinary trả về
    res.status(200).json({
      message: '☁️ Tải ảnh lên mây thành công!',
      imageUrl: req.file.path, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Upload', error: error.message });
  }
});

export default router;