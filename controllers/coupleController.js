import User from '../models/User.js';
import Couple from '../models/Couple.js';

// API Ghép đôi 2 người dùng
export const pairCouple = async (req, res) => {
  try {
    // Nhận ID của 2 người và ngày bắt đầu yêu nhau từ body (Postman)
    const { userId, partnerId, startDate } = req.body;

    if (!userId || !partnerId || !startDate) {
      return res.status(400).json({ message: 'Thiếu thông tin ghép đôi hoặc ngày kỷ niệm' });
    }

    if (userId === partnerId) {
       return res.status(400).json({ message: 'Không thể tự ghép đôi với chính mình' });
    }

    // 1. Kiểm tra xem 2 user có tồn tại không
    const user1 = await User.findById(userId);
    const user2 = await User.findById(partnerId);

    if (!user1 || !user2) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // 2. Kiểm tra xem có ai đang "bắt cá hai tay" không
    if (!user1.isSingle || !user2.isSingle) {
      return res.status(400).json({ message: 'Một trong hai người đã có đôi, không thể ghép cặp!' });
    }

    // 3. Tạo Giấy chứng nhận tình yêu (Tạo record trong bảng Couple)
    const newCouple = await Couple.create({
      users: [userId, partnerId],
      startDate: new Date(startDate)
    });

    // 4. Cập nhật lại trạng thái của 2 User thành "Đã có chủ"
    user1.isSingle = false;
    user1.coupleId = newCouple._id;
    await user1.save();

    user2.isSingle = false;
    user2.coupleId = newCouple._id;
    await user2.save();

    res.status(201).json({
      message: '🎉 Ghép đôi thành công! Chúc hai bạn hạnh phúc.',
      couple: newCouple
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};