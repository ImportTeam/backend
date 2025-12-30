import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
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
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import {
  StartCardRegistrationRequestDto,
  StartCardRegistrationResponseDto,
} from './dto/start-card-registration.dto';
import { PaymentMethodDetailResponseDto } from './dto/payment-method-detail-response.dto';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  PaymentMethodResponseDto,
  PaymentMethodsListResponseDto,
  ErrorResponseDto,
} from '../common/dto/swagger-responses.dto';

@ApiTags('결제수단')
@ApiExtraModels(
  ErrorResponseDto,
  PaymentMethodResponseDto,
  PaymentMethodsListResponseDto,
)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  /**
   * curl 예시(로컬)
   * - Popbill 연동 카드 추가 흐름 시작(현재는 더미)
   * curl -X POST "http://localhost:3000/api/payment-methods/cards/registration/start" \
   *  -H "Authorization: Bearer <JWT>" \
   *  -H "Content-Type: application/json" \
   *  -d '{"returnUrl":"https://picsel.example.com/payment-methods/add/result"}'
   */
  @Post('cards/registration/start')
  @ApiOperation({
    summary: '새 카드 추가(연동 시작)',
    description:
      '사용자가 "카드 추가"를 눌렀을 때 Popbill 연동 흐름을 시작합니다. 현재는 Popbill 실제 호출 없이 FE가 붙을 수 있도록 더미 응답으로 동작합니다.',
  })
  @ApiBody({ type: StartCardRegistrationRequestDto })
  @ApiResponse({
    status: 201,
    description: '연동 시작 성공',
    type: StartCardRegistrationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  async startCardRegistration(
    @Req() req: any,
    @Body() _dto: StartCardRegistrationRequestDto,
  ) {
    const userUuid = req.user.uuid;
    const result =
      await this.paymentMethodsService.startCardRegistration(userUuid);
    return {
      message: '카드 등록 연동이 시작되었습니다.',
      data: result,
    };
  }

  @Post()
  @ApiOperation({
    summary: '결제수단 등록',
    description:
      '새로운 결제수단을 등록합니다. is_primary를 true로 설정하면 기존 주 결제수단이 해제됩니다.',
  })
  @ApiBody({
    type: CreatePaymentMethodDto,
    examples: {
      example1: {
        value: {
          alias: '내 신용카드',
          cardToken: 'card_token_from_provider',
          isPrimary: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '결제수단 등록 성공',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  async create(@Req() req: any, @Body() dto: CreatePaymentMethodDto) {
    const userUuid = req.user.uuid;
    const paymentMethod = await this.paymentMethodsService.create(
      userUuid,
      dto,
    );
    return {
      message: '결제수단이 등록되었습니다.',
      data: new PaymentMethodEntity(paymentMethod),
    };
  }

  @Get()
  @ApiOperation({
    summary: '내 결제수단 목록 조회',
    description:
      '로그인한 사용자의 모든 결제수단을 조회합니다. 주 결제수단이 먼저 표시됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: PaymentMethodsListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  async findAll(@Req() req: any) {
    const userUuid = req.user.uuid;
    const paymentMethods =
      await this.paymentMethodsService.findAllByUser(userUuid);
    return {
      count: paymentMethods.length,
      data: paymentMethods.map((pm) => new PaymentMethodEntity(pm)),
    };
  }

  @Get('statistics')
  @ApiOperation({
    summary: '결제수단 통계',
    description: '결제수단 개수, 타입별 개수, 주 결제수단 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    schema: {
      properties: {
        totalCount: { type: 'number', example: 3 },
        byCardType: {
          type: 'object',
          example: { VISA: 2, MASTERCARD: 1 },
        },
        primary: {
          type: 'object',
          $ref: '#/components/schemas/PaymentMethodResponseDto',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  async getStatistics(@Req() req: any) {
    const userUuid = req.user.uuid;
    const statistics = await this.paymentMethodsService.getStatistics(userUuid);
    return statistics;
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 결제수단 조회',
    description: '결제수단 ID로 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '결제수단 ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '접근 권한 없음',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '결제수단을 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userUuid = req.user.uuid;
    const paymentMethod = await this.paymentMethodsService.findOne(
      BigInt(id),
      userUuid,
    );
    return {
      data: new PaymentMethodEntity(paymentMethod),
    };
  }

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/payment-methods/1/details" -H "Authorization: Bearer <JWT>"
   */
  @Get(':id/details')
  @ApiOperation({
    summary: '카드 상세 정보 조회',
    description:
      '카드 상세 정보와 이번 달 사용 금액/횟수, 한도 정보를 조회합니다. 한도는 Popbill에서 가능하면 포함하고, 불가한 경우 대체 지표 구조로 반환합니다(현재는 더미).',
  })
  @ApiParam({ name: 'id', description: '결제수단 ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: PaymentMethodDetailResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '접근 권한 없음',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '결제수단을 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async getCardDetail(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userUuid = req.user.uuid;
    const detail = await this.paymentMethodsService.getCardDetail(
      BigInt(id),
      userUuid,
    );
    return { data: detail };
  }

  @Patch(':id')
  @ApiOperation({
    summary: '결제수단 수정',
    description: '결제수단의 별칭(alias)을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '결제수단 ID',
    example: '1',
  })
  @ApiBody({
    type: UpdatePaymentMethodDto,
    examples: {
      example1: {
        value: {
          alias: '업데이트된 카드명',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '결제수단을 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentMethodDto,
  ) {
    const userUuid = req.user.uuid;
    const updated = await this.paymentMethodsService.update(
      BigInt(id),
      userUuid,
      dto,
    );
    return {
      message: '결제수단이 수정되었습니다.',
      data: new PaymentMethodEntity(updated),
    };
  }

  @Patch(':id/primary')
  @ApiOperation({
    summary: '주 결제수단으로 설정',
    description:
      '해당 결제수단을 주 결제수단으로 설정합니다. 기존 주 결제수단은 자동으로 해제됩니다.',
  })
  @ApiParam({
    name: 'id',
    description: '결제수단 ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '설정 성공',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '결제수단을 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async setPrimary(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userUuid = req.user.uuid;
    const updated = await this.paymentMethodsService.setPrimary(
      BigInt(id),
      userUuid,
    );
    return {
      message: '주 결제수단으로 설정되었습니다.',
      data: new PaymentMethodEntity(updated),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: '결제수단 삭제',
    description:
      '결제수단을 삭제합니다. 주 결제수단인 경우 다른 결제수단을 먼저 주 결제수단으로 설정해야 합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '결제수단 ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '삭제 성공',
    schema: {
      properties: {
        message: { type: 'string', example: '결제수단이 삭제되었습니다.' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '주 결제수단은 삭제할 수 없음',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '결제수단을 찾을 수 없음',
    type: ErrorResponseDto,
  })
  async remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userUuid = req.user.uuid;
    return this.paymentMethodsService.remove(BigInt(id), userUuid);
  }
}
