import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EventReward } from './event-reward.schema';

export type UserRewardHistoryDocument = HydratedDocument<UserRewardHistory>;

@Schema({ timestamps: true })
export class UserRewardHistory {
  @Prop({ required: true })
  userUuid: string;

  @Prop({ required: true })
  eventUuid: string;

  @Prop({})
  rewards: EventReward[];

  @Prop()
  success: boolean;

  @Prop({ required: false })
  claimedAt?: Date;

  @Prop({ required: false, default: '' })
  failedReason?: string;
}

export const UserRewardHistorySchema =
  SchemaFactory.createForClass(UserRewardHistory);

UserRewardHistorySchema.index({ userUuid: 1, eventUuid: 1 });
UserRewardHistorySchema.index({ createdAt: 1 });
