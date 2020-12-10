import {
  BadGatewayException,
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import axios, { Method } from 'axios';
import { Cache } from 'cache-manager';
import { NextFunction, Request, Response } from 'express';
import config from 'src/config';
import { getRecipient, RECIPIENTS, REQUEST_WHITELIST } from 'src/utils/helpers';
import logger from 'src/utils/logger';
@Injectable()
export class RouteMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (REQUEST_WHITELIST.includes(req.originalUrl)) {
      next();
      return;
    }
    const { recipient, recipientBaseUrl } = getRecipient(req);
    if (!recipientBaseUrl) {
      throw new BadGatewayException(`Recipient URL for ${recipient} not found`);
    }
    const recipientUrl = `${recipientBaseUrl}${req.originalUrl}`;

    axios({
      method: req.method as Method,
      url: recipientUrl,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    })
      .then(async (axiosRes) => {
        const data = axiosRes.data;
        res.status(HttpStatus.OK).json(data);
        logger.log(`DATA from ${recipientUrl} receved successfully`, data);
        if (
          recipient === RECIPIENTS.PRODUCTS &&
          req.method.toUpperCase() === 'GET'
        ) {
          await this.cacheManager.set(recipientUrl, data, {
            ttl: config.CACHE_TTL,
          });
          logger.log(`DATA cached`);
        }
        return;
      })
      .catch((err) => {
        logger.log(`ERROR during fething data from ${recipientUrl}`, err);
        if (err.response) {
          const { status, data } = err.response;
          res.status(status).json(data);
        } else {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
        }
      });
  }
}
