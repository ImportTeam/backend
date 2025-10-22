import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234' })
  @MinLength(4)
  password: string;

  @ApiProperty({ example: '홍길동' })
  @IsNotEmpty()
  name: string;
}
