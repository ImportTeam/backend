import { Test, TestingModule } from '@nestjs/testing';
import { BillingKeysController } from './billing-keys.controller';
import { BillingKeysService } from './billing-keys.service';

describe('BillingKeysController', () => {
  let controller: BillingKeysController;
  let service: BillingKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingKeysController],
      providers: [
        {
          provide: BillingKeysService,
          useValue: {
            issueBillingKey: jest.fn(),
            listUserBillingKeys: jest.fn(),
            getBillingKey: jest.fn(),
            deleteBillingKey: jest.fn(),
            setDefaultBillingKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BillingKeysController>(BillingKeysController);
    service = module.get<BillingKeysService>(BillingKeysService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have all required methods', () => {
    expect(controller.issueBillingKey).toBeDefined();
    expect(controller.listBillingKeys).toBeDefined();
    expect(controller.getBillingKey).toBeDefined();
    expect(controller.deleteBillingKey).toBeDefined();
    expect(controller.setDefaultBillingKey).toBeDefined();
  });
});
