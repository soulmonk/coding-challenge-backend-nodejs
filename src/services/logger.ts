import config = require('config');
import {join} from 'path';
import {createLogger, format, Logger, LoggerOptions, transports} from 'winston';

const {combine, timestamp, printf} = format;

// TODO find format as in plain console.log > winston-console-formatter is non ts
const myFormat = printf(info => {
  // tslint:disable-next-line:no-shadowed-variable
  const {level, message, timestamp, ...data} = info;
  return `${timestamp} ${level}: ${message}, payload: ${JSON.stringify(data)}`;
});

// We might want to do something on rotation?
// rotateTransport.on("rotate", (oldFilename, newFilename) => {
//     // do something fun
// });

const options: LoggerOptions = {
  exitOnError: false,
  level: 'debug',
  transports: [
    // todo levels
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

if (process.env.NODE_ENV !== 'prod') { // todo in config

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
