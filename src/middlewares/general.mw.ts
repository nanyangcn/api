import { Request, Response, NextFunction } from 'express';

import logger from 'src/utils/logger';

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  switch (err.name) {
    case 'JsonWebTokenError':
    case 'TokenExpiredError':
    case 'AuthenticationError':
    case 'UnauthorizedError':
      res.status(401).json({ error: err.message });
      break;
    case 'MongoServerError':
    case 'TypeValidationError':
    case 'SyntaxError':
    case 'MalformattedIdError':
      res.status(400).json({ error: err.message });
      break;
    case 'NotFoundError':
      res.status(404).json({ error: err.message });
      break;
    default:
      res.status(500).json({ error: err.message });
      logger.error(`${JSON.stringify(err)}`);
      next(err);
  }
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

export default {
  errorHandler,
  unknownEndpoint,
};
