const express = require('express');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { postsController } = require('../controllers/posts.controller');

const router = express.Router();

router.post('/', requireAuth, asyncHandler(postsController.create));
router.get('/', asyncHandler(postsController.list));
router.get('/:idOrSlug', asyncHandler(postsController.getByIdOrSlug));
router.patch('/:id', requireAuth, asyncHandler(postsController.update));
router.delete('/:id', requireAuth, asyncHandler(postsController.remove));
router.post(
  '/:id/cover',
  requireAuth,
  upload.single('cover'),
  asyncHandler(postsController.uploadCover)
);

router.post('/:postId/like', requireAuth, asyncHandler(postsController.like));
router.delete('/:postId/like', requireAuth, asyncHandler(postsController.unlike));

router.post('/:postId/comments', requireAuth, asyncHandler(postsController.addComment));
router.get('/:postId/comments', asyncHandler(postsController.listComments));

module.exports = { router };

