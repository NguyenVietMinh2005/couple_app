import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// API Đăng bài viết mới
export const createPost = async (req, res) => {
  try {
    const { authorId, content, mediaUrls } = req.body;

    if (!authorId) {
      return res.status(400).json({ message: 'Thiếu ID người đăng bài' });
    }

    // 1. Kiểm tra xem người này có tồn tại và đã "thoát ế" chưa
    const user = await User.findById(authorId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    if (!user.coupleId) {
      return res.status(400).json({ message: 'Bạn chưa ghép đôi, không thể đăng bài chung!' });
    }

    // 2. Tạo bài viết mới, tự động nhét coupleId của user vào
    const newPost = await Post.create({
      authorId: user._id,
      coupleId: user.coupleId, // Tự động lấy từ data của User
      content: content || "",
      mediaUrls: mediaUrls || [] // Mảng chứa link ảnh/video
    });

    res.status(201).json({
      message: '📸 Đăng bài kỷ niệm thành công!',
      post: newPost
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Lấy bảng tin (Giống Locket / Instagram Feed)
export const getPublicFeed = async (req, res) => {
  try {
    // Tìm tất cả bài viết, sắp xếp thời gian giảm dần (-1 là mới nhất lên đầu)
    const posts = await Post.find()
      .sort({ createdAt: -1 }) 
      .populate('authorId', 'fullName avatar facebookId') // Kéo theo Tên và Ảnh đại diện của người đăng
      .populate('coupleId', 'startDate status'); // Kéo theo ngày kỷ niệm của cặp đôi đó

    res.status(200).json({
      message: 'Lấy bảng tin thành công',
      totalPosts: posts.length,
      posts
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Thả tim / Bỏ thả tim bài viết
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params; 
    const userId = req.user._id; // Lấy ID tự động từ Token bảo vệ

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    // Kiểm tra xem user này đã thả tim chưa (Dùng .some và .toString() để so sánh chính xác tuyệt đối ID)
    const isLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (isLiked) {
      // 1. NẾU ĐÃ LIKE -> HỦY THẢ TIM (Xóa ID khỏi mảng)
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      
      await post.save(); // Lưu lại vào Database
      return res.status(200).json({ message: '💔 Đã hủy thả tim' });
      
    } else {
      // 2. NẾU CHƯA LIKE -> THẢ TIM (Thêm ID vào mảng)
      post.likes.push(userId);
      await post.save(); // Lưu lại vào Database trước khi bắn thông báo

      // Bắn thông báo nếu người thả tim KHÔNG PHẢI là chủ bài viết
      if (post.authorId.toString() !== userId.toString()) {
        
        // Lưu vào kho Notification
        await Notification.create({
          userId: post.authorId,
          senderId: userId,
          type: 'like',
          content: 'đã thả tim bài viết của bạn ❤️',
        });

        // Kích hoạt loa Socket.io để kêu Ting Ting
        const io = req.app.get('socketio');
        if (io) {
          io.to(post.authorId.toString()).emit('new_notification', {
            message: 'Ting! Bạn có thông báo mới ❤️',
            type: 'like'
          });
        }
      }

      return res.status(200).json({ message: '❤️ Đã thả tim bài viết' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Thêm bình luận vào bài viết
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params; // Lấy ID bài viết từ URL
    const userId = req.user._id; // Lấy ID tự động từ Token bảo vệ
    const { text } = req.body; // Nhận ID người bình luận và nội dung

    if (!text) {
      return res.status(400).json({ message: 'Thiếu nội dung bình luận' });
    }

    // Tìm bài viết theo ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    // Thêm bình luận mới vào mảng comments
    post.comments.push({
      userId,
      text
    });
//----thông báo----
    if (post.authorId.toString() !== userId.toString()) {
      await Notification.create({
        userId: post.authorId,
        senderId: userId,
        type: 'comment',
        content: `đã bình luận: "${text.substring(0, 20)}..." 💬`,
      });
    }

    // Lưu lại vào database
    await post.save();

    res.status(201).json({
      message: '💬 Đã thêm bình luận thành công',
      comments: post.comments
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};