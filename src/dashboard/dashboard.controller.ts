import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { SavingsMetricResponseDto } from './dto/savings-metric-response.dto';
import { TopMerchantMetricResponseDto } from './dto/top-merchant-metric-response.dto';
import { TopPaymentMethodMetricResponseDto } from './dto/top-payment-method-metric-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AiBenefitSummaryResponseDto } from './dto/ai-benefit-summary-response.dto';
import { AiBenefitSummaryMetricResponseDto } from './dto/ai-benefit-summary-metric-response.dto';
import { MonthlySavingsTrendResponseDto } from './dto/monthly-savings-trend-response.dto';
import { RecommendedPaymentMethodsTop3ResponseDto } from './dto/recommended-payment-methods-top3-response.dto';
import { RecentSiteTransactionsQueryDto } from './dto/recent-site-transactions.query.dto';
import { RecentSiteTransactionsResponseDto } from './dto/recent-site-transactions.dto';
import { ErrorResponseDto } from '../common/dto/swagger-responses.dto';

@ApiTags('대시보드')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  /**
   * curl 예시(로컬)
   * - Bearer 토큰이 필요합니다.
   * curl -X GET "http://localhost:3000/api/dashboard/metrics/savings" -H "Authorization: Bearer <JWT>"
   */
  @Get('metrics/savings')
  @ApiOperation({ summary: '이번 달 절약 금액', description: '이번 달 절약 금액(원화 표시)과 전년 동월 대비 절약 금액/증감 안내를 반환합니다.' })
  @ApiResponse({ status: 200, description: '조회 성공', type: SavingsMetricResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  async getSavings(@Req() req: any) {
    const userUuid = req.user.uuid;
    return { data: await this.svc.getSavingsThisMonth(userUuid) };
  }

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/dashboard/metrics/topmerchant" -H "Authorization: Bearer <JWT>"
   */
  @Get('metrics/topmerchant')
  @ApiOperation({
    summary: '가장 많이 쓴 쇼핑몰(Top1)',
    description: '최근(이번 달 우선, 없으면 최근 6개월) 지출 합계가 가장 높은 쇼핑몰 1곳을 반환합니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: TopMerchantMetricResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  async getTopMerchant(@Req() req: any) {
    const userUuid = req.user.uuid;
    return { data: await this.svc.getTopMerchant(userUuid) };
  }

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/dashboard/metrics/toppaymentmethod" -H "Authorization: Bearer <JWT>"
   */
  @Get('metrics/toppaymentmethod')
  @ApiOperation({
    summary: '최다 사용 결제수단(Top1)',
    description: '연결된 결제수단 중 이번 달 사용 금액 기준으로 Top1을 반환합니다. (데이터가 없으면 최근 6개월 기준으로 보정)',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: TopPaymentMethodMetricResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  async getTopPaymentMethod(@Req() req: any) {
    const userUuid = req.user.uuid;
    return { data: await this.svc.getTopPaymentMethod(userUuid) };
  }

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/dashboard/metrics/aibenefitsummary" -H "Authorization: Bearer <JWT>"
   */
  @Get('metrics/aibenefitsummary')
  @ApiOperation({
    summary: 'AI 추천 혜택(요약)',
    description: '최근 6개월 소비 요약 + 등록 결제수단 + (혜택 크롤링 데이터 연결 포인트)를 종합한 추천 결과/사유를 반환합니다. 현재는 더미 응답(스텁)입니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: AiBenefitSummaryMetricResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  async getAiBenefitSummary(@Req() req: any) {
    const userUuid = req.user.uuid;
    return { data: await this.svc.getAiBenefitSummary(userUuid) };
  }

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/dashboard/charts/monthlysavings" -H "Authorization: Bearer <JWT>"
   */
  @Get('charts/monthlysavings')
  @ApiOperation({
    summary: '월간 절약 변화 추이(최근 6개월)',
    description: '최근 6개월의 월간 지출/혜택(절약) 합계를 JSON으로 반환합니다. 절약 지표 계산은 서비스 함수로 분리되어 있습니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: MonthlySavingsTrendResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  async getMonthlySavingsTrend(@Req() req: any) {
    const userUuid = req.user.uuid;
    return this.svc.getMonthlySavingsTrend(userUuid);
  }

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/dashboard/charts/recommendedpaymentmethods" -H "Authorization: Bearer <JWT>"
   */
  @Get('charts/recommendedpaymentmethods')
  @ApiOperation({
    summary: '추천 결제수단 Top3',
    description: '혜택 크롤링 데이터 + 소비 패턴 + (LLM 추천 연결 포인트)를 종합해 Top3를 반환합니다. 현재는 규칙/더미 기반입니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: RecommendedPaymentMethodsTop3ResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  async getRecommendedPaymentMethodsTop3(@Req() req: any) {
    const userUuid = req.user.uuid;
    return this.svc.getRecommendedPaymentMethodsTop3(userUuid);
  }

  /**
   * curl 예시(로컬)
   * curl -X GET "http://localhost:3000/api/dashboard/transactions/recentbysite?page=1&size=10" -H "Authorization: Bearer <JWT>"
   */
  @Get('transactions/recentbysite')
  @ApiOperation({
    summary: '최근 사이트별 결제내역',
    description: '사이트명/결제일/결제수단/할인·적립 금액을 포함한 최근 결제 내역을 페이지 단위로 반환합니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: RecentSiteTransactionsResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  async getRecentTransactionsBySite(@Req() req: any, @Query() query: RecentSiteTransactionsQueryDto) {
    const userUuid = req.user.uuid;
    return this.svc.getRecentTransactionsBySite(userUuid, query);
  }
}
