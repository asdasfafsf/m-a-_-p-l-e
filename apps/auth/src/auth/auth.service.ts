import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { uuidv4 } from 'uuidv7';
import { LOGIN_FAIL_REASON_MAP } from '../common/constants/login-fail.constant';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { LoginFailReason } from '../common/errors/types/login-fail.type';
import { Role } from '../common/types/role.type';
import { UsersLogService } from '../users/users-log.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { RequestRefreshDto } from './dto/request-refresh.dto';
import { InvalidEmailException } from './errors/InvalidEmailException';
import { InvalidPasswordException } from './errors/InvalidPasswordException';
import { MapleInvalidTokenException } from './errors/MapleInvalidTokenException';
import { MapleTokenExpiredExcetion } from './errors/MapleTokenExpiredException';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly usersLogService: UsersLogService,
  ) {}

  async generateAccessToken({ sub, roles }: { sub: string; roles?: Role[] }) {
    const payload = { sub, roles };
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken({ sub }: { sub: string }) {
    const jtl = uuidv4();
    const payload = { sub, jtl };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    return { token, jtl };
  }

  async login({ email, password }: { email: string; password: string }) {
    let success = false;
    let failReason: LoginFailReason | undefined;
    let userUuid: string | undefined;

    try {
      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        failReason = LOGIN_FAIL_REASON_MAP.INVALID_EMAIL;
        throw new InvalidEmailException();
      }

      const isPasswordValid = await this.usersService.validatePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        failReason = LOGIN_FAIL_REASON_MAP.INVALID_PASSWORD;
        throw new InvalidPasswordException();
      }

      const { uuid, roles } = user;
      const access_token = await this.generateAccessToken({ sub: uuid, roles });
      const { token: newRefreshToken, jtl } = await this.generateRefreshToken({
        sub: uuid,
      });
      await this.usersService.saveRefreshToken({
        uuid,
        jtl,
      });

      success = true;
      userUuid = uuid;

      return { accessToken: access_token, refreshToken: newRefreshToken };
    } finally {
      await this.usersLogService.insertHistory({
        userUuid,
        success,
        failReason,
      });
    }
  }

  async refresh({ refreshToken }: RequestRefreshDto) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const { sub, jtl: requestedJtl } = decoded;
      const user = await this.usersService.findUserByUuid(sub);

      if (!user) {
        throw new MapleInvalidTokenException();
      }

      if (user.jtl !== requestedJtl) {
        throw new MapleInvalidTokenException();
      }

      const { uuid, roles } = user;

      const newAccessToken = await this.generateAccessToken({
        sub: uuid,
        roles,
      });
      const { token: newRefreshToken, jtl } = await this.generateRefreshToken({
        sub: uuid,
      });
      await this.usersService.saveRefreshToken({
        uuid,
        jtl,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new MapleTokenExpiredExcetion();
      }

      if (error instanceof JsonWebTokenError) {
        throw new MapleInvalidTokenException();
      }

      if (error instanceof MapleHttpException) {
        throw error;
      }

      this.logger.error(error);
      throw new MapleHttpException(
        {
          code: ERROR_CODE_MAP.ERROR,
          message: ERROR_MESSAGE_MAP.ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const validateUser = await this.usersService.findUserByEmail(
      createUserDto.email,
    );

    if (validateUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.usersService.createUser(createUserDto);
    const { email, uuid, roles } = user;

    return { email, uuid, roles };
  }
}
