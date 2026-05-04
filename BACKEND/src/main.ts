import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './helper/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Daftarkan Global Filter yang baru kita buat
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
