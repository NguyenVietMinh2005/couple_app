import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header có chứa Token và bắt đầu bằng chữ "Bearer" không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Lấy token ra khỏi chuỗi (Cắt bỏ chữ "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 2. Giải mã token bằng chữ ký bí mật trong file .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Tìm User dựa trên ID lấy được từ token (không lấy kèm password)
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Mọi thứ hợp lệ -> Cho phép đi tiếp vào Controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không tìm thấy Token. Từ chối truy cập!' });
  }
};