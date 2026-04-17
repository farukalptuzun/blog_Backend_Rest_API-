const express = require('express');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/admin');
const { adminController } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/users', requireAuth, requireAdmin, asyncHandler(adminController.listUsers));
router.patch('/users/:id/role', requireAuth, requireAdmin, asyncHandler(adminController.setUserRole));

module.exports = { router };

