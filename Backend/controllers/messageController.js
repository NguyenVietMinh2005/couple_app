import Message from '../models/Message.js';
import User from '../models/User.js';

// API Gửi tin nhắn mới
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy ID trực tiếp từ Token
    const { content, messageType } = req.body; 

    if (!content) {
      return res.status(400).json({ message: 'Thiếu nội dung tin nhắn' });
    }

    const user = await User.findById(userId);

    // Kiểm tra người gửi và lấy ID phòng chat (coupleId)
    if (!user || !user.coupleId) {
      return res.status(400).json({ message: 'Bạn cần ghép đôi trước khi nhắn tin!' });
    }

    // Tạo tin nhắn mới lưu vào database
    const newMessage = await Message.create({
      coupleId: user.coupleId,
      senderId: user._id,
      messageType: messageType || 'text',
      content: content
    });

    res.status(201).json({
      message: 'Đã gửi tin nhắn 💬',
      data: newMessage
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Lấy lịch sử đoạn chat của cặp đôi
export const getMessages = async (req, res) => {
  try {
    const { coupleId } = req.params;

    // Tìm tất cả tin nhắn của coupleId này
    const messages = await Message.find({ coupleId })
      .sort({ createdAt: 1 }) // Sắp xếp: Cũ ở trên, Mới ở dưới (Chuẩn giao diện Chat)
      .populate('senderId', 'fullName avatar facebookId'); // Hiện tên người gửi từng dòng tin

    res.status(200).json({
      message: 'Lấy lịch sử chat thành công',
      totalMessages: messages.length,
      messages
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};