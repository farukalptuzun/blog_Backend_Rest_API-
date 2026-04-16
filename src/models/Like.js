const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: { type: String, required: true, enum: ['post', 'comment'], index: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true }
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like };

