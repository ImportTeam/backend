import { Test, TestingModule } from '@nestjs/testing';
import { IdentityVerificationsController } from './identity-verifications.controller';
import { IdentityVerificationsService } from './identity-verifications.service';

describe('IdentityVerificationsController', () => {
  let controller: IdentityVerificationsController;
  let service: IdentityVerificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentityVerificationsController],
      providers: [
        {
          provide: IdentityVerificationsService,
          useValue: {
            sendIdentityVerification: jest.fn(),
            confirmIdentityVerification: jest.fn(),
            resendIdentityVerification: jest.fn(),
            verifyPassIdentity: jest.fn(),
            verifyCertifiedIdentity: jest.fn(),
            getIdentityVerification: jest.fn(),
            listUserIdentityVerifications: jest.fn(),
            getLatestVerifiedIdentity: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IdentityVerificationsController>(IdentityVerificationsController);
    service = module.get<IdentityVerificationsService>(IdentityVerificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have all core endpoints defined', () => {
    expect(controller.sendIdentityVerification).toBeDefined();
    expect(controller.confirmIdentityVerification).toBeDefined();
    expect(controller.resendIdentityVerification).toBeDefined();
    expect(controller.verifyPass).toBeDefined();
    expect(controller.verifyCertified).toBeDefined();
    expect(controller.getIdentityVerification).toBeDefined();
    expect(controller.listIdentityVerifications).toBeDefined();
    expect(controller.getLatestVerifiedIdentity).toBeDefined();
  });
});
