import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ROLE_MAP } from '../common/constants/role.constant';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { ApiBadRequestResponse } from '../swagger/decorators/api-bad-request-response.decorator';
import { ApiForbiddenResponse } from '../swagger/decorators/api-forbidden-response.decorator';
import { ApiUnauthorizedResponse } from '../swagger/decorators/api-unauthorized-response.decorator';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminRolesDto } from './dto/update-admin-role.dto';

@ApiTags('관리자 관련 API')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiBadRequestResponse()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLE_MAP.ADMIN)
@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: '관리자 역할 수정' })
  @ApiResponse({
    status: 200,
    description: '관리자 역할 수정 성공',
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
  @Patch('/role')
  async updateRoles(@Body() updateAdminRolesDto: UpdateAdminRolesDto) {
    return this.adminService.updateAdminRole(updateAdminRolesDto);
  }

  @ApiOperation({ summary: '관리자 계정 생성' })
  @ApiResponse({
    status: 200,
    description: '관리자 계정 생성 성공',
    schema: {
      example: {
        code: 'SUCCESS',
        message: '성공',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: `
      - ${ERROR_CODE_MAP.CONFLICT_EMAIL}: ${ERROR_MESSAGE_MAP.CONFLICT_EMAIL}
    `,
    schema: {
      example: {
        code: ERROR_CODE_MAP.CONFLICT_EMAIL,
        message: ERROR_MESSAGE_MAP.CONFLICT_EMAIL,
        data: null,
      },
    },
  })
  @Post('/')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }
}
