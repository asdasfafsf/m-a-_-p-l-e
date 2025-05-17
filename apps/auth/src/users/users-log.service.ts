import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserLoginHistory,
  UserLoginHistoryDocument,
} from './schema/user-login-history.schema';
@Injectable()
export class UsersLogService {
  private readonly logger = new Logger(UsersLogService.name);

  constructor(
    @InjectModel(UserLoginHistory.name)
    private readonly userLoginHistoryModel: Model<UserLoginHistoryDocument>,
  ) {}

  async insertHistory({
    userUuid,
    ipv4,
    ipv6,
    success,
    failReason,
    metadata,
  }: Pick<
    UserLoginHistory,
    'userUuid' | 'ipv4' | 'ipv6' | 'success' | 'failReason' | 'metadata'
  >) {
    const history = new this.userLoginHistoryModel({
      userUuid,
      ipv4,
      ipv6,
      success,
      failReason,
      metadata,
    });

    await history.save();
  }
}
