import { Test, TestingModule } from '@nestjs/testing';
import { BenefitsController } from './benefits.controller';
import { BenefitsService } from './benefits.service';

describe('BenefitsController', () => {
  let controller: BenefitsController;
  let service: BenefitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BenefitsController],
      providers: [
        {
          provide: BenefitsService,
          useValue: {
            compareForUser: jest.fn(),
            top3ForUser: jest.fn(),
            extractFromHtml: jest.fn(),
            top3WithExtraOffers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BenefitsController>(BenefitsController);
    service = module.get<BenefitsService>(BenefitsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have all required methods', () => {
    expect(controller.compare).toBeDefined();
    expect(controller.top3).toBeDefined();
    expect(controller.extractSample).toBeDefined();
    expect(controller.top3FromHtml).toBeDefined();
  });
});
