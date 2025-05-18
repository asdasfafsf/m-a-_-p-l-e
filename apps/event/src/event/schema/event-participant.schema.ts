import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { EventParticipantCondition } from './event-participant-condition.schema';

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
  conditionMap: Record<string, EventParticipantCondition>;

  @Prop({ required: false, type: Object, default: {} })
  rewardClaimedMap?: {
    [rewardUuid: string]: {
      claimedAt: Date;
      [key: string]: any;
    };
  };
}

export const EventParticipantSchema =
  SchemaFactory.createForClass(EventParticipant);

EventParticipantSchema.index({ eventUuid: 1, userUuid: 1 }, { unique: true });
