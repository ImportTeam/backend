import { Controller, Get, Query } from '@nestjs/common';
import { PortOneService } from '../portone/portone.service';

@Controller('identity-verifications')
export class IdentityVerificationsPublicController {
  constructor(private readonly portOneService: PortOneService) {}

  // Simple public health/test endpoint for certified
  @Get('certified/test')
  async certifiedTest(@Query('impUid') impUid?: string) {
    if (!impUid) {
      return { ok: true, message: 'This is a public test endpoint for iamport certifications. Provide ?impUid=imp_xxx to fetch info.' };
    }

    const info = await this.portOneService.getCertificationByImpUid(impUid);
    return { ok: true, info };
  }

  // Public PASS returnedIdentityId tester
  @Get('verify-pass/test')
  async verifyPassTest(@Query('returnedIdentityId') returnedIdentityId?: string) {
    if (!returnedIdentityId) {
      return { ok: true, message: 'This is a public test endpoint for Pass verification. Provide ?returnedIdentityId=p_xxx to fetch.' };
    }

    const result = await this.portOneService.verifyPassIdentity(returnedIdentityId);
    return { ok: true, result };
  }
}
