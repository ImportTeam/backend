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
import { ApiTags } from '@nestjs/swagger';
import { PaymentHistoryService } from './payment-history.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('결제 내역')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserPaymentHistory(
    @Query() query: any,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.paymentHistoryService.getUserPaymentHistory(userUuid, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPaymentDetail(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.paymentHistoryService.getPaymentDetail(userUuid, id);
  }

  @Get('statistics/overview')
  @HttpCode(HttpStatus.OK)
  async getPaymentStatistics(@Request() req: any) {
    const userUuid = req.user.uuid;
    return this.paymentHistoryService.getPaymentStatistics(userUuid);
  }
}
