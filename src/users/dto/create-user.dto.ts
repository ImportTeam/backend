import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com', format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '로그인 비밀번호', example: 'SecurePassword123!', minLength: 8 })
  @MinLength(4)
  password: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsNotEmpty()
  name: string;
}
