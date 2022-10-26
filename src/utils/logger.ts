import {
  format, transports, createLogger, addColors,
} from 'winston';

const {
  combine, timestamp, colorize, printf,
} = format;

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

addColors(colors);

const logger = createLogger({
  level: process.env.NODE_ENV === 'prod' ? 'warn' : 'debug',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: combine(
    format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    colorize({ all: true }),
    printf(
      (info) => `[${(info.timestamp as string)}] ${info.level}: ${info.message as string}`,
    ),
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/all.log',
    }),
  ],
});

export default logger;
