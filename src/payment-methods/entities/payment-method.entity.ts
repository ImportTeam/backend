import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '../dto/create-payment-method.dto';

export class PaymentMethodEntity {
  @ApiProperty({ description: '결제수단 ID', example: '1' })
  seq: string;

  @ApiProperty({
    description: '사용자 UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_uuid: string;

  @ApiProperty({
    enum: PaymentType,
    description: '결제 수단 종류',
    example: PaymentType.CARD,
  })
  type: PaymentType;

  @ApiProperty({ description: '카드사명/간편결제 이름', example: '신한카드' })
  provider_name: string;

  @ApiProperty({ description: '카드 브랜드', example: 'VISA', nullable: true })
  card_brand?: string | null;

  @ApiProperty({ description: '카드번호 뒷자리 (표시용)', example: '1234' })
  last_4_nums: string;

  @ApiProperty({
    description: '마스킹된 카드번호',
    example: '**** **** **** 1234',
    nullable: true,
  })
  masked_card_number?: string | null;

  @ApiProperty({
    description: '카드 소유자 이름',
    example: '홍길동',
    nullable: true,
  })
  card_holder_name?: string | null;

  @ApiProperty({ description: '만료 월', example: '12', nullable: true })
  expiry_month?: string | null;

  @ApiProperty({ description: '만료 년도', example: '2028', nullable: true })
  expiry_year?: string | null;

  @ApiProperty({
    description: '만료일 (표시용)',
    example: '12/2028',
    nullable: true,
  })
  expiry_display?: string | null;

  @ApiProperty({ description: '카드 만료 여부', example: false })
  is_expired?: boolean;

  @ApiProperty({
    description: '청구지 주소',
    example: '서울시 강남구',
    nullable: true,
  })
  billing_address?: string | null;

  @ApiProperty({
    description: '청구지 우편번호',
    example: '06234',
    nullable: true,
  })
  billing_zip?: string | null;

  @ApiProperty({
    description: '사용자 지정 별칭',
    example: '주카드',
    nullable: true,
  })
  alias?: string | null;

  @ApiProperty({ description: '주 결제수단 여부', example: false })
  is_primary: boolean;

  @ApiProperty({ description: '등록일시' })
  created_at: Date;

  @ApiProperty({ description: '수정일시' })
  updated_at: Date;

  constructor(partial: any) {
    this.seq = partial.seq?.toString() ?? String(partial.seq);
    this.user_uuid = partial.user_uuid;
    this.type = partial.type;
    this.provider_name = partial.provider_name;
    this.card_brand = partial.card_brand;
    this.last_4_nums = partial.last_4_nums;

    // 마스킹된 카드번호 생성
    if (partial.last_4_nums) {
      this.masked_card_number = `**** **** **** ${partial.last_4_nums}`;
    }

    this.card_holder_name = partial.card_holder_name;
    this.expiry_month = partial.expiry_month;
    this.expiry_year = partial.expiry_year;

    // 만료일 표시
    if (partial.expiry_month && partial.expiry_year) {
      this.expiry_display = `${partial.expiry_month}/${partial.expiry_year}`;

      // 만료 여부 체크
      const now = new Date();
      const expiryDate = new Date(
        parseInt(partial.expiry_year),
        parseInt(partial.expiry_month) - 1,
        1,
      );
      this.is_expired = now > expiryDate;
    }

    this.billing_address = partial.billing_address;
    this.billing_zip = partial.billing_zip;
    this.alias = partial.alias;
    this.is_primary = partial.is_primary ?? false;
    this.created_at = partial.created_at;
    this.updated_at = partial.updated_at;
  }
}
