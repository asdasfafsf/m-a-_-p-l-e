import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { ApiBadRequestResponse } from '../swagger/decorators/api-bad-request-response.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/sign-up.dto';

@ApiTags('인증 관련 API')
@ApiBadRequestResponse()
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다',
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      example: {
        code: 'SUCCESS',
        message: '성공',
        data: {
          accessToken: 'string',
          refreshToken: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'CONFLICT_EMAIL: 이미 등록된 이메일입니다.',
    schema: {
      example: {
        code: ERROR_CODE_MAP.CONFLICT_EMAIL,
        message: ERROR_MESSAGE_MAP.CONFLICT_EMAIL,
        data: null,
      },
    },
  })
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인합니다',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      example: {
        code: 'SUCCESS',
        message: '성공',
        data: {
          accessToken: 'string',
          refreshToken: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: `
    - INVALID_CREDENTIAL: 유저 정보가 일치하지 않습니다.
    - INACTIVE_USER: 비활성화된 유저입니다.
    `,
    schema: {
      example: {
        code: ERROR_CODE_MAP.INVALID_CREDENTIAL,
        message: ERROR_MESSAGE_MAP.INVALID_CREDENTIAL,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND_USER: 존재하지 않는 유저입니다.',
    schema: {
      example: {
        code: ERROR_CODE_MAP.NOT_FOUND_USER,
        message: ERROR_MESSAGE_MAP.NOT_FOUND_USER,
        data: null,
      },
    },
  })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiOperation({
    summary: '토큰 갱신',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 리프레시 토큰',
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    schema: {
      example: {
        code: 'SUCCESS',
        message: '토큰 재발급 성공',
        data: {
          accessToken: 'string',
          refreshToken: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: `
    - INVALID_TOKEN: 유효하지 않은 토큰입니다.
    - TOKEN_EXPIRED: 만료된 토큰입니다.
    `,
    schema: {
      example: {
        code: ERROR_CODE_MAP.INVALID_TOKEN,
        message: ERROR_MESSAGE_MAP.INVALID_TOKEN,
        data: null,
      },
    },
  })
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const header = req.headers;
    const authorization = header['authorization'] || header['Authorization'];

    if (!authorization) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const tokenMatch = authorization.match(/^Bearer\s+(.*)$/i);

    if (!tokenMatch) {
      throw new UnauthorizedException('유효한.토큰이 필요합니다.');
    }
    const token = tokenMatch[1];

    return this.authService.refreshToken({ refreshToken: token });
  }
}
