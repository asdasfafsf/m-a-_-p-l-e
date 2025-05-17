// auth.service.spec.ts
import { ConflictException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LOGIN_FAIL_REASON_MAP } from '../common/constants/login-fail.constant';
import { ROLE_MAP } from '../common/constants/role.constant';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { UsersLogService } from '../users/users-log.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { InvalidEmailException } from './errors/InvalidEmailException';
import { InvalidPasswordException } from './errors/InvalidPasswordException';
import { MapleInvalidTokenException } from './errors/MapleInvalidTokenException';
import { MapleTokenExpiredExcetion } from './errors/MapleTokenExpiredException';

// uuidv7 모듈 모킹
jest.mock('uuidv7', () => ({
  uuidv4: jest.fn().mockReturnValue('mocked-jtl'),
  uuidv7: jest.fn().mockReturnValue('mocked-jtl'),
}));

describe('AuthService', () => {
  let service: AuthService;

  // 테스트용 목 데이터
  const mockUser = {
    email: 'test@example.com',
    password: 'hashedPassword123',
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    roles: [ROLE_MAP.USER],
    jtl: 'current-jtl',
  };

  // 모킹 객체 설정
  const jwtServiceMock = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const usersServiceMock = {
    findUserByEmail: jest.fn(),
    findUserByUuid: jest.fn(),
    validatePassword: jest.fn(),
    createUser: jest.fn(),
    saveRefreshToken: jest.fn(),
  };

  const usersLogServiceMock = {
    insertHistory: jest.fn(),
  };

  beforeEach(async () => {
    // 테스트용 모듈 생성
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: UsersLogService, useValue: usersLogServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // 모킹 초기화
    jest.clearAllMocks();
  });

  describe('액세스 토큰 생성', () => {
    it('액세스 토큰을 생성해야 함', async () => {
      const payload = { sub: mockUser.uuid, roles: mockUser.roles };
      const expectedToken = 'access-token';

      jwtServiceMock.signAsync.mockResolvedValue(expectedToken);

      const result = await service.generateAccessToken(payload);

      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(payload);
      expect(result).toBe(expectedToken);
    });
  });

  describe('리프레시 토큰 생성', () => {
    it('JTL이 포함된 리프레시 토큰을 생성해야 함', async () => {
      const payload = { sub: mockUser.uuid };
      const expectedToken = 'refresh-token';

      jwtServiceMock.signAsync.mockResolvedValue(expectedToken);

      const result = await service.generateRefreshToken(payload);

      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
        { sub: payload.sub, jtl: 'mocked-jtl' },
        { expiresIn: '7d' },
      );
      expect(result).toEqual({
        token: expectedToken,
        jtl: 'mocked-jtl',
      });
    });
  });

  describe('로그인', () => {
    it('로그인 성공 시 토큰을 반환해야 함', async () => {
      const loginDto = {
        email: mockUser.email,
        password: 'password123',
      };
      const expectedTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      usersServiceMock.findUserByEmail.mockResolvedValue(mockUser);
      usersServiceMock.validatePassword.mockResolvedValue(true);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce(expectedTokens.accessToken)
        .mockResolvedValueOnce(expectedTokens.refreshToken);
      usersServiceMock.saveRefreshToken.mockResolvedValue(undefined);
      usersLogServiceMock.insertHistory.mockResolvedValue(undefined);

      const result = await service.login(loginDto);

      expect(usersServiceMock.findUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(usersServiceMock.validatePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(usersServiceMock.saveRefreshToken).toHaveBeenCalledWith({
        uuid: mockUser.uuid,
        jtl: 'mocked-jtl',
      });
      expect(usersLogServiceMock.insertHistory).toHaveBeenCalledWith({
        userUuid: mockUser.uuid,
        success: true,
        failReason: undefined,
      });
      expect(result).toEqual({
        accessToken: expectedTokens.accessToken,
        refreshToken: expectedTokens.refreshToken,
      });
    });

    it('잘못된 이메일로 InvalidEmailException을 발생시켜야 함', async () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      usersServiceMock.findUserByEmail.mockResolvedValue(null);
      usersLogServiceMock.insertHistory.mockResolvedValue(undefined);

      await expect(service.login(loginDto)).rejects.toThrow(
        InvalidEmailException,
      );

      expect(usersLogServiceMock.insertHistory).toHaveBeenCalledWith({
        userUuid: undefined,
        success: false,
        failReason: LOGIN_FAIL_REASON_MAP.INVALID_EMAIL,
      });
    });

    it('잘못된 비밀번호로 InvalidPasswordException을 발생시켜야 함', async () => {
      const loginDto = {
        email: mockUser.email,
        password: 'wrong-password',
      };

      usersServiceMock.findUserByEmail.mockResolvedValue(mockUser);
      usersServiceMock.validatePassword.mockResolvedValue(false);
      usersLogServiceMock.insertHistory.mockResolvedValue(undefined);

      await expect(service.login(loginDto)).rejects.toThrow(
        InvalidPasswordException,
      );

      expect(usersLogServiceMock.insertHistory).toHaveBeenCalledWith({
        userUuid: undefined,
        success: false,
        failReason: LOGIN_FAIL_REASON_MAP.INVALID_PASSWORD,
      });
    });
  });

  describe('토큰 갱신', () => {
    it('유효한 리프레시 토큰으로 새 토큰을 발급해야 함', async () => {
      const refreshToken = 'valid-refresh-token';
      const decoded = { sub: mockUser.uuid, jtl: mockUser.jtl };
      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      jwtServiceMock.verify.mockReturnValue(decoded);
      usersServiceMock.findUserByUuid.mockResolvedValue(mockUser);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce(newTokens.accessToken)
        .mockResolvedValueOnce(newTokens.refreshToken);
      usersServiceMock.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.refresh({ refreshToken });

      expect(jwtServiceMock.verify).toHaveBeenCalledWith(refreshToken);
      expect(usersServiceMock.findUserByUuid).toHaveBeenCalledWith(decoded.sub);
      expect(result).toEqual({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });
    });

    it('만료된 토큰으로 MapleTokenExpiredException을 발생시켜야 함', async () => {
      const refreshToken = 'expired-token';

      jwtServiceMock.verify.mockImplementation(() => {
        throw new TokenExpiredError('Token expired', new Date());
      });

      await expect(service.refresh({ refreshToken })).rejects.toThrow(
        MapleTokenExpiredExcetion,
      );
    });

    it('유효하지 않은 토큰으로 MapleInvalidTokenException을 발생시켜야 함', async () => {
      const refreshToken = 'invalid-token';

      jwtServiceMock.verify.mockImplementation(() => {
        throw new JsonWebTokenError('Invalid token');
      });

      await expect(service.refresh({ refreshToken })).rejects.toThrow(
        MapleInvalidTokenException,
      );
    });

    it('존재하지 않는 사용자로 MapleInvalidTokenException을 발생시켜야 함', async () => {
      const refreshToken = 'valid-token';
      const decoded = { sub: 'non-existent-uuid', jtl: 'some-jtl' };

      jwtServiceMock.verify.mockReturnValue(decoded);
      usersServiceMock.findUserByUuid.mockResolvedValue(null);

      await expect(service.refresh({ refreshToken })).rejects.toThrow(
        MapleInvalidTokenException,
      );
    });

    it('JTL이 일치하지 않으면 MapleInvalidTokenException을 발생시켜야 함', async () => {
      const refreshToken = 'valid-token';
      const decoded = {
        sub: mockUser.uuid,
        jtl: 'different-jtl', // 토큰의 JTL
      };

      // 사용자 객체에는 다른 JTL이 있음
      const userWithDifferentJtl = {
        ...mockUser,
        jtl: 'current-jtl', // DB에 저장된 JTL
      };

      // 모킹 설정
      jwtServiceMock.verify.mockReturnValue(decoded);
      usersServiceMock.findUserByUuid.mockResolvedValue(userWithDifferentJtl);

      // 테스트 실행 및 검증
      await expect(service.refresh({ refreshToken })).rejects.toThrow(
        MapleInvalidTokenException,
      );

      // 호출 검증
      expect(jwtServiceMock.verify).toHaveBeenCalledWith(refreshToken);
      expect(usersServiceMock.findUserByUuid).toHaveBeenCalledWith(decoded.sub);
    });

    it('예상치 못한 에러 발생 시 MapleHttpException을 발생시켜야 함', async () => {
      const refreshToken = 'valid-token';

      jwtServiceMock.verify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(service.refresh({ refreshToken })).rejects.toThrow(
        MapleHttpException,
      );
    });
  });

  describe('회원가입', () => {
    it('새로운 사용자를 생성하고 정보를 반환해야 함', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'Password123!',
        roles: [ROLE_MAP.USER],
      };
      const createdUser = {
        email: createUserDto.email,
        uuid: 'new-uuid',
        roles: createUserDto.roles,
      };

      usersServiceMock.findUserByEmail.mockResolvedValue(null);
      usersServiceMock.createUser.mockResolvedValue(createdUser);

      const result = await service.signup(createUserDto);

      expect(usersServiceMock.findUserByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(usersServiceMock.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('이미 존재하는 이메일로 ConflictException을 발생시켜야 함', async () => {
      const createUserDto = {
        email: mockUser.email,
        password: 'Password123!',
        roles: [ROLE_MAP.USER],
      };

      usersServiceMock.findUserByEmail.mockResolvedValue(mockUser);

      await expect(service.signup(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
