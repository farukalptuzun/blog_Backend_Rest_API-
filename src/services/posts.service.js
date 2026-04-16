const mongoose = require('mongoose');

const { Post } = require('../models/Post');
const { HttpError } = require('../utils/httpError');
const { slugify } = require('../utils/slug');

async function generateUniqueSlug(title) {
  const base = slugify(title);
  if (!base) throw new HttpError(400, 'Invalid title');

  let slug = base;
  let i = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Post.exists({ slug })) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

async function createPost(authorId, { title, content, tags, published }) {
  const slug = await generateUniqueSlug(title);
  const doc = await Post.create({
    author: authorId,
    title,
    slug,
    content,
    tags: (tags || []).map((t) => String(t).toLowerCase().trim()).filter(Boolean),
    publishedAt: published ? new Date() : null
  });
  return doc;
}

async function listPosts(query, { skip, limit }) {
  const filter = {};

  if (query.authorId) {
    if (!mongoose.isValidObjectId(query.authorId)) throw new HttpError(400, 'Invalid authorId');
    filter.author = query.authorId;
  }

  if (query.tag) {
    filter.tags = String(query.tag).toLowerCase().trim();
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  let sort = { createdAt: -1 };
  if (query.sort === 'popular') sort = { likeCount: -1, createdAt: -1 };
  if (query.sort === 'latest') sort = { createdAt: -1 };

  const find = Post.find(filter);
  if (query.q) {
    find.find({ $text: { $search: String(query.q) } });
  }

  const [items, total] = await Promise.all([
    find.sort(sort).skip(skip).limit(limit).populate('author', 'email name avatarUrl').lean(),
    Post.countDocuments(query.q ? { ...filter, $text: { $search: String(query.q) } } : filter)
  ]);

  return { items, total };
}

async function getPostByIdOrSlug(idOrSlug) {
  let post = null;
  if (mongoose.isValidObjectId(idOrSlug)) {
    post = await Post.findById(idOrSlug).populate('author', 'email name avatarUrl').lean();
  }
  if (!post) {
    post = await Post.findOne({ slug: idOrSlug }).populate('author', 'email name avatarUrl').lean();
  }
  if (!post) throw new HttpError(404, 'Post not found');
  return post;
}

async function updatePost(postId, userId, patch) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post) throw new HttpError(404, 'Post not found');
  if (String(post.author) !== String(userId)) throw new HttpError(403, 'Forbidden');

  if (patch.title && patch.title !== post.title) {
    post.title = patch.title;
    post.slug = await generateUniqueSlug(patch.title);
  }
  if (patch.content) post.content = patch.content;
  if (patch.tags) post.tags = patch.tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean);
  if (patch.published !== undefined) {
    post.publishedAt = patch.published ? post.publishedAt || new Date() : null;
  }

  await post.save();
  return post;
}

async function deletePost(postId, userId) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post) throw new HttpError(404, 'Post not found');
  if (String(post.author) !== String(userId)) throw new HttpError(403, 'Forbidden');
  await post.deleteOne();
}

async function setCover(postId, userId, coverUrl) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post) throw new HttpError(404, 'Post not found');
  if (String(post.author) !== String(userId)) throw new HttpError(403, 'Forbidden');
  post.coverImageUrl = coverUrl;
  await post.save();
  return post;
}

module.exports = {
  createPost,
  listPosts,
  getPostByIdOrSlug,
  updatePost,
  deletePost,
  setCover
};

