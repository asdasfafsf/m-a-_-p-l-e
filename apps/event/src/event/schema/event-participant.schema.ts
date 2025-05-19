import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { EventParticipantCondition } from './event-participant-condition.schema';

export type ClaimedReward = {
  rewardUuid: string;
  type: string;
  name: string;
  count: number;
  itemId: string;
  claimedAt: Date;
};

export type EventParticipantDocument = HydratedDocument<EventParticipant>;

@Schema({ timestamps: true })
export class EventParticipant {
  @Prop({ required: true, unique: true, default: () => uuidv7() })
  uuid: string;

  @Prop({ required: true })
  eventUuid: string;

  @Prop({ required: true })
  userUuid: string;

  @Prop({ required: false })
  completedAt?: Date;

  @Prop({ required: true, type: Object, default: {} })
  condition: EventParticipantCondition;

  @Prop({
    required: true,
    type: [
      {
        rewardUuid: { type: String, required: true },
        type: { type: String, required: true },
        name: { type: String, required: true },
        count: { type: Number, required: true },
        itemId: { type: String, required: true },
        claimedAt: { type: Date, required: false },
      },
    ],
    default: [],
  })
  claimedRewards: ClaimedReward[];
}

export const EventParticipantSchema =
  SchemaFactory.createForClass(EventParticipant);

EventParticipantSchema.index({ eventUuid: 1, userUuid: 1 }, { unique: true });
EventParticipantSchema.index(
  { eventUuid: 1, userUuid: 1, 'claimedRewards.rewardUuid': 1 },
  { unique: true, sparse: true },
);
