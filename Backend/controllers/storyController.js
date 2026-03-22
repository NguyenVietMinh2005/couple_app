import Story from '../models/Story.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Couple from '../models/Couple.js'; 
// API Đăng Story (Tự hủy sau 24h)
export const createStory = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy tự động từ Token
    const { mediaUrl } = req.body; 

    if (!mediaUrl) {
      return res.status(400).json({ message: 'Thiếu Link ảnh Story' });
    }

    const user = await User.findById(userId);

    if (!authorId || !mediaUrl) {
      return res.status(400).json({ message: 'Thiếu ID người đăng hoặc Link ảnh Story' });
    }

    // 1. Kiểm tra người dùng và lấy ID cặp đôi
    
    if (!user || !user.coupleId) {
      return res.status(400).json({ message: 'Bạn cần ghép đôi trước khi đăng Story chung!' });
    }

    // 2. Tạo Story mới
    const newStory = await Story.create({
      coupleId: user.coupleId,
      authorId: user._id,
      mediaUrl
    });

    // --- CẤY CODE THÔNG BÁO VÀO ĐÂY ---
    const coupleInfo = await Couple.findById(user.coupleId);
    if (coupleInfo) {
      // Tìm ID của người yêu (người không phải là mình trong mảng users)
      const partnerId = coupleInfo.users.find(id => id.toString() !== userId.toString());
      
      if (partnerId) {
        await Notification.create({
          userId: partnerId,
          senderId: userId,
          type: 'story',
          content: 'vừa đăng một Story mới 24h ✨',
        });
      }
    }
    // ----------------------------------

    res.status(201).json({
      message: '✨ Đăng Story thành công! Kỷ niệm này sẽ tự động biến mất sau 24h.',
      story: newStory
    });


  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Lấy danh sách Story của Cặp đôi
export const getCoupleStories = async (req, res) => {
  try {
    const { coupleId } = req.params;

    // Lấy tất cả Story của coupleId này.
    // Dữ liệu nào quá 24h đã bị MongoDB âm thầm xóa mất rồi!
    const stories = await Story.find({ coupleId })
      .sort({ createdAt: -1 }) // Story mới nhất lên đầu
      .populate('authorId', 'fullName avatar'); // Hiện tên người đăng

    res.status(200).json({
      message: 'Lấy khoảnh khắc 24h thành công',
      count: stories.length,
      stories
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};