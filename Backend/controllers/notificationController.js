import Notification from '../models/Notification.js';

// Lấy danh sách thông báo của mình
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy ID từ Thẻ VIP (Token)

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // Mới nhất xếp lên đầu
      .populate('senderId', 'fullName avatar'); // Kéo theo ảnh đại diện của người yêu

    res.status(200).json({
      message: 'Lấy thông báo thành công',
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// Đánh dấu tất cả là đã đọc
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    
    res.status(200).json({ message: 'Đã đánh dấu đọc tất cả' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};