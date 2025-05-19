import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthServerConfig } from './config/authServerConfig';
import { EventServerConfig } from './config/eventServerConfig';
import { JwtConfig } from './config/jwtConfig';
import { validationSchema } from './config/validationSchema';
import { EventModule } from './event/event.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [JwtConfig, AuthServerConfig, EventServerConfig],
      envFilePath: [
        process.env.NODE_ENV === 'local'
          ? join(__dirname, '.env.local')
          : join(__dirname, '.env'),
      ],
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
