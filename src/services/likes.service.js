const mongoose = require('mongoose');

const { Like } = require('../models/Like');
const { Post } = require('../models/Post');
const { Comment } = require('../models/Comment');
const { HttpError } = require('../utils/httpError');

async function likePost(postId, userId) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const exists = await Post.exists({ _id: postId });
  if (!exists) throw new HttpError(404, 'Post not found');

  const created = await Like.create({ user: userId, targetType: 'post', targetId: postId }).catch((e) => {
    if (e && e.code === 11000) return null;
    throw e;
  });

  if (created) {
    await Post.updateOne({ _id: postId }, { $inc: { likeCount: 1 } });
  }

  const post = await Post.findById(postId).select('likeCount');
  return { liked: true, likeCount: post ? post.likeCount : 0 };
}

async function unlikePost(postId, userId) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const exists = await Post.exists({ _id: postId });
  if (!exists) throw new HttpError(404, 'Post not found');

  const deleted = await Like.deleteOne({ user: userId, targetType: 'post', targetId: postId });
  if (deleted.deletedCount) {
    await Post.updateOne({ _id: postId }, { $inc: { likeCount: -1 } });
    await Post.updateOne({ _id: postId, likeCount: { $lt: 0 } }, { $set: { likeCount: 0 } });
  }

  const post = await Post.findById(postId).select('likeCount');
  return { liked: false, likeCount: post ? post.likeCount : 0 };
}

async function likeComment(commentId, userId) {
  if (!mongoose.isValidObjectId(commentId)) throw new HttpError(400, 'Invalid comment id');
  const exists = await Comment.exists({ _id: commentId });
  if (!exists) throw new HttpError(404, 'Comment not found');

  const created = await Like.create({ user: userId, targetType: 'comment', targetId: commentId }).catch((e) => {
    if (e && e.code === 11000) return null;
    throw e;
  });
  if (created) {
    await Comment.updateOne({ _id: commentId }, { $inc: { likeCount: 1 } });
  }

  const c = await Comment.findById(commentId).select('likeCount');
  return { liked: true, likeCount: c ? c.likeCount : 0 };
}

async function unlikeComment(commentId, userId) {
  if (!mongoose.isValidObjectId(commentId)) throw new HttpError(400, 'Invalid comment id');
  const exists = await Comment.exists({ _id: commentId });
  if (!exists) throw new HttpError(404, 'Comment not found');

  const deleted = await Like.deleteOne({ user: userId, targetType: 'comment', targetId: commentId });
  if (deleted.deletedCount) {
    await Comment.updateOne({ _id: commentId }, { $inc: { likeCount: -1 } });
    await Comment.updateOne({ _id: commentId, likeCount: { $lt: 0 } }, { $set: { likeCount: 0 } });
  }

  const c = await Comment.findById(commentId).select('likeCount');
  return { liked: false, likeCount: c ? c.likeCount : 0 };
}

module.exports = {
  likesService: {
    likePost,
    unlikePost,
    likeComment,
    unlikeComment
  }
};

