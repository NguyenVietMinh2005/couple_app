import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Cấu hình tài khoản Gmail sẽ làm nhiệm vụ gửi thư
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Sẽ điền vào file .env sau
    pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng (App Password)
  }
});

// Hàm tiện ích để gửi OTP
export const sendOTPEmail = async (toEmail, otpCode) => {
  const mailOptions = {
    from: `"Couple App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Mã xác thực tài khoản Couple App của bạn',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Chào mừng bạn đến với Couple App!</h2>
        <p>Mã xác thực (OTP) của bạn là:</p>
        <h1 style="color: #ff4757; letter-spacing: 5px;">${otpCode}</h1>
        <p>Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ cho bất kỳ ai.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};