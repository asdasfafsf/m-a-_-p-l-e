import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '../config/jwtConfig';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory(jwtConfig: ConfigType<typeof JwtConfig>) {
        return {
          secret: jwtConfig.secret,
          signOptions: { ...jwtConfig.signOptions },
        };
      },
      inject: [JwtConfig.KEY],
    }),
    UsersModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
