import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
@Module({
  imports: [HttpModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
