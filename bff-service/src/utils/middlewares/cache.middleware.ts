import {
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { NextFunction, Request, Response } from 'express';
import { getRecipient, RECIPIENTS, REQUEST_WHITELIST } from 'src/utils/helpers';
import logger from 'src/utils/logger';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (REQUEST_WHITELIST.includes(req.originalUrl)) {
      next();
      return;
    }

    const { recipient, recipientBaseUrl } = getRecipient(req);
    if (recipient === RECIPIENTS.PRODUCTS) {
      const recipientUrl = `${recipientBaseUrl}${req.originalUrl}`;
      const cachedData = await this.cacheManager.get(recipientUrl);
      if (cachedData) {
        res.status(HttpStatus.OK).json(cachedData);
        logger.log('DATA receved from cache');
        return;
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
