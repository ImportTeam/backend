import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('record')
  @ApiOperation({ summary: '결제 내역 기록', description: '사용자별 결제 내역 저장 및 적용 혜택 기록' })
  async record(@Body() dto: RecordPaymentDto) {
    return this.payments.record({
      userUuid: dto.userUuid,
      merchant: dto.merchant,
      amount: dto.amount,
      paymentMethodSeq: dto.paymentMethodSeq,
    });
  }
}
