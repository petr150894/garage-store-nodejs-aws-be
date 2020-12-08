import { BadGatewayException, HttpStatus } from '@nestjs/common';
import axios, { Method } from 'axios';
import { Request, Response } from 'express';
import config from 'src/config';
import logger from 'src/utils/logger';

export function RouteMiddleware(
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: (err?) => {},
) {
  logger.log('originalUrl', req.originalUrl);
  logger.log('method', req.method);
  logger.log('body', req.body);

  const recipient = req.originalUrl.split('/')[1];
  logger.log('recipient', recipient);

  const recipientUrl = getRecipient(recipient);
  logger.log('recipientUrl', recipientUrl);
  if (!recipientUrl) {
    next(new BadGatewayException());
  }

  axios({
    method: req.method as Method,
    url: `${recipientUrl}${req.originalUrl}`,
    ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
  })
    .then((axiosRes) => {
      logger.log('response from recipient', axiosRes.data);
      res.json(axiosRes.data);
      next();
    })
    .catch((err) => {
      logger.log('error during fething data from recipient', err);
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

function getRecipient(urlName: string): string {
  switch (urlName) {
    case 'products':
      return config.PRODUCTS_SERVICE_URL;
    case 'cart':
      return config.CART_SERVICE_URL;
    default:
      return null;
  }
}
