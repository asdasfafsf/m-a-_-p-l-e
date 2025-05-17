import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from '../auth/dto/create-user-dto';
import { ConflictEmailException } from '../auth/errors/ConflictEmailException';
import { PageDto } from '../common/dto/page.dto';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { UndefinedException } from '../common/errors/UndefinedException';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { Role } from '../common/types/role.type';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { InquiryUserDto } from './dto/inquiry-user.dto';
import { NotFoundUserException } from './errors/NotFoundUserException';
import { User, UserDocument } from './schema/user.schema';
import { UserState } from './types/user.type';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Pick<User, 'email' | 'uuid' | 'roles'>> {
    const { email, password, roles } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        roles,
      });

      const { uuid } = user.toObject();
      return { email: user.email, uuid, roles: user.roles };
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        this.logger.warn(`Email already exists`);
        throw new ConflictEmailException();
      }

      this.logger.error('Failed to create user', error);
      throw new UndefinedException();
    }
  }

  async findUserByUuid(
    uuid: string,
  ): Promise<Pick<
    User,
    'email' | 'password' | 'uuid' | 'jtl' | 'roles' | 'state'
  > | null> {
    return this.userModel
      .findOne({ uuid })
      .select('email password uuid jtl roles state')
      .lean();
  }

  async findUserByEmail(
    email: string,
  ): Promise<Pick<
    User,
    'email' | 'password' | 'uuid' | 'roles' | 'state'
  > | null> {
    return this.userModel
      .findOne({ email })
      .select('email password uuid roles state')
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
    roles,
  }: {
    uuid: string;
    roles: Role[];
  }): Promise<void> {
    const result = await this.userModel.updateOne(
      { uuid },
      { $set: { roles: roles } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundUserException();
    }

    if (result.modifiedCount === 0) {
      throw new UndefinedException();
    }
  }

  async findManyUsers(dto: FindManyUsersDto): Promise<
    {
      users: InquiryUserDto[];
    } & PageDto
  > {
    const { page = 1, limit = 10, roles } = dto;
    const queryFilter: any = {};
    if (roles && roles.length > 0) {
      queryFilter.role = { $in: roles };
    }
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      this.userModel
        .find(queryFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('uuid email roles createdAt updatedAt -_id')
        .lean(),
      this.userModel.countDocuments(queryFilter),
    ]);

    const totalPage = Math.ceil(totalCount / limit);

    return {
      users,
      totalCount,
      totalPage,
      currentPage: page,
    };
  }

  async updateUserState({
    uuid,
    state,
  }: {
    uuid: string;
    state: UserState;
  }): Promise<void> {
    const result = await this.userModel.updateOne(
      { uuid },
      { $set: { state: state } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundUserException();
    }
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
