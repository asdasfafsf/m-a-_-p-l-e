import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validationSchema';
import { JwtConfig } from './config/jwtConfig';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongooseConfig';

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
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
