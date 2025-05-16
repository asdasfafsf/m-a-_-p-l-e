import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/types/role.type';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateAccessToken({ sub, role }: { sub: string; role?: Role }) {
    const payload = { sub, role };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken({ sub }: { sub: string }) {
    const payload = { sub };
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
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
    const refresh_token = await this.generateRefreshToken({ sub: uuid });

    const isRefreshTokenSaved = await this.usersService.saveRefreshToken({
      uuid,
      refreshToken: refresh_token,
    });

    if (!isRefreshTokenSaved) {
      throw new UnauthorizedException('Failed to save refresh token');
    }

    return { access_token, refresh_token };
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
