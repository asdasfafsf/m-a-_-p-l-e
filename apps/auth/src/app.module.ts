import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtConfig } from './config/jwtConfig';
import { MongooseConfig } from './config/mongooseConfig';
import { validationSchema } from './config/validationSchema';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ApiResponseInterceptor } from './interceptopr/api-response.interceptor';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [JwtConfig, MongooseConfig],
      envFilePath: [
        process.env.NODE_ENV === 'local'
          ? join(__dirname, '.env.local')
          : join(__dirname, '.env'),
      ],
    }),
    AuthModule,
    UsersModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
