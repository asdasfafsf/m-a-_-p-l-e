import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { EventQueryFilterDto } from './dto/event-query-filter.dto';
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
  @Get('/:uuid')
  async getEvent(@Param('uuid') uuid: string) {
    return this.eventService.getEvent(uuid);
  }
}
