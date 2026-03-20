import User from '../models/User.js';
import bcrypt from 'bcryptjs';


// API Cập nhật thông tin cá nhân
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy ID từ Thẻ VIP Token
    const { fullName, avatar, birthday, gender } = req.body;

    // Tìm và cập nhật User
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        // Chỉ cập nhật những trường có gửi lên, bỏ qua trường rỗng
        ...(fullName && { fullName }),
        ...(avatar && { avatar }),
        ...(birthday && { birthday }),
        ...(gender && { gender }),
      },
      { new: true, runValidators: true } // Trả về data mới nhất sau khi update
    ).select('-password'); // Ẩn password đi cho an toàn

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({
      message: '✨ Cập nhật hồ sơ thành công!',
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Lấy thông tin chi tiết của bản thân
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select('-password')
      .populate('coupleId'); // Lấy luôn thông tin phòng tình yêu nếu có

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

//API doi mat khau
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    // 1. Lấy thông tin user từ DB (Phải dùng +password vì mặc định ta đang ẩn nó đi)
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // 2. So sánh mật khẩu cũ người dùng nhập với mật khẩu trong DB
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
    }

    // 3. Nếu đúng, tiến hành băm (hash) mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 4. Lưu lại vào Database
    await user.save();

    res.status(200).json({ message: '🔒 Đổi mật khẩu thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};