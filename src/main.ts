import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import config from './main.config';
import { setupNest } from './main.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, config);

  setupNest(app);

  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
