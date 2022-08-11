import express from 'express';

import todoRouter from 'routes/todo.route';

const app = express();

app.use(express.json());
app.use('/api', todoRouter);

export default app;
