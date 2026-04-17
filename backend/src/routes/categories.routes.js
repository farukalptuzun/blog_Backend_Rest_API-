const express = require('express');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/admin');
const { categoriesController } = require('../controllers/categories.controller');

const router = express.Router();

router.get('/', asyncHandler(categoriesController.list));
router.get('/:slug', asyncHandler(categoriesController.getBySlug));

router.post('/', requireAuth, requireAdmin, asyncHandler(categoriesController.create));
router.patch('/:id', requireAuth, requireAdmin, asyncHandler(categoriesController.update));
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(categoriesController.remove));

module.exports = { router };

