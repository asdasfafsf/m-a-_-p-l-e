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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ROLE_MAP } from '../auth/constants/role.constant';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ResponseDto } from '../common/dto/response.dto';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { AuthUserRequest } from '../common/errors/types/auth-user.type';
import { ApiBadRequestResponse } from '../swagger/decorators/api-bad-request-response.decorator';
import { ApiForbiddenResponse } from '../swagger/decorators/api-forbidden-response.decorator';
import { ApiResponseDto } from '../swagger/decorators/api-response-dto.decorator';
import { ApiOperationWithRoles } from '../swagger/decorators/api-roles.decorator';
import { ApiUnauthorizedResponse } from '../swagger/decorators/api-unauthorized-response.decorator';
import { EventActionDto } from './dto/event-action.dto';
import { EventQueryFilterDto } from './dto/event-query-filter.dto';
import { EventsDto } from './dto/events.dto';
import { RegisterEventRewardDto } from './dto/register-event-reward.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { UpdateEventStateDto } from './dto/update-event-state.dto';
import { EventService } from './event.service';
@Controller('api/v1/event')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('이벤트 관련 API')
@ApiBadRequestResponse()
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Put('/')
  @HttpCode(HttpStatus.CREATED)
  @Roles(ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR)
  @ApiBearerAuth()
  @ApiOperationWithRoles(
    {
      summary: '이벤트 등록',
    },
    [ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR],
  )
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
  @HttpCode(HttpStatus.CREATED)
  async registerEvent(@Body() body: RegisterEventDto) {
    return this.eventService.registerEvent(body);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '이벤트 조회' })
  @ApiResponseDto(HttpStatus.OK, EventsDto)
  async getEvents(@Query() query: EventQueryFilterDto) {
    return this.eventService.getEvents(query);
  }

  @ApiOperation({ summary: '이벤트 상세 조회' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트 조회 실패',
    schema: {
      example: {
        code: ERROR_CODE_MAP.EVENT_NOT_FOUND,
        message: ERROR_MESSAGE_MAP.EVENT_NOT_FOUND,
      },
    },
  })
  //   @ApiResponseDto(HttpStatus.OK, EventDto)
  @ApiResponse({
    status: 200,
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
  @HttpCode(HttpStatus.OK)
  @Get('/:uuid')
  async getEvent(@Param('uuid') uuid: string) {
    return this.eventService.getEvent(uuid);
  }

  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
    schema: {
      example: {
        code: ERROR_CODE_MAP.EVENT_NOT_FOUND,
        message: ERROR_MESSAGE_MAP.EVENT_NOT_FOUND,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '이벤트 보상 등록 성공',
    type: ResponseDto,
  })
  @ApiBearerAuth()
  @ApiOperationWithRoles(
    {
      summary: '이벤트 보상 등록',
    },
    [ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR],
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('/:eventUuid/reward')
  @Roles(ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR)
  async registerEventReward(
    @Param('eventUuid') eventUuid: string,
    @Body() body: RegisterEventRewardDto,
  ) {
    return this.eventService.registerEventReward({
      ...body,
      eventUuid,
    });
  }

  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
    schema: {
      example: {
        code: ERROR_CODE_MAP.EVENT_NOT_FOUND,
        message: ERROR_MESSAGE_MAP.EVENT_NOT_FOUND,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트 보상 삭제 성공',
    type: ResponseDto,
  })
  @ApiBearerAuth()
  @ApiOperationWithRoles(
    {
      summary: '이벤트 보상 삭제',
    },
    [ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR],
  )
  @Roles(ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR)
  @HttpCode(HttpStatus.OK)
  @Delete('/:eventUuid/reward/:rewardUuid')
  async deleteEventReward(
    @Param('eventUuid') eventUuid: string,
    @Param('rewardUuid') rewardUuid: string,
  ) {
    return this.eventService.deleteEventReward({
      eventUuid,
      rewardUuid,
    });
  }

  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
    schema: {
      example: {
        code: ERROR_CODE_MAP.EVENT_NOT_FOUND,
        message: ERROR_MESSAGE_MAP.EVENT_NOT_FOUND,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트 상태 변경 성공',
    type: ResponseDto,
  })
  @ApiBearerAuth()
  @ApiOperationWithRoles(
    {
      summary: '이벤트 상태 변경',
    },
    [ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR],
  )
  @HttpCode(HttpStatus.OK)
  @Patch('/:eventUuid/state')
  @Roles(ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR)
  async updateEventState(
    @Param('eventUuid') eventUuid: string,
    @Body() body: UpdateEventStateDto,
  ) {
    return this.eventService.updateEventState({ eventUuid, state: body.state });
  }

  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `
        - ${ERROR_CODE_MAP.EVENT_NOT_FOUND}: ${ERROR_MESSAGE_MAP.EVENT_NOT_FOUND}
        - ${ERROR_CODE_MAP.EVENT_PARTICIPANT_NOT_FOUND}: ${ERROR_MESSAGE_MAP.EVENT_PARTICIPANT_NOT_FOUND}
    `,
    schema: {
      example: {
        code: ERROR_CODE_MAP.EVENT_NOT_FOUND,
        message: ERROR_MESSAGE_MAP.EVENT_NOT_FOUND,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('/action')
  @Roles(ROLE_MAP.USER, ROLE_MAP.ADMIN, ROLE_MAP.OPERATOR, ROLE_MAP.AUDITOR)
  async doAction(
    @Req() request: AuthUserRequest,
    @Body() body: EventActionDto,
  ) {
    return this.eventService.doAction({
      ...body,
      userUuid: request.user.uuid,
    });
  }
}
