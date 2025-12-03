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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { IdentityVerificationsService } from './identity-verifications.service';
import { Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  SendIdentityVerificationDto,
  ConfirmIdentityVerificationDto,
  ResendIdentityVerificationDto,
  GetIdentityVerificationDto,
  ListIdentityVerificationsDto,
  VerifyPassIdentityDto,
  VerifyCertifiedDto,
} from './dto';
import {
  IdentityVerificationResponseDto,
  ErrorResponseDto,
} from '../common/dto/swagger-responses.dto';

@Controller('identity-verifications')
@ApiTags('본인 인증')
@ApiExtraModels(ErrorResponseDto, IdentityVerificationResponseDto)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class IdentityVerificationsController {
  constructor(
    private readonly identityVerificationsService: IdentityVerificationsService,
  ) {}

  private readonly logger = new Logger('IdentityVerificationsController');

  /**
   * POST /identity-verifications/:portoneId/send
   * 본인인증 요청 전송
   */
  @Post(':portoneId/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '본인인증 요청 전송',
    description: 'PortOne API를 통해 본인인증 요청을 전송합니다.',
  })
  @ApiParam({
    name: 'portoneId',
    description: 'PortOne Identity ID',
    example: 'p_test_1234567890',
  })
  @ApiBody({
    type: SendIdentityVerificationDto,
    examples: {
      example1: {
        value: {
          name: '홍길동',
          phoneNumber: '01012345678',
          birthday: '1990-01-01',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '본인인증 요청 성공',
    type: IdentityVerificationResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        portoneId: 'p_test_1234567890',
        status: 'SENT',
        message: '본인인증 요청이 전송되었습니다',
        requestedAt: '2025-11-12T13:59:44.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 401,
        message: '유효하지 않은 토큰입니다',
        error: 'UnauthorizedException',
      },
    },
  })
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
  @ApiOperation({
    summary: '본인인증 확인 (OTP 검증)',
    description: '사용자가 입력한 OTP를 검증하여 본인인증을 완료합니다.',
  })
  @ApiParam({
    name: 'portoneId',
    description: 'PortOne Identity ID',
    example: 'p_test_1234567890',
  })
  @ApiBody({
    type: ConfirmIdentityVerificationDto,
    examples: {
      example1: {
        value: {
          otp: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '본인인증 확인 성공',
    type: IdentityVerificationResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        portoneId: 'p_test_1234567890',
        status: 'VERIFIED',
        message: '본인인증이 완료되었습니다',
        requestedAt: '2025-11-12T13:59:44.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 OTP',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
  })
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
  @ApiOperation({
    summary: '본인인증 OTP 재전송',
    description: '본인인증 OTP를 다시 전송합니다.',
  })
  @ApiParam({
    name: 'portoneId',
    description: 'PortOne Identity ID',
    example: 'p_test_1234567890',
  })
  @ApiBody({
    type: ResendIdentityVerificationDto,
    examples: {
      example1: {
        value: {
          method: 'SMS',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP 재전송 성공',
    type: IdentityVerificationResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        portoneId: 'p_test_1234567890',
        status: 'SENT',
        message: 'OTP가 다시 전송되었습니다',
        requestedAt: '2025-11-12T13:59:44.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
  })
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
  @ApiOperation({
    summary: '본인인증 상태 조회 (단건)',
    description: 'PortOne Identity ID로 본인인증 상태를 조회합니다.',
  })
  @ApiParam({
    name: 'portoneId',
    description: 'PortOne Identity ID',
    example: 'p_test_1234567890',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: IdentityVerificationResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        portoneId: 'p_test_1234567890',
        status: 'VERIFIED',
        message: '본인인증 완료',
        requestedAt: '2025-11-12T13:59:44.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '본인인증 기록을 찾을 수 없음',
    type: ErrorResponseDto,
  })
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
  @ApiOperation({
    summary: '본인인증 목록 조회 (사용자별)',
    description: '로그인한 사용자의 모든 본인인증 기록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        example: {
          id: '550e8400-e29b-41d4-a716-446655440003',
          portoneId: 'p_test_1234567890',
          status: 'VERIFIED',
          message: '본인인증 완료',
          requestedAt: '2025-11-12T13:59:44.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
  })
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

  /**
   * POST /identity-verifications/verify
   * Pass 본인인증 검증 (2차 인증)
   * Frontend에서 받은 returnedIdentityId를 PortOne에서 검증
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pass 본인인증 검증 (2차 인증)',
    description:
      'Frontend에서 Pass 인증 완료 후 returnedIdentityId를 backend에서 검증합니다.',
  })
  @ApiBody({ type: VerifyPassIdentityDto })
  @ApiResponse({
    status: 200,
    description: 'Pass 인증 검증 성공',
    schema: { 
      example: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        status: 'VERIFIED',
        name: '홍길동',
        phone: '010-1234-5678',
        ci: 'encoded_ci_value',
        di: 'encoded_di_value',
        verifiedAt: '2025-11-12T16:00:00.000Z',
        message: 'Pass 인증이 완료되었습니다',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Pass 인증 검증 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
  })
  async verifyPassIdentity(
    @Body() dto: VerifyPassIdentityDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.verifyPassIdentity(
      userUuid,
      dto.returnedIdentityId,
    );
  }

  /**
   * POST /identity-verifications/certified
   * imp_uid로 인증 결과 확인(예: KG이니시스)
   */
  @Post('certified')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Certified 본인인증 검증 (imp_uid)',
    description: 'Frontend에서 imp_uid를 전송하면 포트원(iamport)으로부터 인증 정보를 조회합니다.',
  })
  @ApiBody({ type: VerifyCertifiedDto })
  async verifyCertified(
    @Body() dto: VerifyCertifiedDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    this.logger.debug(`verifyCertified called: impUid=${dto.impUid}, userUuid=${userUuid}`);
    return this.identityVerificationsService.verifyCertifiedIdentity(
      userUuid,
      dto.impUid,
    );
  }

  /**
   * GET /identity-verifications/my-verified
   * 현재 사용자의 최신 Pass 인증 정보 조회
   */
  @Get('my-verified')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '현재 사용자의 최신 Pass 인증 정보 조회',
    description: '로그인한 사용자의 최신 Pass 인증 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: '홍길동',
        phone: '010-1234-5678',
        ci: 'encoded_ci_value',
        di: 'encoded_di_value',
        verifiedAt: '2025-11-12T16:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '인증된 정보가 없음',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
  })
  async getLatestVerifiedIdentity(
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.getLatestVerifiedIdentity(userUuid);
  }
}
