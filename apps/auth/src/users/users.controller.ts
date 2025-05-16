import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/role')
  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    await this.usersService.updateRole(updateRoleDto);
    return;
  }

  @Get('/')
  async findManyUsers(@Query() query: FindManyUsersDto) {
    return await this.usersService.findManyUsers(query);
  }
}
