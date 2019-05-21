import * as config from 'config';
import {join} from 'path';
import {createLogger, format, Logger, LoggerOptions, transports} from 'winston';

const {combine, timestamp, printf} = format;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

// We might want to do something on rotation?
// rotateTransport.on("rotate", (oldFilename, newFilename) => {
//     // do something fun
// });

const options: LoggerOptions = {
  exitOnError: false,
  level: 'debug',
  transports: [
    new transports.File({
      filename: join(config.get('root'), 'logs', 'logs.log'),
      zippedArchive: true,
      maxsize: 5242880,
      maxFiles: 5,
      level: 'info' // info and below to rotate
    })
  ]
};

const logger: Logger = createLogger(options);

if (process.env.NODE_ENV !== 'prod') {

  logger.add(new transports.Console({
    format: combine(
      timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      format.colorize({all: true}),
      myFormat
    ),
    level: 'debug'
  }));
}

export {logger};
