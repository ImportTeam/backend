import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { SavingsResponseDto } from './dto/savings-response.dto';
import { TopMerchantResponseDto } from './dto/top-merchant-response.dto';
import { TopPaymentMethodResponseDto } from './dto/top-payment-method-response.dto';

@ApiTags('대시보드')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  @Get('savings')
  @ApiOperation({ summary: '이번 달 절약 금액 및 작년 대비 절약률' })
  @ApiResponse({ status: 200, type: SavingsResponseDto })
  async getSavings(@Query('userUuid') userUuid?: string) {
    return this.svc.getSavingsThisMonth(userUuid);
  }

  @Get('top-merchant')
  @ApiOperation({ summary: '이번 달 가장 많이 쓴 쇼핑몰' })
  @ApiResponse({ status: 200, type: TopMerchantResponseDto })
  async getTopMerchant(@Query('userUuid') userUuid?: string) {
    return this.svc.getTopMerchantThisMonth(userUuid);
  }

  @Get('top-payment-method')
  @ApiOperation({ summary: '이번 달 최다 사용 결제수단 (금액 기준)' })
  @ApiResponse({ status: 200, type: TopPaymentMethodResponseDto })
  async getTopPaymentMethod(@Query('userUuid') userUuid?: string) {
    return this.svc.getTopPaymentMethodThisMonth(userUuid);
  }
}
