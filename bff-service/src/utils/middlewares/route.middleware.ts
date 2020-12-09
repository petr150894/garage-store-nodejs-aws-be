import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import axios, { Method } from 'axios';
import { NextFunction, Request, Response } from 'express';
import config from 'src/config';
import logger from 'src/utils/logger';

const REQUEST_WHITELIST = ['/', '/favicon.ico'];

const RECIPIENTS = {
  PRODUCTS: 'products',
  CART: 'cart',
};

@Injectable()
export class RouteMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (REQUEST_WHITELIST.includes(req.originalUrl)) {
      next();
      return;
    }

    const recipientPath = req.originalUrl.split('/')[1];
    let recipient: string;
    if (recipientPath.indexOf('?') > 0) {
      recipient = recipientPath.split('?')[0];
    } else {
      recipient = recipientPath;
    }
    const recipientBaseUrl = this.getRecipient(recipient);
    if (!recipientBaseUrl) {
      throw new BadGatewayException(`Recipient URL for ${recipient} not found`);
    }
    const recipientUrl = `${recipientBaseUrl}${req.originalUrl}`;

    axios({
      method: req.method as Method,
      url: recipientUrl,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    })
      .then((axiosRes) => {
        res.status(HttpStatus.OK).json(axiosRes.data);
        logger.log(
          `DATA from ${recipientUrl} receved successfully`,
          axiosRes.data,
        );
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

  getRecipient(urlName: string): string {
    switch (urlName) {
      case RECIPIENTS.PRODUCTS:
        return config.PRODUCTS_SERVICE_URL;
      case RECIPIENTS.CART:
        return config.CART_SERVICE_URL;
      default:
        return null;
    }
  }
}
