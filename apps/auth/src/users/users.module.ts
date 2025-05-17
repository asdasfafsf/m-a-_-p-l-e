import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserLoginHistory,
  UserLoginHistorySchema,
} from './schema/user-login-history.schema';
import { User, UserSchema } from './schema/user.schema';
import { UsersLogService } from './users-log.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLoginHistory.name, schema: UserLoginHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UsersService, UsersLogService],
  exports: [UsersService, UsersLogService],
  controllers: [UsersController],
})
export class UsersModule {}
