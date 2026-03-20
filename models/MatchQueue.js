import mongoose from 'mongoose';

const matchQueueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userGender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  requestedGender: { type: String, enum: ['Male', 'Female', 'Any'], required: true },
  status: { type: String, enum: ['Waiting', 'Matched'], default: 'Waiting' }
}, { timestamps: true });

export default mongoose.model('MatchQueue', matchQueueSchema);