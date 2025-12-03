import { Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';

@ApiTags('디버그')
@ApiExtraModels()
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Post('reset-seq')
  @ApiOperation({ 
    summary: '[개발용] seq 재정렬 + AUTO_INCREMENT 리셋',
    description: 'users, payment_methods, user_sessions 테이블의 seq를 1부터 순차적으로 재정렬하고 AUTO_INCREMENT를 리셋합니다. 개발 환경에서만 사용하세요.'
  })
  @ApiResponse({ status: 200, description: 'seq 재정렬 성공' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  reset() {
    return this.admin.resetSequences();
  }
}
