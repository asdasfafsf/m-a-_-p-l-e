// auth.service.spec.ts
import { ConflictException, UnauthorizedException } from '@nestjs/common';
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

  describe('generateJwtToken', () => {
    it('should generate JWT token with correct payload', async () => {
      const payload = { uuid: mockUser.uuid, role: mockUser.role };
      const expectedToken = 'jwt-token';

      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.generateJwtToken(payload);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: payload.uuid,
        role: payload.role,
      });
      expect(result).toBe(expectedToken);
    });
  });

  describe('login', () => {
    it('should return token when credentials are valid', async () => {
      const loginDto = {
        email: mockUser.email,
        password: 'password123',
      };
      const expectedToken = 'jwt-token';

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.login(loginDto);

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(result).toEqual({ token: expectedToken });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto = {
        email: mockUser.email,
        password: 'wrongpassword',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signup', () => {
    it('사용자를 생성하고 토큰과 함께 사용자 정보를 반환해야 함', async () => {
      const createUserDto = {
        email: mockUser.email,
        password: 'password123',
        role: mockUser.role,
      };
      const expectedToken = 'jwt-token';

      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.signup(createUserDto);

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        email: mockUser.email,
        uuid: mockUser.uuid,
        role: mockUser.role,
        token: expectedToken,
      });
    });

    it('이미 존재하는 이메일로 회원가입 시도 시 ConflictException을 발생시켜야 함', async () => {
      const createUserDto = {
        email: mockUser.email,
        password: 'password123',
        role: mockUser.role,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);

      await expect(service.signup(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsersService.createUser).not.toHaveBeenCalled();
    });
  });
});
