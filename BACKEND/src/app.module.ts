import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { RatingsModule } from './ratings/ratings.module';
import { MajorsModule } from './app/majors/majors.module';
import { BatchesModule } from './app/batches/batches.module';
import { StudentsModule } from './app/students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //
      envFilePath: '.env', //
    }),

    BcryptModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProjectsModule,
    CartsModule,
    OrdersModule,
    PaymentsModule,
    RatingsModule,
    MajorsModule,
    BatchesModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
