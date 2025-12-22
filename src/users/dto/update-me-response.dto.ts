import { ApiProperty } from '@nestjs/swagger';

export class UpdatedMeUserDto {
  @ApiProperty({ example: '1', description: '사용자 seq(BigInt -> string)' })
  seq: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid: string;

  @ApiProperty({ example: 'newemail@example.com', nullable: true })
  email: string | null;

  @ApiProperty({ example: '새로운 이름' })
  name: string;

  @ApiProperty({ example: '2025-01-13T14:25:00.000Z' })
  updated_at: string;
}

export class UpdateMeResponseDto {
  @ApiProperty({ example: '사용자 정보가 수정되었습니다.' })
  message: string;

  @ApiProperty({ type: UpdatedMeUserDto })
  user: UpdatedMeUserDto;
}
