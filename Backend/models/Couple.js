import mongoose from 'mongoose';

const coupleSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Mảng 2 ID
  startDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Broken_Up'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Couple', coupleSchema);