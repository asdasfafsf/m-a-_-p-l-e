import { Body, Controller, Get, Put } from '@nestjs/common';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventService } from './event.service';

@Controller('api/v1/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Put('')
  async registerEvent(@Body() body: RegisterEventDto) {
    return this.eventService.registerEvent(body);
  }

  @Get('')
  async getEvents() {
    return this.eventService.getEvents();
  }
}
