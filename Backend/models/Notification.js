import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người nhận thông báo
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người tương tác (người yêu)
  type: { type: String, enum: ['like', 'comment', 'story', 'system'], required: true }, // Loại thông báo
  content: { type: String, required: true }, // Nội dung (VD: "Đã thả tim bài viết của bạn")
  link: { type: String }, // Đường dẫn để bấm vào xem bài
  isRead: { type: Boolean, default: false } // Trạng thái đã đọc hay chưa
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);