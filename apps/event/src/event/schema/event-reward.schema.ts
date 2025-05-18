import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { REWARD_TYPE_MAP } from '../constants/event.reward.constant';
import { EventRewardType } from '../types/event-reward.type';

export type EventRewardDocument = HydratedDocument<EventReward>;

@Schema()
export class EventReward {
  @Prop({ required: true, default: () => uuidv7() })
  uuid: string;

  @Prop({ required: true, type: String, enum: Object.values(REWARD_TYPE_MAP) })
  type: EventRewardType;

  @Prop({ required: true, type: Object })
  config: Record<string, any>;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventReward);
EventRewardSchema.set('timestamps', true);
