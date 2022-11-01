import express from 'express';

import signupRouter from 'src/routes/signup.route';
import loginRouter from 'src/routes/login.route';
import logoutRouter from 'src/routes/logout.route';
import todoRouter from 'src/routes/todo.route';
import userRouter from 'src/routes/user.route';
import middleware from 'src/middlewares/general.mw';
import morganMiddleware from 'src/middlewares/morgan.mw';
import tokenMiddleware from 'src/middlewares/token.mw';

const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.use('/api', signupRouter);
app.use('/api', loginRouter);
// eslint-disable @typescript-eslint/no-misused-promises
app.use(tokenMiddleware.tokenVerifier);
app.use('/api', logoutRouter);
app.use('/api', todoRouter);
app.use('/api', userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
export default app;
