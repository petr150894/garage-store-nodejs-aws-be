import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import logger from '../logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();

    logger.log('------>');
    logger.log(`REQUEST`, req.method, req.url);
    if (req.method.toUpperCase() !== 'GET') {
      logger.log('BODY', req.body);
    }

    function logResult(err?: {
      status: number;
      message: string;
      stack: any;
    }): void {
      const logMethod = err ? logger.error : logger.log;
      logMethod(
        `${err ? 'ERROR' : 'RESPONSE'}`,
        req.method,
        req.url,
        err || 'SUCCESS',
      );
      logMethod('<------');
    }

    return next
      .handle()
      .pipe(
        tap(() => {
          logResult(null);
        }),
      )
      .pipe(
        catchError((err) => {
          logResult(err);
          return throwError(err);
        }),
      );
  }
}
