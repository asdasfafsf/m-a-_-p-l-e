import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
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
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { ApiBadRequestResponse } from '../swagger/decorators/api-bad-request-response.decorator';
import { ApiForbiddenResponse } from '../swagger/decorators/api-forbidden-response.decorator';
import { ApiUnauthorizedResponse } from '../swagger/decorators/api-unauthorized-response.decorator';
import { FindManyUsersDto } from './dto/find-many-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStateDto } from './dto/update-user-state.dto';
import { UsersService } from './users.service';

@ApiTags('유저 관련 API')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiBadRequestResponse()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '유저 역할 변경' })
  @ApiResponse({
    status: 200,
    description: '역할 변경 성공',
    schema: {
      example: {
        code: 'SUCCESS',
        message: '성공',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: `
      - ${ERROR_CODE_MAP.NOT_FOUND_USER}: ${ERROR_MESSAGE_MAP.NOT_FOUND_USER}
    `,
    schema: {
      example: {
        code: ERROR_CODE_MAP.NOT_FOUND_USER,
        message: ERROR_MESSAGE_MAP.NOT_FOUND_USER,
        data: null,
      },
    },
  })
  @Patch('role')
  @Roles(ROLE_MAP.ADMIN)
  async updateUserRole(@Body() body: UpdateUserRoleDto) {
    return this.usersService.updateUserRole(body);
  }

  @ApiOperation({ summary: '유저 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '유저 목록 조회 성공',
    schema: {
      example: {
        code: 'SUCCESS',
        message: '성공',
        data: {
          users: [
            {
              uuid: 'string',
              email: 'string',
              roles: ['USER'],
              createdAt: '2024-01-01T00:00:00.000Z',
              state: 'ACTIVE',
            },
          ],
          currentPage: 1,
          totalPage: 1,
          totalCount: 1,
        },
      },
    },
  })
  @Get('/')
  @Roles(ROLE_MAP.ADMIN)
  async findManyUsers(@Query() query: FindManyUsersDto) {
    return this.usersService.findManyUsers(query);
  }

  @ApiOperation({ summary: '유저 상태 변경' })
  @ApiResponse({
    status: 200,
    description: '상태 변경 성공',
    schema: {
      example: {
        code: 'SUCCESS',
        message: '상태 변경 성공',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: `
      - ${ERROR_CODE_MAP.NOT_FOUND_USER}: ${ERROR_MESSAGE_MAP.NOT_FOUND_USER}
    `,
    schema: {
      example: {
        code: ERROR_CODE_MAP.NOT_FOUND_USER,
        message: ERROR_MESSAGE_MAP.NOT_FOUND_USER,
        data: null,
      },
    },
  })
  @Patch('state')
  @Roles(ROLE_MAP.ADMIN)
  async updateUserState(@Body() body: UpdateUserStateDto) {
    return this.usersService.updateUserState(body);
  }
}
