import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ErrorResponseDto } from '../common/dto/swagger-responses.dto';
import { AnalyticsService } from './analytics.service';
import { CategorySpendingResponseDto } from './dto/category-spending-response.dto';
import { MonthlySpendingTrendResponseDto } from './dto/monthly-spending-trend-response.dto';
import { AnalyticsTransactionsQueryDto } from './dto/transactions-query.dto';
import { AnalyticsTransactionsResponseDto } from './dto/transactions-response.dto';

@ApiTags('소비분석')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/analytics/charts/category" -H "Authorization: Bearer <JWT>"
   */
  @Get('charts/category')
  @ApiOperation({
    summary: '카테고리별 지출(최근 6개월)',
    description:
      '최근 6개월 지출을 카테고리별로 합산해 파이차트로 바로 그릴 수 있는 형태(라벨/값/비율)로 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: CategorySpendingResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  async getCategorySpending(@Req() req: any) {
    const userUuid = req.user.uuid;
    return this.svc.getCategorySpendingLastSixMonths(userUuid);
  }

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/analytics/charts/monthly" -H "Authorization: Bearer <JWT>"
   */
  @Get('charts/monthly')
  @ApiOperation({
    summary: '월간 지출 추이(최근 6개월)',
    description:
      '최근 6개월 월별 총 지출 합계를 반환합니다. (대시보드 월간 추이와 같은 성격의 데이터)',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: MonthlySpendingTrendResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  async getMonthlySpendingTrend(@Req() req: any) {
    const userUuid = req.user.uuid;
    return this.svc.getMonthlySpendingTrendLastSixMonths(userUuid);
  }

  /**
   * curl 예시(로컬)
   * - 기간/카테고리/쇼핑몰/결제수단/금액 필터 및 페이징 지원
   * curl -X GET "http://localhost:3000/api/analytics/transactions?from=2025-07-01T00:00:00.000Z&to=2025-12-15T23:59:59.999Z&categories=쇼핑,생활&merchants=쿠팡,GS편의점&paymentMethodIds=1,2&minAmount=1000&maxAmount=300000&page=1&size=20" -H "Authorization: Bearer <JWT>"
   */
  @Get('transactions')
  @ApiOperation({
    summary: '상세 지출 내역(거래 상세)',
    description:
      '거래처/거래 날짜/거래 소비액/실 결제 금액/사용 결제수단 정보를 반환합니다. 필터(기간/카테고리/쇼핑몰/결제수단/금액)와 페이징을 지원합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: AnalyticsTransactionsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  async getTransactions(
    @Req() req: any,
    @Query() query: AnalyticsTransactionsQueryDto,
  ) {
    const userUuid = req.user.uuid;
    return this.svc.getTransactions(userUuid, query);
  }
}
