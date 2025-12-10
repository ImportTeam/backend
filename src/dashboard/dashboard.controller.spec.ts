import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getSavingsThisMonth: jest.fn(),
            getTopMerchantThisMonth: jest.fn(),
            getTopPaymentMethodThisMonth: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have all required methods', () => {
    expect(controller.getSavings).toBeDefined();
    expect(controller.getTopMerchant).toBeDefined();
    expect(controller.getTopPaymentMethod).toBeDefined();
  });
});
