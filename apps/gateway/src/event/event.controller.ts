import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROLE_MAP } from '../auth/constants/role.constant';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBadRequestResponse } from '../swagger/decorators/api-bad-request-response.decorator';
import { ApiForbiddenResponse } from '../swagger/decorators/api-forbidden-response.decorator';
import { ApiUnauthorizedResponse } from '../swagger/decorators/api-unauthorized-response.decorator';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventService } from './event.service';

@Controller('api/v1/event')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Event')
@ApiBadRequestResponse()
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiTags('Event')
  @Put('/')
  @HttpCode(HttpStatus.CREATED)
  @Roles(ROLE_MAP.ADMIN)
  @ApiOperation({ summary: '이벤트 등록' })
  @ApiResponse({
    status: 201,
    description: '이벤트 등록 성공',
    schema: {
      example: {
        code: 'SUCCESS',
        message: '성공',
        data: {
          name: '야야',
          uuid: '0196e7f4-bbed-7cbb-ab64-05467d0492c4',
          state: 'PENDING',
          startedAt: '2025-05-18T11:55:29.000Z',
          endedAt: '2025-05-30T11:55:29.000Z',
          condition: {
            type: 'KILL_MONSTER',
            startedAt: '2025-05-18T11:55:29.000Z',
            endedAt: '2025-05-30T11:55:29.000Z',
            config: [
              {
                monsterUuid: '123',
                monsterName: '주황버섯',
                killCount: 500,
              },
              {
                monsterUuid: '124',
                monsterName: '주황버섯2',
                killCount: 500,
              },
            ],
          },
          rewards: [
            {
              type: 'ITEM',
              itemId: '1',
              name: '눈물',
              uuid: '0196e7f4-bbed-7cbb-ab64-0545f73304aa',
              count: 1,
              createdAt: '2025-05-19T09:51:37.967Z',
              updatedAt: '2025-05-19T09:51:37.967Z',
            },
          ],
        },
      },
    },
  })
  async registerEvent(@Body() body: RegisterEventDto) {
    return this.eventService.registerEvent(body);
  }
}
