import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '일반 회원가입 (이메일, 비밀번호, 이름)' })
  @ApiResponse({ status: 200, description: '회원가입 성공', type: UserEntity })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: CreateUserDto) {
    const u = await this.users.create(dto);
    return { message: 'User registered', user: new UserEntity(u) };
  }
}
