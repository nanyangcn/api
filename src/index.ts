import app from './app';
import config from './util/config';

const { PORT } = config;

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
