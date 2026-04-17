const express = require('express');

const { router: authRouter } = require('./auth.routes');
const { router: usersRouter } = require('./users.routes');
const { router: postsRouter } = require('./posts.routes');
const { router: commentsRouter } = require('./comments.routes');
const { router: categoriesRouter } = require('./categories.routes');
const { router: adminRouter } = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/categories', categoriesRouter);
router.use('/admin', adminRouter);

module.exports = { router };

