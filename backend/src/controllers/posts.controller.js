const path = require('path');

const { validate } = require('../utils/validate');
const { createPostSchema, updatePostSchema } = require('../validators/post.validators');
const postsService = require('../services/posts.service');
const { parsePagination } = require('../utils/pagination');
const { HttpError } = require('../utils/httpError');
const { commentsService } = require('../services/comments.service');
const { likesService } = require('../services/likes.service');

const postsController = {
  async create(req, res) {
    const dto = validate(createPostSchema, req.body);
    const post = await postsService.createPost(req.user._id, dto);
    res.status(201).json({ post });
  },

  async list(req, res) {
    const { skip, limit, page } = parsePagination(req.query);
    const { items, total } = await postsService.listPosts(req.query, { skip, limit });
    let out = items;
    if (req.user) {
      out = await likesService.attachLikedByMeToPosts(req.user._id, items);
    }
    res.json({ items: out, page, limit, total });
  },

  async listTags(req, res) {
    const items = await postsService.listDistinctTags();
    res.json({ items });
  },

  async getByIdOrSlug(req, res) {
    const post = await postsService.getPostByIdOrSlug(req.params.idOrSlug);
    if (req.user) {
      const likedByMe = await likesService.hasLikedPost(req.user._id, post._id);
      return res.json({ post: { ...post, likedByMe } });
    }
    res.json({ post });
  },

  async similar(req, res) {
    const limit = req.query.limit ? Number(req.query.limit) : 6;
    const items = await postsService.getSimilarPosts(req.params.idOrSlug, { limit });
    res.json({ items });
  },

  async update(req, res) {
    const dto = validate(updatePostSchema, req.body);
    const post = await postsService.updatePost(req.params.id, req.user, dto);
    res.json({ post });
  },

  async remove(req, res) {
    await postsService.deletePost(req.params.id, req.user);
    res.status(204).send();
  },

  async uploadCover(req, res) {
    if (!req.file) throw new HttpError(400, 'File is required');
    const coverUrl = path.posix.join('/uploads', req.file.filename);
    const post = await postsService.setCover(req.params.id, req.user, coverUrl);
    res.json({ post });
  },

  async addComment(req, res) {
    const { content } = req.body || {};
    if (!content || String(content).trim().length === 0) throw new HttpError(400, 'content is required');
    const comment = await commentsService.addCommentToPost(req.params.postId, req.user._id, {
      content: String(content)
    });
    res.status(201).json({ comment });
  },

  async listComments(req, res) {
    const result = await commentsService.listCommentsForPost(req.params.postId);
    res.json(result);
  },

  async like(req, res) {
    const result = await likesService.likePost(req.params.postId, req.user._id);
    res.status(201).json(result);
  },

  async unlike(req, res) {
    const result = await likesService.unlikePost(req.params.postId, req.user._id);
    res.json(result);
  }
};

module.exports = { postsController };

