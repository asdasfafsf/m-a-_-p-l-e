import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EventQueryFilterDto } from './dto/event-query-filter.dto';
import { RegisterEventRewardDto } from './dto/register-event-reward.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventService } from './event.service';

@Controller('api/v1/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

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
}
