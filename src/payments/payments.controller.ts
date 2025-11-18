import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { 
  PaymentRecordResponseDto,
  ErrorResponseDto 
} from '../common/dto/swagger-responses.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('record')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ 
    summary: '결제 내역 기록', 
    description: '사용자별 결제 내역을 저장하고 적용된 혜택을 기록합니다' 
  })
  @ApiBody({
    type: RecordPaymentDto,
    examples: {
      example1: {
        value: {
          userUuid: '550e8400-e29b-41d4-a716-446655440000',
          merchant: 'GS편의점',
          amount: '50000',
          paymentMethodSeq: 1
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: '결제 내역 기록 성공',
    type: PaymentRecordResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '유효하지 않은 요청',
    type: ErrorResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: '사용자 또는 결제수단을 찾을 수 없음',
    type: ErrorResponseDto 
  })
  async record(@Body() dto: RecordPaymentDto) {
    return this.payments.record({
      userUuid: dto.userUuid,
      merchant: dto.merchant,
      amount: dto.amount,
      paymentMethodSeq: dto.paymentMethodSeq,
    });
  }
}
