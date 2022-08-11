import config from 'configs/port.config';
import logger from 'utils/logger';
import app from 'app';
import http from 'http';

import db from 'utils/db.util';

const httpServer = http.createServer(app);
db.connectDb().then(() => {
  httpServer.listen(config.PORT, () => {
    logger.info(`Listening on http://localhost:${config.PORT}`);
  });
}).catch(null);

const cleanup = (signal: string) => {
  logger.warn(`Signal ${signal} received.`);
  httpServer.close(() => {
    logger.info('Http server closed.');
    db.closeDb().then(() => {
      setTimeout(() => {
        process.exit(0);
      }, 500);
    }).catch(null);
  });
};

process.on('SIGINT', () => cleanup('SIGINT'));
process.on('SIGTERM', () => cleanup('SIGTERM'));
