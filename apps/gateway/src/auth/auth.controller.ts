import { Controller, Post } from '@nestjs/common';

@Controller('api/v1/auth')
export class AuthController {
  @Post('login')
  async login() {}
}
