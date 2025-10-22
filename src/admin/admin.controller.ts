import { Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Post('reset-seq')
  @ApiOperation({ summary: 'seq 재정렬 + AUTO_INCREMENT 리셋 (개발용)' })
  reset() {
    return this.admin.resetSequences();
  }
}
