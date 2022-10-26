import morgan, { StreamOptions } from 'morgan';

import logger from 'src/utils/logger';

const stream: StreamOptions = {
  write: (message) => logger.http(message),
};

const skip = () => process.env.NODE_ENV === 'prod';

const morganMiddleware = morgan(
  'tiny',
  {
    stream,
    skip,
  },
);

export default morganMiddleware;
