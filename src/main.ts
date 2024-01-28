import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({ origin: '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet()); //App protection to avoid the brute force XSS
  app.use(compression()); //Allow to compress the body response through Gzip

  await app.listen(process.env.PORT, async () => {
    console.log(`Server has started on PORT`);
  });
}
bootstrap();
