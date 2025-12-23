import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            refreshTokens: jest.fn(),
            logout: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            socialLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have core auth endpoints defined', () => {
    expect(controller.refresh).toBeDefined();
    expect(controller.logout).toBeDefined();
    expect(controller.login).toBeDefined();
    expect(controller.register).toBeDefined();
  });
});
