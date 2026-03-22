import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// Cấu hình tài khoản Gmail sẽ làm nhiệm vụ gửi thư
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   family: 4, // 👈 ĐÂY LÀ CHÌA KHÓA VÀNG ĐỂ RENDER KHÔNG BỊ XOAY TRÒN
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS  
//   }
// });

// Hàm tiện ích để gửi OTP
export const sendOTPEmail = async (toEmail, otpCode) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY, // Sẽ lấy từ cấu hình của Render
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { 
          name: "Couple App", 
          email: "nguyenminhhkt2005@gmail.com" // Nhớ sửa dòng này!
        },
        to: [{ email: toEmail }],
        subject: 'Mã xác thực tài khoản Couple App 🔐',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>Khôi phục mật khẩu</h2>
            <p>Mã OTP của bạn là:</p>
            <h1 style="color: #ff4757; letter-spacing: 5px;">${otpCode}</h1>
            <p>Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ cho bất kỳ ai.</p>
          </div>
        `
      })
    });

    if (response.ok) {
      console.log(`✅ Đã gửi mail OTP qua Brevo API thành công!`);
    } else {
      const err = await response.json();
      console.error(`❌ Lỗi Brevo:`, err);
    }
  } catch (error) {
    console.error("❌ Lỗi mạng khi gọi Brevo:", error);
  }
};