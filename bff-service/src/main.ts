import { NestFactory } from '@nestjs/core';
import { LoggerInterceptor } from 'src/utils/interceptors/logger.interceptor';
import logger from 'src/utils/logger';
import { NestLogger } from 'src/utils/nestLogger';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.enableCors();

  // Use our logger instead of built in
  app.useLogger(new NestLogger());

  // Use interceptor to log all incoming requests
  app.useGlobalInterceptors(new LoggerInterceptor());

  await app.listen(config.PORT, (): void => {
    logger.log(
      `App is running at host:${config.PORT} in ${config.NODE_ENV} mode`,
    );
    console.log('Press CTRL-C to stop\n');
  });
}
bootstrap();
