// auth.service.spec.ts
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ROLE_MAP } from '../common/constants/role.constant';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    email: 'test@example.com',
    password: 'hashedPassword123',
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    role: ROLE_MAP.USER,
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    validatePassword: jest.fn(),
    createUser: jest.fn(),
    saveRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('토큰 생성', () => {
    it('Access 토큰을 생성해야 함', async () => {
      const payload = { sub: mockUser.uuid, role: mockUser.role };
      const expectedToken = 'access-token';

      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.generateAccessToken(payload);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload);
      expect(result).toBe(expectedToken);
    });

    it('Refresh 토큰을 생성해야 함', async () => {
      const payload = { sub: mockUser.uuid };
      const expectedToken = 'refresh-token';

      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.generateRefreshToken(payload);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload, {
        expiresIn: '7d',
      });
      expect(result).toBe(expectedToken);
    });
  });

  describe('로그인', () => {
    it('유효한 자격증명으로 토큰을 반환해야 함', async () => {
      const loginDto = {
        email: mockUser.email,
        password: 'password123',
      };
      const expectedTokens = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce(expectedTokens.access_token)
        .mockResolvedValueOnce(expectedTokens.refresh_token);
      mockUsersService.saveRefreshToken.mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockUsersService.saveRefreshToken).toHaveBeenCalledWith({
        uuid: mockUser.uuid,
        refreshToken: expectedTokens.refresh_token,
      });
      expect(result).toEqual(expectedTokens);
    });

    it('리프레시 토큰 저장 실패 시 UnauthorizedException을 발생시켜야 함', async () => {
      const loginDto = {
        email: mockUser.email,
        password: 'password123',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      mockUsersService.saveRefreshToken.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('회원가입', () => {
    it('새로운 사용자를 생성하고 사용자 정보를 반환해야 함', async () => {
      const createUserDto = {
        email: mockUser.email,
        password: 'password123',
        role: mockUser.role,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(mockUser);

      const result = await service.signup(createUserDto);

      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        email: mockUser.email,
        uuid: mockUser.uuid,
        role: mockUser.role,
      });
    });
  });
});
