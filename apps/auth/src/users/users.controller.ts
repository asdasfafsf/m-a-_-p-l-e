import { Body, Controller, Patch } from '@nestjs/common';
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
}
