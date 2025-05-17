import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { LOGIN_FAIL_REASON_MAP } from '../../common/constants/login-fail.constant';
import { LoginFailReason } from '../../common/errors/types/login-fail.type';

export type UserLoginHistoryDocument = HydratedDocument<UserLoginHistory>;

@Schema()
export class UserLoginHistory {
  @Prop({ required: true, unique: true, default: () => uuidv7() })
  uuid: string;

  @Prop({ required: false, index: true })
  userUuid?: string;

  @Prop({ required: false })
  ipv4?: string;

  @Prop({ required: false })
  ipv6?: string;

  @Prop({ required: true })
  success: boolean;

  @Prop({
    required: false,
    type: String,
    enum: Object.values(LOGIN_FAIL_REASON_MAP),
  })
  failReason?: LoginFailReason;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const UserLoginHistorySchema =
  SchemaFactory.createForClass(UserLoginHistory);

UserLoginHistorySchema.index({ userUuid: 1, createdAt: -1 });
UserLoginHistorySchema.index({ success: 1, createdAt: -1 });
UserLoginHistorySchema.index({ failReason: 1 });
