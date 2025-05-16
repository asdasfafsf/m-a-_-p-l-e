import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { UndefinedException } from '../common/errors/UndefinedException';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { Role } from '../common/types/role.type';
import { NotFoundUserException } from './errors/NotFoundUserException';
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

  async findUserByUuid(
    uuid: string,
  ): Promise<Pick<
    User,
    'email' | 'password' | 'uuid' | 'role' | 'jtl'
  > | null> {
    return this.userModel
      .findOne({ uuid })
      .select('email password uuid role jtl')
      .lean();
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
    jtl,
  }: {
    uuid: string;
    jtl: string;
  }): Promise<void> {
    const result = await this.userModel.updateOne(
      { uuid },
      { $set: { jtl: jtl } },
    );

    if (result.modifiedCount === 0) {
      throw new MapleHttpException(
        {
          code: ERROR_CODE_MAP.ERROR,
          message: ERROR_MESSAGE_MAP.ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRole({
    uuid,
    role,
  }: {
    uuid: string;
    role: Role;
  }): Promise<void> {
    const result = await this.userModel.updateOne(
      { uuid },
      { $set: { role: role } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundUserException();
    }

    if (result.modifiedCount === 0) {
      throw new UndefinedException();
    }
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
