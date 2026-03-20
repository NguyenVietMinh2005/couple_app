import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from '../config/mailer.js';

// 1. API Đăng nhập / Đăng ký bằng Facebook (Hàm cũ của bạn)
export const facebookLogin = async (req, res) => {
  try {
    const { facebookId, fullName, avatar } = req.body;

    // Tìm xem user có chưa
    let user = await User.findOne({ facebookId });

    // Nếu chưa có thì tạo mới (Facebook thì coi như đã xác thực)
    if (!user) {
      user = await User.create({ 
        facebookId, 
        fullName, 
        avatar,
        isVerified: true 
      });
    }

    // Cấp thẻ VIP
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// 2. API Đăng ký bằng Email & Mật khẩu
export const registerEmail = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'Email này đã được đăng ký và xác thực!' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user && !user.isVerified) {
      user.otpCode = otpCode;
      user.otpExpires = otpExpires;
      user.password = hashedPassword;
      user.fullName = fullName;
      await user.save();
    } else {
      user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        otpCode,
        otpExpires,
        isVerified: false
      });
    }

    await sendOTPEmail(email, otpCode);

    res.status(200).json({ 
      message: '📧 Đã gửi mã OTP! Vui lòng kiểm tra hộp thư của bạn.' 
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// 3. API Xác thực mã OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này!' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Tài khoản này đã được xác thực từ trước!' });
    }
    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Mã OTP không chính xác!' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Mã OTP đã hết hạn! Vui lòng đăng ký lại.' });
    }

    user.isVerified = true;
    user.otpCode = undefined; 
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({
      message: '✅ Xác thực thành công! Chào mừng bạn.',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Đăng nhập bằng Email & Mật khẩu
export const loginEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user theo email (nhớ móc thẻ +password ra để so sánh)
    const user = await User.findOne({ email }).select('+password');
    
    // 2. Kiểm tra xem email có tồn tại không
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });
    }

    // 3. Chốt chặn bảo mật: Yêu cầu phải xác thực OTP rồi mới cho vào
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Tài khoản chưa được xác thực OTP!' });
    }

    // 4. Máy quét mật khẩu: So sánh pass nhập vào với pass đã băm trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác!' });
    }

    // 5. Vượt qua mọi trạm kiểm soát -> Cấp Thẻ VIP (Token)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({
      message: '🔓 Đăng nhập thành công!',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        coupleId: user.coupleId
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Quên mật khẩu (Chỉ làm nhiệm vụ gửi OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này!' });
    }

    // Tạo mã OTP mới 6 số, hạn 5 phút
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otpCode = otpCode;
    user.otpExpires = otpExpires;
    await user.save();

    // Dùng lại "bưu điện" cũ để gửi mail
    await sendOTPEmail(email, otpCode);

    res.status(200).json({ message: '📧 Đã gửi mã OTP khôi phục mật khẩu vào email của bạn!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

// API Đặt lại mật khẩu mới
export const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
    }
    // Kiểm tra tính hợp lệ của mã OTP
    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Mã OTP không chính xác!' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Mã OTP đã hết hạn! Vui lòng gửi lại yêu cầu.' });
    }

    // Nếu OTP chuẩn -> Băm mật khẩu mới và lưu
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Xóa dấu vết OTP đi cho an toàn
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: '🔐 Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};