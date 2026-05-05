import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './helper/global-exception.filter';
import { ResponseInterceptor } from './helper/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Daftarkan Global Filter untuk standardisasi Error
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Daftarkan Interceptor untuk standardisasi Response Sukses
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
