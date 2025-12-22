import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: '현재 비밀번호', example: 'Password123!' })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ description: '새 비밀번호', example: 'NewPassword123!', minLength: 4 })
  @MinLength(4)
  newPassword: string;
}
