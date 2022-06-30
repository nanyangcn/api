import config from 'configs/port.config';
import logger from 'utils/logger';
import app from 'app';

const { PORT } = config;

app.listen(PORT, () => {
  logger.info(`Listening on ${PORT}`);
});
