import morgan, { StreamOptions } from 'morgan';

import logger from 'utils/logger';

const stream: StreamOptions = {
  write: (message) => logger.http(message),
};

const skip = () => process.env.NODE_ENV !== 'dev';

const morganMiddleware = morgan(
  'tiny',
  {
    stream,
    skip,
  },
);

export default morganMiddleware;
