const express = require('express');

const { router: authRouter } = require('./auth.routes');
const { router: usersRouter } = require('./users.routes');
const { router: postsRouter } = require('./posts.routes');
const { router: commentsRouter } = require('./comments.routes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);

module.exports = { router };

