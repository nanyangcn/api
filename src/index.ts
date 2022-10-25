import config from 'configs/server.config';
import logger from 'utils/logger';
import app from 'app';
import https from 'https';
import fs from 'fs';
import db from 'utils/db.util';

const httpsServer = https.createServer(
  {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem'),
  },
  app,
);
db.connectDb().then(() => {
  httpsServer.listen(config.PORT, () => {
    logger.info(`Listening on https://localhost:${config.PORT}`);
  });
}).catch(null);

const cleanup = (signal: string) => {
  logger.warn(`Signal ${signal} received.`);
  httpsServer.close(() => {
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
