const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    coverImageUrl: { type: String, default: '' },
    publishedAt: { type: Date, default: null, index: true },
    likeCount: { type: Number, default: 0, index: true }
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, publishedAt: -1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };

