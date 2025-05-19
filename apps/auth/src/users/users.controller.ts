import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserStateDto } from './dto/update-user-state.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Patch('/role')
  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    await this.usersService.updateRole(updateRoleDto);
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  async findManyUsers(@Query() query: FindManyUsersDto) {
    return await this.usersService.findManyUsers(query);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/state')
  async updateUserState(@Body() updateUserStateDto: UpdateUserStateDto) {
    await this.usersService.updateUserState(updateUserStateDto);
    return;
  }
}
