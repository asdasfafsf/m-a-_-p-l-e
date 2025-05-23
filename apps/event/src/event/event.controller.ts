import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClaimRewardDto } from './dto/claim-reward-dto';
import { EventActionDto } from './dto/event-action.dto';
import { EventQueryFilterDto } from './dto/event-query-filter.dto';
import { GetRewardHistoryMeQueryDto } from './dto/get-reward-history-me.dto';
import { GetRewardHistoryQueryDto } from './dto/get-reward-history.dto';
import { RegisterEventRewardDto } from './dto/register-event-reward.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { UpdateEventStateDto } from './dto/update-event-state.dto';
import { EventActionFactory } from './event-action.factory';
import { EventConditionFactory } from './event-condition.factory';
import { EventService } from './event.service';

@Controller('api/v1/event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventActionFactory: EventActionFactory,
    private readonly eventConditionFactory: EventConditionFactory,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Put('')
  async registerEvent(@Body() body: RegisterEventDto) {
    return this.eventService.registerEvent(body);
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getEvents(@Query() query: EventQueryFilterDto) {
    return this.eventService.getEvents(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:eventUuid')
  async getEvent(@Param('eventUuid') eventUuid: string) {
    return this.eventService.getEvent(eventUuid);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/:eventUuid/reward')
  async registerEventReward(
    @Param('eventUuid') eventUuid: string,
    @Body() body: RegisterEventRewardDto,
  ) {
    return this.eventService.registerEventReward({ ...body, eventUuid });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:eventUuid/reward/:rewardUuid')
  async deleteEventReward(
    @Param('eventUuid') eventUuid: string,
    @Param('rewardUuid') rewardUuid: string,
  ) {
    return this.eventService.deleteEventReward({ eventUuid, rewardUuid });
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:eventUuid/state')
  async updateEventState(
    @Param('eventUuid') eventUuid: string,
    @Body() body: UpdateEventStateDto,
  ) {
    return this.eventService.updateEventState({ eventUuid, state: body.state });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/action')
  async doAction(@Body() body: EventActionDto) {
    const action = this.eventActionFactory.getAction(body.type);
    await action.execute(body);

    const condition = this.eventConditionFactory.getCondition(body.type);
    await condition.checkCondition({
      eventUuid: body.eventUuid,
      userUuid: body.userUuid,
    });

    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/:eventUuid/reward/claim')
  async claimReward(
    @Param('eventUuid') eventUuid: string,
    @Body() body: ClaimRewardDto,
  ) {
    return this.eventService.claimRewards({ ...body, eventUuid });
  }

  @HttpCode(HttpStatus.OK)
  @Get('/reward/history/me')
  async getRewardHistorysMe(@Query() query: GetRewardHistoryMeQueryDto) {
    return this.eventService.getRewardHistorys(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/reward/history/admin')
  async getRewardHistorysAdmin(@Query() query: GetRewardHistoryQueryDto) {
    return this.eventService.getRewardHistorys(query);
  }
}
