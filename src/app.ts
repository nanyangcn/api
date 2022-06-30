import express from 'express';

import dbService from 'services/db.service';

const db = dbService.connectMongoDb();

const app = express();

export default app;
