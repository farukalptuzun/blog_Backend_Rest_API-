const mongoose = require('mongoose');

const { Comment } = require('../models/Comment');
const { Post } = require('../models/Post');
const { HttpError } = require('../utils/httpError');

async function addCommentToPost(postId, userId, { content }) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const postExists = await Post.exists({ _id: postId });
  if (!postExists) throw new HttpError(404, 'Post not found');

  const comment = await Comment.create({
    post: postId,
    author: userId,
    parentComment: null,
    content: String(content).trim()
  });

  return comment;
}

async function replyToComment(parentCommentId, userId, { content }) {
  if (!mongoose.isValidObjectId(parentCommentId)) throw new HttpError(400, 'Invalid comment id');
  const parent = await Comment.findById(parentCommentId);
  if (!parent) throw new HttpError(404, 'Comment not found');

  const reply = await Comment.create({
    post: parent.post,
    author: userId,
    parentComment: parent._id,
    content: String(content).trim()
  });

  return reply;
}

async function listCommentsForPost(postId) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate('author', 'email name avatarUrl')
    .lean();

  const byId = new Map();
  const roots = [];

  for (const c of comments) {
    c.replies = [];
    byId.set(String(c._id), c);
  }

  for (const c of comments) {
    if (c.parentComment) {
      const parent = byId.get(String(c.parentComment));
      if (parent) parent.replies.push(c);
      else roots.push(c);
    } else {
      roots.push(c);
    }
  }

  return { items: roots, total: comments.length };
}

async function updateComment(commentId, userId, { content }) {
  if (!mongoose.isValidObjectId(commentId)) throw new HttpError(400, 'Invalid comment id');
  const comment = await Comment.findById(commentId);
  if (!comment) throw new HttpError(404, 'Comment not found');
  if (String(comment.author) !== String(userId)) throw new HttpError(403, 'Forbidden');

  comment.content = String(content).trim();
  await comment.save();
  return comment;
}

async function deleteComment(commentId, userId) {
  if (!mongoose.isValidObjectId(commentId)) throw new HttpError(400, 'Invalid comment id');
  const comment = await Comment.findById(commentId);
  if (!comment) throw new HttpError(404, 'Comment not found');
  if (String(comment.author) !== String(userId)) throw new HttpError(403, 'Forbidden');

  await Comment.deleteMany({ parentComment: comment._id });
  await comment.deleteOne();
}

module.exports = {
  commentsService: {
    addCommentToPost,
    replyToComment,
    listCommentsForPost,
    updateComment,
    deleteComment
  }
};

