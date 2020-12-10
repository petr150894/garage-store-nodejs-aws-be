import { format, createLogger, addColors, transports } from 'winston';

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.colorize({ all: true }),
      handleExceptions: true,
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf((info) => info.message),
  ),
});

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'white',
  debug: 'green',
});

function formatText(args: any[]): string {
  return args
    .map((a) => {
      if (typeof a === 'string') {
        return a;
      }
      if (a instanceof Error) {
        return a.stack || a.message || a;
      }
      return JSON.stringify(a);
    })
    .join(' ');
}

export default {
  log(...args: any[]): void {
    logger.info(formatText(args));
  },
  debug(...args: any[]): void {
    logger.debug(formatText(args));
  },
  error(...args: any[]): void {
    logger.error(formatText(args));
  },
};
