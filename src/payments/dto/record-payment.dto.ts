import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RecordPaymentDto {
  @ApiProperty({
    description: '사용자 UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  userUuid: string;

  @ApiProperty({ description: '가맹점명', example: 'GS편의점' })
  @IsString()
  @IsNotEmpty()
  merchant: string;

  @ApiProperty({ description: '결제 금액(원)', example: 35000, minimum: 1 })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: false,
    description: '선택된 결제수단 seq',
    example: 1,
  })
  @IsOptional()
  paymentMethodSeq?: string;
}
