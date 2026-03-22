import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  facebookId: { type: String, unique: true, sparse: true },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  faceIdData: { type: String }, // Dữ liệu xác thực khuôn mặt
  isSingle: { type: Boolean, default: true },
  email: { type: String, unique: true, sparse: true }, // sparse giúp không đụng độ với tài khoản Facebook
  password: { type: String, select: false },
  isVerified: { type: Boolean, default: false }, // Trạng thái đã xác thực chưa
  otpCode: { type: String }, // Lưu mã OTP 6 số
  otpExpires: { type: Date }, // Thời gian hết hạn của mã (ví dụ 5 phút)
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple' } // Tham chiếu tới Couple
}, { timestamps: true });

export default mongoose.model('User', userSchema);