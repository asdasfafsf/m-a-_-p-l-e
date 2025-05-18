import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventParticipantDocument = HydratedDocument<EventParticipant>;

@Schema()
export class EventParticipant {
  @Prop({ required: true })
  eventUuid: string;

  @Prop({ required: true })
  userUuid: string;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: true, default: () => new Date() })
  updatedAt: Date;

  @Prop({ required: true })
  config: Record<string, any>;
}

export const EventParticipantSchema =
  SchemaFactory.createForClass(EventParticipant);

EventParticipantSchema.index({ eventUuid: 1, userUuid: 1 }, { unique: true });
