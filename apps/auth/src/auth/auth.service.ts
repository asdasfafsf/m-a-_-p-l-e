import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role } from '../common/types/role.type';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateJwtToken({
    uuid,
    role,
    jwtOptions,
  }: {
    uuid: string;
    role: Role;
    jwtOptions?: JwtSignOptions;
  }) {
    const payload = { sub: uuid, role };
    return this.jwtService.signAsync(payload, jwtOptions);
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
    const access_token = await this.generateJwtToken({ uuid, role });

    return { access_token };
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
    const token = await this.generateJwtToken({ uuid, role });

    return { email, uuid, role, token };
  }
}
