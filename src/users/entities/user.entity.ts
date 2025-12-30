import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ description: '사용자 시퀀스 ID', example: '1' })
  seq: string;

  @ApiProperty({
    description: '사용자 UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  uuid: string;

  @ApiProperty({
    description: '이메일',
    example: 'test@example.com',
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({ description: '이름', example: '홍길동' })
  name: string;

  @ApiProperty({ description: '소셜 로그인 제공자', example: 'local' })
  social_provider: string;

  @ApiProperty({ description: '생성일시' })
  created_at: Date;

  @ApiProperty({ description: '수정일시' })
  updated_at: Date;

  constructor(p: any) {
    this.seq = p.seq?.toString?.() ?? String(p.seq);
    this.uuid = p.uuid;
    this.email = p.email;
    this.name = p.name;
    this.social_provider = p.social_provider;
    this.created_at = p.created_at;
    this.updated_at = p.updated_at;
  }
}
