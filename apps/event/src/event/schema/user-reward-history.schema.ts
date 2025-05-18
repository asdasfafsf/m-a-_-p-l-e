import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserRewardHistoryDocument = HydratedDocument<UserRewardHistory>;

@Schema({ timestamps: true })
export class UserRewardHistory {
  @Prop({ required: true })
  userUuid: string;

  @Prop({ required: true })
  eventUuid: string;

  @Prop({})
  rewardUuids: string[];

  @Prop()
  success: boolean;

  @Prop({ required: false })
  claimedAt?: Date;

  @Prop({ required: false })
  failedReason?: string;
}

export const UserRewardHistorySchema =
  SchemaFactory.createForClass(UserRewardHistory);

UserRewardHistorySchema.index({ userUuid: 1, eventUuid: 1 });
