import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Pick<User, 'email' | 'uuid' | 'role'>> {
    const { email, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
      });

      const { uuid, role } = user.toObject();
      return { email: user.email, uuid, role };
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findUserByEmail(
    email: string,
  ): Promise<Pick<User, 'email' | 'password' | 'uuid' | 'role'> | null> {
    return this.userModel
      .findOne({ email })
      .select('email password uuid role')
      .lean();
  }

  async saveRefreshToken({
    uuid,
    refreshToken,
  }: {
    uuid: string;
    refreshToken: string;
  }): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { uuid },
      { $set: { refreshToken } },
    );
    return result.modifiedCount > 0;
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
