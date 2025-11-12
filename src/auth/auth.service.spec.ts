import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    seq: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    name: 'Test User',
    password_hash: 'hashed_password',
    provider: null,
    provider_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockLoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createSocialUser: jest.fn(),
            deleteByUserId: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const mockToken = 'mock_jwt_token';
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.signAsync as jest.Mock).mockResolvedValue(mockToken);

      const result = await authService.login(mockLoginDto);

      expect(result.message).toBe('로그인 성공');
      expect(result.access_token).toBe(mockToken);
      expect(result.user.email).toBe(mockUser.email);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDto.password, mockUser.password_hash);
      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(mockLoginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle null password_hash gracefully', async () => {
      const userWithoutPassword = { ...mockUser, password_hash: null };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(userWithoutPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDto.password, '');
    });
  });

  describe('socialLogin', () => {
    const mockSocialUser = {
      email: 'social@example.com',
      name: 'Social User',
      provider: 'google',
      providerId: 'google_id_12345',
    };

    it('should return access token for existing social user', async () => {
      const mockToken = 'mock_jwt_token';
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.signAsync as jest.Mock).mockResolvedValue(mockToken);

      const result = await authService.socialLogin(mockSocialUser);

      expect(result.message).toBe('소셜 로그인 성공');
      expect(result.access_token).toBe(mockToken);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockSocialUser.email);
      expect(usersService.createSocialUser).not.toHaveBeenCalled();
    });

    it('should create new user if social user does not exist', async () => {
      const mockToken = 'mock_jwt_token';
      const newUser = { ...mockUser, ...mockSocialUser };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.createSocialUser as jest.Mock).mockResolvedValue(newUser);
      (jwtService.signAsync as jest.Mock).mockResolvedValue(mockToken);

      const result = await authService.socialLogin(mockSocialUser);

      expect(result.message).toBe('소셜 로그인 성공');
      expect(result.access_token).toBe(mockToken);
      expect(usersService.createSocialUser).toHaveBeenCalledWith({
        email: mockSocialUser.email,
        name: mockSocialUser.name,
        provider: mockSocialUser.provider,
        providerId: mockSocialUser.providerId,
      });
    });

    it('should include provider in response', async () => {
      const mockToken = 'mock_jwt_token';
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.signAsync as jest.Mock).mockResolvedValue(mockToken);

      const result = await authService.socialLogin(mockSocialUser);

      expect(result.user.provider).toBe(mockSocialUser.provider);
    });
  });

  describe('verifyEmailToken', () => {
    it('should return valid token payload', async () => {
      const mockPayload = { sub: '1', uuid: mockUser.uuid, email: mockUser.email };
      const mockToken = 'valid_token';
      (jwtService.verifyAsync as jest.Mock).mockResolvedValue(mockPayload);

      const result = await authService.verifyEmailToken(mockToken);

      expect(result.valid).toBe(true);
      expect(result.payload).toEqual(mockPayload);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockToken, {
        secret: process.env.JWT_SECRET,
      });
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const mockToken = 'invalid_token';
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error('Invalid token'));

      await expect(authService.verifyEmailToken(mockToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteUser', () => {
    it('should call usersService.deleteByUserId', async () => {
      const userId = '1';
      (usersService.deleteByUserId as jest.Mock).mockResolvedValue({
        deleted: true,
        userId,
      });

      const result = await authService.deleteUser(userId);

      expect(usersService.deleteByUserId).toHaveBeenCalledWith(userId);
      expect(result.deleted).toBe(true);
    });
  });
});
