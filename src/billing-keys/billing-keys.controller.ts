import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
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
import { BillingKeysService } from './billing-keys.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  IssueBillingKeyDto,
  ListBillingKeysDto,
  GetBillingKeyDto,
} from './dto';
import {
  BillingKeyResponseDto,
  BillingKeysListResponseDto,
  ErrorResponseDto,
} from '../common/dto/swagger-responses.dto';

@Controller('billing-keys')
@ApiTags('빌링키')
@ApiExtraModels(ErrorResponseDto, BillingKeyResponseDto, BillingKeysListResponseDto)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BillingKeysController {
  constructor(private readonly billingKeysService: BillingKeysService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '빌링키 발급',
    description: 'PortOne API를 통해 빌링키를 발급합니다. 정기결제에 필요합니다.',
  })
  @ApiBody({
    type: IssueBillingKeyDto,
    examples: {
      example1: {
        value: {
          paymentMethodSeq: 1,
          customerKey: 'customer_123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '빌링키 발급 성공',
    type: BillingKeyResponseDto,
    schema: {
      example: {
        seq: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        billingKeyId: 'billing-key-abc123',
        cardName: '신한카드',
        last4: '1234',
        isDefault: true,
        createdAt: '2025-11-12T13:59:44.000Z',
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
  })
  async issueBillingKey(
    @Body() dto: IssueBillingKeyDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.issueBillingKey(userUuid, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '빌링키 목록 조회',
    description: '로그인한 사용자의 모든 빌링키를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: BillingKeysListResponseDto,
    schema: {
      example: {
        data: [
          {
            seq: 1,
            uuid: '550e8400-e29b-41d4-a716-446655440004',
            billingKeyId: 'billing-key-abc123',
            cardName: '신한카드',
            last4: '1234',
            isDefault: true,
            createdAt: '2025-11-12T13:59:44.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
  })
  async listBillingKeys(
    @Query() dto: ListBillingKeysDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.listUserBillingKeys(userUuid, dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '빌링키 상세 조회',
    description: '특정 빌링키의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '빌링키 시퀀스',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: BillingKeyResponseDto,
    schema: {
      example: {
        seq: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        billingKeyId: 'billing-key-abc123',
        cardName: '신한카드',
        last4: '1234',
        isDefault: true,
        createdAt: '2025-11-12T13:59:44.000Z',
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
    description: '빌링키를 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async getBillingKey(
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: GetBillingKeyDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.getBillingKey(
      userUuid,
      String(id),
      dto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '빌링키 삭제',
    description: '빌링키를 삭제합니다. 기본 빌링키인 경우 다른 빌링키를 먼저 기본으로 설정해야 합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '빌링키 시퀀스',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '삭제 성공',
    schema: {
      example: {
        message: '빌링키가 삭제되었습니다',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '기본 빌링키는 삭제할 수 없음',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 토큰 필요)',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '빌링키를 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async deleteBillingKey(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.deleteBillingKey(userUuid, String(id));
  }

  @Post(':id/default')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '기본 빌링키 설정',
    description: '해당 빌링키를 기본 빌링키로 설정합니다. 기존 기본 빌링키는 자동으로 해제됩니다.',
  })
  @ApiParam({
    name: 'id',
    description: '빌링키 시퀀스',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '설정 성공',
    type: BillingKeyResponseDto,
    schema: {
      example: {
        seq: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        billingKeyId: 'billing-key-abc123',
        cardName: '신한카드',
        last4: '1234',
        isDefault: true,
        createdAt: '2025-11-12T13:59:44.000Z',
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
    description: '빌링키를 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async setDefaultBillingKey(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.setDefaultBillingKey(userUuid, String(id));
  }
}
