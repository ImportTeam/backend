import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiExtraModels } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { 
  RegisterResponseDto,
  ErrorResponseDto,
  UnauthorizedErrorDto,
} from '../common/dto/swagger-responses.dto';

@ApiTags('로그인')
@ApiExtraModels(ErrorResponseDto, UnauthorizedErrorDto)
@Controller('auth')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  @ApiOperation({ 
    summary: '회원가입', 
    description: '일반 회원가입 (이메일, 비밀번호, 이름)' 
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'SecurePassword123!',
          name: '홍길동'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: '회원가입 성공', 
    type: RegisterResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '유효하지 않은 요청',
    type: ErrorResponseDto 
  })
  @ApiResponse({ 
    status: 409, 
    description: '이메일이 이미 존재함',
    type: ErrorResponseDto 
  })
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: CreateUserDto) {
    const u = await this.users.create(dto);
    return { message: 'User registered', user: new UserEntity(u) };
  }
}
