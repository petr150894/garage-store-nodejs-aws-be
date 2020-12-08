import { LoggerService } from '@nestjs/common';

import logger from './logger';

export class NestLogger implements LoggerService {
  log(message: string): void {
    logger.log(message);
  }
  error(message: string, trace: string): void {
    logger.error(message, trace);
  }
  debug(message: string): void {
    logger.debug(message);
  }

  warn(message: string): void {
    logger.log(message);
  }
  verbose(message: string): void {
    logger.log(message);
  }
}
