import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { EVENT_TYPE_MAP } from '../constants/event.constant';
import { EventType } from '../types/event.type';

export type EventConditionDocument = HydratedDocument<EventCondition>;

@Schema()
export class EventCondition {
  @Prop({ required: true, default: () => uuidv7() })
  uuid: string;

  @Prop({ required: true, type: String, enum: Object.values(EVENT_TYPE_MAP) })
  type: EventType;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: true, default: () => new Date() })
  updatedAt: Date;

  @Prop({ required: true, type: Object })
  config: any;
}

export const EventConditionSchema =
  SchemaFactory.createForClass(EventCondition);

EventConditionSchema.set('timestamps', true);
EventConditionSchema.index({ eventUuid: 1, uuid: 1 }, { unique: true });
