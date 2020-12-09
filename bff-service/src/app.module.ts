import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { RouteMiddleware } from 'src/utils/middlewares/route.middleware';
import { LoggerMiddleware } from 'src/utils/middlewares/logger.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, RouteMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
