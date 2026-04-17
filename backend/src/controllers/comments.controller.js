const { HttpError } = require('../utils/httpError');
const { commentsService } = require('../services/comments.service');
const { likesService } = require('../services/likes.service');

const commentsController = {
  async reply(req, res) {
    const { content } = req.body || {};
    if (!content || String(content).trim().length === 0) throw new HttpError(400, 'content is required');
    const comment = await commentsService.replyToComment(req.params.commentId, req.user._id, {
      content: String(content)
    });
    res.status(201).json({ comment });
  },

  async update(req, res) {
    const { content } = req.body || {};
    if (!content || String(content).trim().length === 0) throw new HttpError(400, 'content is required');
    const comment = await commentsService.updateComment(req.params.id, req.user._id, { content: String(content) });
    res.json({ comment });
  },

  async remove(req, res) {
    await commentsService.deleteComment(req.params.id, req.user._id);
    res.status(204).send();
  },

  async like(req, res) {
    const result = await likesService.likeComment(req.params.commentId, req.user._id);
    res.status(201).json(result);
  },

  async unlike(req, res) {
    const result = await likesService.unlikeComment(req.params.commentId, req.user._id);
    res.json(result);
  }
};

module.exports = { commentsController };

