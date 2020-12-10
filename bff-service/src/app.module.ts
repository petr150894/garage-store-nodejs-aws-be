import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { RouteMiddleware } from 'src/utils/middlewares/route.middleware';
import { LoggerMiddleware } from 'src/utils/middlewares/logger.middleware';
import { CacheMiddleware } from './utils/middlewares/cache.middleware';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, CacheMiddleware, RouteMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
