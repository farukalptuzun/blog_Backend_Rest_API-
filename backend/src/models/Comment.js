const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null, index: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    likeCount: { type: Number, default: 0, index: true }
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, parentComment: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };

