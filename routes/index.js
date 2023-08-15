const authRouter = require('./auth');
const userRouter = require('./user');
const postRouter = require('./posts');

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/posts', postRouter);
}

module.exports = route;