import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RecordPaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userUuid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  merchant: string;

  @ApiProperty({ example: 35000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false, description: '선택된 결제수단 seq' })
  @IsOptional()
  paymentMethodSeq?: string;
}
