import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: CreateUserDto) {
    const u = await this.users.create(dto);
    return { message: 'User registered', user: new UserEntity(u) };
  }
}
