/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import logoutController from 'controllers/logout.controller';

const router = express.Router();

router.delete('/logout/:id', logoutController.deleteLogout);

export default router;
