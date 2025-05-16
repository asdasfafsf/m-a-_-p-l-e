import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { uuidv4 } from 'uuidv7';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { Role } from '../common/types/role.type';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { RequestRefreshDto } from './dto/request-refresh.dto';
import { MapleInvalidTokenException } from './errors/MapleInvalidTokenException';
import { MapleTokenExpiredExcetion } from './errors/MapleTokenExpiredException';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateAccessToken({ sub, role }: { sub: string; role?: Role }) {
    const payload = { sub, role };
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken({ sub }: { sub: string }) {
    const jtl = uuidv4();
    const payload = { sub, jtl };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    return { token, jtl };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { uuid, role } = user;
    const access_token = await this.generateAccessToken({ sub: uuid, role });
    const { token: newRefreshToken, jtl } = await this.generateRefreshToken({
      sub: uuid,
    });
    await this.usersService.saveRefreshToken({
      uuid,
      jtl,
    });

    return { accessToken: access_token, refreshToken: newRefreshToken };
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

      const { uuid, role } = user;

      const newAccessToken = await this.generateAccessToken({
        sub: uuid,
        role,
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
    const { email, uuid, role } = user;

    return { email, uuid, role };
  }
}
