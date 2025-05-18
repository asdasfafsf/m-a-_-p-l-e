import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { EVENT_STATE_MAP } from '../constants/event-state.constant';
import { EventState } from '../types/event-state.type';
import { EventReward, EventRewardDocument } from './event-reward.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, unique: true, default: () => uuidv7() })
  uuid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(EVENT_STATE_MAP),
    default: EVENT_STATE_MAP.PENDING,
  })
  state: EventState;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ required: true })
  endedAt: Date;

  @Prop({ required: false, type: Object })
  condition: any;

  @Prop({ required: false, type: [EventReward] })
  rewards: EventRewardDocument[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ state: 1, startedAt: 1, endedAt: 1 });
EventSchema.index({ uuid: 1 }, { unique: true });
