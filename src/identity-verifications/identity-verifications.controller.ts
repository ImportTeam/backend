import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IdentityVerificationsService } from './identity-verifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  SendIdentityVerificationDto,
  ConfirmIdentityVerificationDto,
  ResendIdentityVerificationDto,
  GetIdentityVerificationDto,
  ListIdentityVerificationsDto,
} from './dto';

@Controller('identity-verifications')
@UseGuards(JwtAuthGuard)
export class IdentityVerificationsController {
  constructor(
    private readonly identityVerificationsService: IdentityVerificationsService,
  ) {}

  /**
   * POST /identity-verifications/:portoneId/send
   * 본인인증 요청 전송
   */
  @Post(':portoneId/send')
  @HttpCode(HttpStatus.OK)
  async sendIdentityVerification(
    @Param('portoneId') portoneId: string,
    @Body() dto: SendIdentityVerificationDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.sendIdentityVerification(
      userUuid,
      portoneId,
      dto,
    );
  }

  /**
   * POST /identity-verifications/:portoneId/confirm
   * 본인인증 확인 (OTP 검증)
   */
  @Post(':portoneId/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmIdentityVerification(
    @Param('portoneId') portoneId: string,
    @Body() dto: ConfirmIdentityVerificationDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.confirmIdentityVerification(
      userUuid,
      portoneId,
      dto,
    );
  }

  /**
   * POST /identity-verifications/:portoneId/resend
   * 본인인증 재전송
   */
  @Post(':portoneId/resend')
  @HttpCode(HttpStatus.OK)
  async resendIdentityVerification(
    @Param('portoneId') portoneId: string,
    @Query() dto: ResendIdentityVerificationDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.resendIdentityVerification(
      userUuid,
      portoneId,
      dto,
    );
  }

  /**
   * GET /identity-verifications/:portoneId
   * 본인인증 단건 조회
   */
  @Get(':portoneId')
  @HttpCode(HttpStatus.OK)
  async getIdentityVerification(
    @Param('portoneId') portoneId: string,
    @Query() dto: GetIdentityVerificationDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.getIdentityVerification(
      userUuid,
      portoneId,
      dto,
    );
  }

  /**
   * GET /identity-verifications
   * 본인인증 다건 조회 (사용자별)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async listIdentityVerifications(
    @Query() dto: ListIdentityVerificationsDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.listUserIdentityVerifications(
      userUuid,
      dto,
    );
  }
}
