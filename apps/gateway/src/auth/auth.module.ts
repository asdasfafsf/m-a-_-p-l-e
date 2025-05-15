import { Module } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { AuthController } from './auth.controller';

@Module({
  providers: [RolesGuard],
  controllers: [AuthController],
})
export class AuthModule {}
