import express from 'express';
// Đảm bảo import đúng tên là facebookLogin
import { facebookLogin, registerEmail, verifyOTP, loginEmail, resetPassword, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

// Sửa lại chỗ này thành facebookLogin
router.post('/facebook', facebookLogin);

// Đăng ký bằng Email (Gửi OTP)
router.post('/register', registerEmail);

// Xác thực mã OTP
router.post('/verify-otp', verifyOTP);

router.post('/login', loginEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;