import { ApiProperty } from '@nestjs/swagger';
import { SavingsResponseDto } from './savings-response.dto';

export class SavingsMetricResponseDto {
  @ApiProperty({ type: SavingsResponseDto, description: '이번 달 절약 지표' })
  data: SavingsResponseDto;
}
