const express = require('express');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { usersController } = require('../controllers/users.controller');

const router = express.Router();

router.patch('/me', requireAuth, asyncHandler(usersController.updateMe));
router.post(
  '/me/avatar',
  requireAuth,
  upload.single('avatar'),
  asyncHandler(usersController.uploadAvatar)
);

module.exports = { router };

