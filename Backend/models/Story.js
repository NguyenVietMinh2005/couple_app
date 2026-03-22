import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24*60*60*1000, expires: 86400 } // Tự động xóa sau 24h
});

export default mongoose.model('Story', storySchema);