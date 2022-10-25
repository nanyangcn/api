import express from 'express';

import signupRouter from 'routes/signup.route';
import loginRouter from 'routes/login.route';
import logoutRouter from 'routes/logout.route';
import todoRouter from 'routes/todo.route';
import userRouter from 'routes/user.route';
import middleware from 'middlewares/general.mw';
import morganMiddleware from 'middlewares/morgan.mw';
import tokenMiddleware from 'middlewares/token.mw';

const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.use('/api', signupRouter);
app.use('/api', loginRouter);
app.use(tokenMiddleware.tokenVerifier);
app.use('/api', logoutRouter);
app.use('/api', todoRouter);
app.use('/api', userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
export default app;
