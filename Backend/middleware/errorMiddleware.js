// 1. Lưới lọc 404: Bắt các đường dẫn (Route) không tồn tại
export const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy đường dẫn: ${req.originalUrl}`);
  res.status(404);
  next(error); // Chuyển lỗi này xuống cho lưới lọc số 2 xử lý
};

// 2. Lưới lọc 500: Bắt toàn bộ lỗi hệ thống hoặc lỗi do mình chủ động ném ra
export const errorHandler = (err, req, res, next) => {
  // Đôi khi code có lỗi nhưng status vẫn kẹt ở 200, ta ép nó về 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Xử lý lỗi đặc thù của Mongoose (VD: Gửi sai định dạng ID của MongoDB)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Không tìm thấy tài nguyên (ID không hợp lệ)';
  }

  // --- 2. THÊM 2 KHỐI NÀY ĐỂ BẮT LỖI TOKEN ---
  // Khi người dùng gửi Token tào lao, bịa đặt
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!';
  }

  // Khi Token thật nhưng đã quá hạn 30 ngày
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!';
  }

  // Trả về JSON chuẩn mực
  res.status(statusCode).json({
    message: message,
    // Dòng 'stack' này giúp bạn biết lỗi ở file nào, dòng số mấy.
    // Nếu sau này đưa app lên mạng thật (production) thì giấu nó đi cho bảo mật.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};