// users.service.spec.ts
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ROLE_MAP } from '../common/constants/role.constant';
import { UndefinedException } from '../common/errors/UndefinedException';
import { NotFoundUserException } from './errors/NotFoundUserException';
import { User } from './schema/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('updateRole', () => {
    it('사용자의 역할을 성공적으로 변경해야 함', async () => {
      // 준비
      const updateRoleDto = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        role: ROLE_MAP.ADMIN,
      };

      mockUserModel.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      // 실행
      await expect(service.updateRole(updateRoleDto)).resolves.not.toThrow();

      // 검증
      expect(mockUserModel.updateOne).toHaveBeenCalledWith(
        { uuid: updateRoleDto.uuid },
        { $set: { role: updateRoleDto.role } },
      );
    });

    it('존재하지 않는 사용자일 경우 NotFoundUserException을 발생시켜야 함', async () => {
      // 준비
      const updateRoleDto = {
        uuid: 'non-existent-uuid',
        role: ROLE_MAP.ADMIN,
      };

      mockUserModel.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      // 실행 및 검증
      await expect(service.updateRole(updateRoleDto)).rejects.toThrow(
        NotFoundUserException,
      );
    });

    it('역할 변경이 실패한 경우 UndefinedException을 발생시켜야 함', async () => {
      // 준비
      const updateRoleDto = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        role: ROLE_MAP.ADMIN,
      };

      mockUserModel.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0, // 변경된 문서 없음
      });

      // 실행 및 검증
      await expect(service.updateRole(updateRoleDto)).rejects.toThrow(
        UndefinedException,
      );
    });
  });
});
