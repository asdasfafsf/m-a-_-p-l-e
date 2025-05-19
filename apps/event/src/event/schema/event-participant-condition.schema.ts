import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { EVENT_TYPE_MAP } from '../constants/event.constant';
import { EventType } from '../types/event.type';

export type EventParticipantConditionDocument =
  HydratedDocument<EventParticipantCondition>;

@Schema({ timestamps: true })
export class EventParticipantCondition {
  @Prop({ required: true, unique: true, default: () => uuidv7() })
  uuid: string;

  @Prop({ required: true })
  eventConditionUuid: string;

  @Prop({ required: true, type: String, enum: Object.values(EVENT_TYPE_MAP) })
  type: EventType;

  @Prop({ required: false })
  completedAt?: Date;

  @Prop({ required: true, type: Object })
  config: any;
}

export const EventParticipantConditionSchema = SchemaFactory.createForClass(
  EventParticipantCondition,
);

EventParticipantConditionSchema.index(
  { eventUuid: 1, userUuid: 1 },
  { unique: true },
);
