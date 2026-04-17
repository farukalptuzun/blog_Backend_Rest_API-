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

async function hasLikedPost(userId, postId) {
  if (!mongoose.isValidObjectId(postId)) return false;
  const row = await Like.findOne({ user: userId, targetType: 'post', targetId: postId }).select('_id').lean();
  return !!row;
}

/** Liste öğelerine likedByMe ekler (aynı kullanıcı için toplu sorgu). */
async function attachLikedByMeToPosts(userId, items) {
  if (!userId || !Array.isArray(items) || items.length === 0) return items;
  const ids = items.map((i) => i._id).filter(Boolean);
  if (ids.length === 0) return items;
  const likedRows = await Like.find({
    user: userId,
    targetType: 'post',
    targetId: { $in: ids }
  })
    .select('targetId')
    .lean();
  const liked = new Set(likedRows.map((r) => String(r.targetId)));
  return items.map((item) => ({
    ...item,
    likedByMe: liked.has(String(item._id))
  }));
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
    hasLikedPost,
    attachLikedByMeToPosts,
    likeComment,
    unlikeComment
  }
};

