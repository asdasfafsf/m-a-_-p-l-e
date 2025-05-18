import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventActionKillMonsterService } from './event-action-kill-monster.service';
import { EventActionFactory } from './event-action.factory';
import { EventConditionKillMonsterService } from './event-condition-kill-monster.service';
import { EventConditionFactory } from './event-condition.factory';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import {
  EventCondition,
  EventConditionSchema,
} from './schema/event-condition.schema';
import {
  EventParticipant,
  EventParticipantSchema,
} from './schema/event-participant.schema';
import { EventReward, EventRewardSchema } from './schema/event-reward.schema';
import { Event, EventSchema } from './schema/event.schema';
import { EventConfigValidator } from './validator/event-config.validator';

@Module({
  providers: [
    EventService,
    EventConfigValidator,
    EventConditionFactory,
    EventActionFactory,
    EventActionKillMonsterService,
    EventConditionKillMonsterService,
  ],
  controllers: [EventController],
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventParticipant.name, schema: EventParticipantSchema },
      { name: EventReward.name, schema: EventRewardSchema },
      { name: EventCondition.name, schema: EventConditionSchema },
    ]),
  ],
})
export class EventModule {}
