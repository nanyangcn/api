import express from 'express';

import logoutController from 'src/controllers/logout.controller';

const router = express.Router();

router.delete('/logout/:id', logoutController.deleteLogout);

export default router;
