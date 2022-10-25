import { Request, Response, NextFunction } from 'express';

import logger from 'utils/logger';

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  switch (err.name) {
    case 'JsonWebTokenError'
      || 'TokenExpiredError'
      || 'UsernameOrPasswordError'
      || 'UnauthorizedError':
      res.status(401);
      break;
    case 'MongoServerError'
      || 'TypeValidationError'
      || 'SyntaxError'
      || 'MalformattedIdError':
      res.status(400);
      break;
    case 'NotFoundError':
      res.status(404);
      break;
    default:
      logger.error(`${err.message}`);
      next(err);
  }
  res.json({ error: err.message });
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

export default {
  errorHandler,
  unknownEndpoint,
};
