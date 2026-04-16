const express = require('express');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const { commentsController } = require('../controllers/comments.controller');

const router = express.Router();

router.post('/:commentId/replies', requireAuth, asyncHandler(commentsController.reply));
router.patch('/:id', requireAuth, asyncHandler(commentsController.update));
router.delete('/:id', requireAuth, asyncHandler(commentsController.remove));
router.post('/:commentId/like', requireAuth, asyncHandler(commentsController.like));
router.delete('/:commentId/like', requireAuth, asyncHandler(commentsController.unlike));

module.exports = { router };

