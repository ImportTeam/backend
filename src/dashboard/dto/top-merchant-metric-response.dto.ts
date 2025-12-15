import { ApiProperty } from '@nestjs/swagger';
import { TopMerchantResponseDto } from './top-merchant-response.dto';

export class TopMerchantMetricResponseDto {
  @ApiProperty({
    type: TopMerchantResponseDto,
    nullable: true,
    description: '가장 많이 쓴 쇼핑몰(Top1). 데이터가 없으면 null',
  })
  data: TopMerchantResponseDto | null;
}
