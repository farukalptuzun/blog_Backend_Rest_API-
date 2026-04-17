const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const { env } = require('../config/env');
const { HttpError } = require('../utils/httpError');

function safeExt(mimetype) {
  if (mimetype === 'image/jpeg') return '.jpg';
  if (mimetype === 'image/png') return '.png';
  if (mimetype === 'image/webp') return '.webp';
  return null;
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, env.uploadDir);
  },
  filename(req, file, cb) {
    const ext = safeExt(file.mimetype) || path.extname(file.originalname || '');
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}_${name}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const ext = safeExt(file.mimetype);
  if (!ext) return cb(new HttpError(400, 'Only image files are allowed'));
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { upload };

