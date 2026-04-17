const express = require('express');
const path = require('path');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { HttpError } = require('../utils/httpError');

const router = express.Router();

/** Yazı içeriğine eklenecek görseller (Quill vb.) */
router.post(
  '/image',
  requireAuth,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'File is required');
    const url = path.posix.join('/uploads', req.file.filename);
    res.status(201).json({ url });
  })
);

module.exports = { router };
