import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ROLE_MAP } from '../common/constants/role.constant';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login.dto';
import { RequestRefreshDto } from './dto/request-refresh.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup({
      ...createUserDto,
      roles: [ROLE_MAP.USER],
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() refreshDto: RequestRefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
