import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { EVENT_STATE_MAP } from '../constants/event-state.constant';

export type EventParticipantConditionDocument =
  HydratedDocument<EventParticipantCondition>;

@Schema()
export class EventParticipantCondition {
  @Prop({ required: true })
  eventUuid: string;

  @Prop({ required: true })
  userUuid: string;

  @Prop({ required: true, unique: true, default: () => uuidv7() })
  uuid: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: true, default: () => new Date() })
  updatedAt: Date;

  @Prop({ required: true, type: String, enum: Object.values(EVENT_STATE_MAP) })
  state: string;

  @Prop({ required: true, type: Object })
  config: Record<string, any>;
}

export const EventParticipantConditionSchema = SchemaFactory.createForClass(
  EventParticipantCondition,
);

EventParticipantConditionSchema.index(
  { eventUuid: 1, userUuid: 1 },
  { unique: true },
);
