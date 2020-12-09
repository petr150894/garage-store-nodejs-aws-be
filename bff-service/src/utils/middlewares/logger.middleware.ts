import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import logger from 'src/utils/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    logger.log('------>');
    logger.log(`REQUEST [${req.method}]`, req.originalUrl);
    if (req.method.toUpperCase() !== 'GET') {
      logger.log('BODY', req.body);
    }

    next();

    res.on('close', () => {
      this.logResult(res);
    });
  }

  logResult(res: Response) {
    const { statusCode, statusMessage, req } = res;
    const isError = statusCode > 399;
    const logMethod = isError ? logger.error : logger.log;
    logMethod(
      `${isError ? 'ERROR' : 'RESPONSE'} [${req.method}]`,
      req.originalUrl,
      statusMessage || 'SUCCESS',
    );
    logMethod('<------');
  }
}
