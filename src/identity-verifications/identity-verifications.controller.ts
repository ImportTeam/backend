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

@ApiTags('본인 인증')
@Controller('identity/verifications')
@ApiExtraModels(ErrorResponseDto, IdentityVerificationResponseDto)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class IdentityVerificationsController {
  constructor(
    private readonly identityVerificationsService: IdentityVerificationsService,
  ) {}

  @Post(':portoneId/requests')
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

  @Post(':portoneId/confirmation')
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

  @Post(':portoneId/requests/resend')
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

  @Post('pass-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'PASS 본인인증 검증',
    description: 'Pass 인증 완료 후 반환된 identityId를 검증하여 사용자 본인인증 상태를 확정합니다.',
  })
  @ApiBody({
    type: VerifyPassIdentityDto,
    examples: { example1: { value: { returnedIdentityId: 'iv_1234567890' } } },
  })
  @ApiResponse({ status: 200, description: '검증 성공', type: IdentityVerificationResponseDto })
  @ApiResponse({ status: 400, description: '유효하지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패 (JWT 토큰 필요)', type: ErrorResponseDto })
  async verifyPass(
    @Body() dto: VerifyPassIdentityDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.verifyPassIdentity(
      userUuid,
      dto.returnedIdentityId,
    );
  }

  @Post('certified-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Certified 본인인증 검증',
    description: 'PortOne imp_uid를 이용해 인증 결과를 조회 및 검증합니다.',
  })
  @ApiBody({
    type: VerifyCertifiedDto,
    examples: { example1: { value: { impUid: 'imp_1234567890' } } },
  })
  @ApiResponse({ status: 200, description: '검증 성공', type: IdentityVerificationResponseDto })
  @ApiResponse({ status: 400, description: '유효하지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패 (JWT 토큰 필요)', type: ErrorResponseDto })
  async verifyCertified(
    @Body() dto: VerifyCertifiedDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.identityVerificationsService.verifyCertifiedIdentity(
      userUuid,
      dto.impUid,
    );
  }

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

  @Get('me/latest')
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
