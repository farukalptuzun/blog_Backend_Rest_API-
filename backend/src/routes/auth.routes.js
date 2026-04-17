const express = require('express');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { authController } = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/me', requireAuth, asyncHandler(authController.me));

module.exports = { router };

