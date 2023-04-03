const router = require('express').Router();
const usersRouter = require('./users-router');
const spotifyRouter = require('./spotify-router');
const commentRouter = require('./comment-router');
const postRouter = require('./post-router');
const dashboardRouter = require('./dashboard');

router.use('spotify', spotifyRouter)
router.use('/users', usersRouter);
router.use('/comment', commentRouter);
router.use('/post', postRouter);
router.use('/profile', dashboardRouter);

module.exports = router;
