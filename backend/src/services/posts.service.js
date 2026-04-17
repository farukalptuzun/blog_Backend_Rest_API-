const mongoose = require('mongoose');

const { Post } = require('../models/Post');
const { Category } = require('../models/Category');
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

async function createPost(authorId, { title, content, tags, published, categoryId }) {
  const slug = await generateUniqueSlug(title);
  let category = null;
  if (categoryId !== undefined) {
    if (categoryId && !mongoose.isValidObjectId(categoryId)) throw new HttpError(400, 'Invalid categoryId');
    category = categoryId ? categoryId : null;
  }
  const doc = await Post.create({
    author: authorId,
    category,
    title,
    slug,
    content,
    tags: (tags || []).map((t) => String(t).toLowerCase().trim()).filter(Boolean),
    publishedAt: published ? new Date() : null
  });
  return doc;
}

/** Yayınlanmış yazılardaki benzersiz etiketler (alfabetik) */
async function listDistinctTags() {
  const rows = await Post.aggregate([
    { $match: { publishedAt: { $ne: null }, tags: { $exists: true, $ne: [] } } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags' } },
    { $sort: { _id: 1 } }
  ]);
  return rows.map((r) => r._id).filter(Boolean);
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

  if (query.categoryId) {
    if (!mongoose.isValidObjectId(query.categoryId)) throw new HttpError(400, 'Invalid categoryId');
    filter.category = query.categoryId;
  }

  if (query.categorySlug) {
    const cat = await Category.findOne({ slug: String(query.categorySlug).toLowerCase().trim() }).select('_id');
    if (!cat) throw new HttpError(404, 'Category not found');
    filter.category = cat._id;
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
    find
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', 'email name avatarUrl')
      .populate('category', 'name slug')
      .lean(),
    Post.countDocuments(query.q ? { ...filter, $text: { $search: String(query.q) } } : filter)
  ]);

  return { items, total };
}

async function getPostByIdOrSlug(idOrSlug) {
  const populate = [
    { path: 'author', select: 'email name avatarUrl' },
    { path: 'category', select: 'name slug' }
  ];

  let post = null;
  if (mongoose.isValidObjectId(idOrSlug)) {
    post = await Post.findOneAndUpdate({ _id: idOrSlug }, { $inc: { viewCount: 1 } }, { new: true })
      .populate(populate)
      .lean();
  }
  if (!post) {
    post = await Post.findOneAndUpdate({ slug: idOrSlug }, { $inc: { viewCount: 1 } }, { new: true })
      .populate(populate)
      .lean();
  }
  if (!post) throw new HttpError(404, 'Post not found');
  return post;
}

async function getSimilarPosts(postIdOrSlug, { limit = 6 } = {}) {
  const base = await getPostByIdOrSlug(postIdOrSlug);
  const criteria = { _id: { $ne: base._id } };

  const or = [];
  if (base.category && base.category._id) {
    or.push({ category: base.category._id });
  }
  if (Array.isArray(base.tags) && base.tags.length > 0) {
    or.push({ tags: { $in: base.tags.slice(0, 5) } });
  }
  if (or.length > 0) criteria.$or = or;

  const items = await Post.find(criteria)
    .sort({ likeCount: -1, publishedAt: -1, createdAt: -1 })
    .limit(Math.min(20, Number(limit) || 6))
    .populate('author', 'email name avatarUrl')
    .populate('category', 'name slug')
    .lean();

  return items;
}

async function updatePost(postId, actor, patch) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post) throw new HttpError(404, 'Post not found');
  const isOwner = String(post.author) === String(actor._id);
  const isAdmin = actor.role === 'admin';
  if (!isOwner && !isAdmin) throw new HttpError(403, 'Forbidden');

  if (patch.title && patch.title !== post.title) {
    post.title = patch.title;
    post.slug = await generateUniqueSlug(patch.title);
  }
  if (patch.content) post.content = patch.content;
  if (patch.categoryId !== undefined) {
    if (patch.categoryId === null || patch.categoryId === '') {
      post.category = null;
    } else {
      if (!mongoose.isValidObjectId(patch.categoryId)) throw new HttpError(400, 'Invalid categoryId');
      post.category = patch.categoryId;
    }
  }
  if (patch.tags) post.tags = patch.tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean);
  if (patch.published !== undefined) {
    post.publishedAt = patch.published ? post.publishedAt || new Date() : null;
  }

  await post.save();
  return post;
}

async function deletePost(postId, actor) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post) throw new HttpError(404, 'Post not found');
  const isOwner = String(post.author) === String(actor._id);
  const isAdmin = actor.role === 'admin';
  if (!isOwner && !isAdmin) throw new HttpError(403, 'Forbidden');
  await post.deleteOne();
}

async function setCover(postId, actor, coverUrl) {
  if (!mongoose.isValidObjectId(postId)) throw new HttpError(400, 'Invalid post id');
  const post = await Post.findById(postId);
  if (!post) throw new HttpError(404, 'Post not found');
  const isOwner = String(post.author) === String(actor._id);
  const isAdmin = actor.role === 'admin';
  if (!isOwner && !isAdmin) throw new HttpError(403, 'Forbidden');
  post.coverImageUrl = coverUrl;
  await post.save();
  return post;
}

module.exports = {
  createPost,
  listDistinctTags,
  listPosts,
  getPostByIdOrSlug,
  getSimilarPosts,
  updatePost,
  deletePost,
  setCover
};

