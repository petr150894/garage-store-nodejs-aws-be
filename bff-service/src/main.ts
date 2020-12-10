import { NestFactory } from '@nestjs/core';
import logger from 'src/utils/logger';
import { NestLogger } from 'src/utils/nestLogger';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    bodyParser: true,
  });

  app.enableCors();

  // Use our logger instead of built in
  app.useLogger(new NestLogger());

  await app.listen(config.PORT, (): void => {
    logger.log(
      `App is running at host:${config.PORT} in ${config.NODE_ENV} mode`,
    );
    console.log('Press CTRL-C to stop\n');
  });
}
bootstrap();
