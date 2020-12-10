import { Request } from 'express';
import config from 'src/config';

export function getRecipient(
  req: Request,
): { recipient: string; recipientBaseUrl: string } {
  const recipientPath = req.originalUrl.split('/')[1];
  let recipient: string;
  if (recipientPath.indexOf('?') > 0) {
    recipient = recipientPath.split('?')[0];
  } else {
    recipient = recipientPath;
  }
  let recipientBaseUrl: string;

  switch (recipient) {
    case RECIPIENTS.PRODUCTS:
      recipientBaseUrl = config.PRODUCTS_SERVICE_URL;
      break;
    case RECIPIENTS.CART:
      recipientBaseUrl = config.CART_SERVICE_URL;
      break;
  }

  return {
    recipient,
    recipientBaseUrl,
  };
}

export const RECIPIENTS = {
  PRODUCTS: 'products',
  CART: 'cart',
};

export const REQUEST_WHITELIST = ['/', '/favicon.ico'];
