import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouteMiddleware } from 'src/utils/middlewares/route.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RouteMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
