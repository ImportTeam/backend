import { Controller, UseGuards, Req, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { 
  ErrorResponseDto,
  UnauthorizedErrorDto,
} from '../common/dto/swagger-responses.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('사용자 관리')
@ApiExtraModels(ErrorResponseDto, UnauthorizedErrorDto)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Delete('current')
  @ApiOperation({ summary: '사용자 탈퇴', description: '현재 로그인한 사용자의 계정을 삭제합니다.' })
  async deleteCurrentUser(@Req() req: any) {
    const user = req.user;
    await this.users.deleteByUserId(user.uuid || user.seq.toString());
    return { message: 'User deleted' };
  }
}
