import { ApiProperty } from '@nestjs/swagger';
import { TopPaymentMethodResponseDto } from './top-payment-method-response.dto';

export class TopPaymentMethodMetricResponseDto {
  @ApiProperty({
    type: TopPaymentMethodResponseDto,
    nullable: true,
    description: '최다 사용 결제수단(Top1). 데이터가 없으면 null',
  })
  data: TopPaymentMethodResponseDto | null;
}
