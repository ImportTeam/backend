import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payment-history')
@UseGuards(JwtAuthGuard)
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {}

  /**
   * GET /payment-history
   * 사용자의 결제 내역 조회
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserPaymentHistory(
    @Query() query: any,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.paymentHistoryService.getUserPaymentHistory(userUuid, query);
  }

  /**
   * GET /payment-history/:id
   * 결제 단건 조회
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPaymentDetail(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.paymentHistoryService.getPaymentDetail(userUuid, id);
  }

  /**
   * GET /payment-history/statistics
   * 결제 통계 조회
   */
  @Get('statistics/overview')
  @HttpCode(HttpStatus.OK)
  async getPaymentStatistics(@Request() req: any) {
    const userUuid = req.user.uuid;
    return this.paymentHistoryService.getPaymentStatistics(userUuid);
  }
}
