import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Benefits')
@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefits: BenefitsService) {}

  @Get('compare')
  @ApiOperation({ summary: '국내 결제 혜택 비교', description: '사용자의 결제수단과 매칭해 절약 금액 계산' })
  @ApiQuery({ name: 'userUuid', required: true })
  @ApiQuery({ name: 'merchant', required: true })
  @ApiQuery({ name: 'amount', required: true, type: Number })
  async compare(@Query('userUuid') userUuid: string, @Query('merchant') merchant: string, @Query('amount') amount: string) {
    return this.benefits.compareForUser(userUuid, merchant, Number(amount));
  }

  @Get('top3')
  @ApiOperation({ summary: 'TOP3 결제수단 추천', description: '가장 유리한 결제수단 3가지 추천' })
  @ApiQuery({ name: 'userUuid', required: true })
  @ApiQuery({ name: 'merchant', required: true })
  @ApiQuery({ name: 'amount', required: true, type: Number })
  async top3(@Query('userUuid') userUuid: string, @Query('merchant') merchant: string, @Query('amount') amount: string) {
    return this.benefits.top3ForUser(userUuid, merchant, Number(amount));
  }

  @Get('extract')
  @ApiOperation({ summary: 'HTML에서 혜택 추출(간단)', description: '페이지 HTML/텍스트에서 카드사 할인(%) 또는 금액(원) 패턴 추출' })
  @ApiQuery({ name: 'sample', required: true, description: 'html 또는 텍스트' })
  async extractSample(@Query('sample') sample: string) {
    return this.benefits.extractFromHtml(sample);
  }

  @Post('top3-from-html')
  @ApiOperation({ summary: '페이지 HTML 반영 TOP3 추천', description: '확장에서 수집한 HTML을 보내면, 추출된 혜택을 DB 혜택과 합쳐 TOP3를 반환' })
  async top3FromHtml(
    @Body() body: { userUuid: string; merchant: string; amount: number; html: string },
  ) {
    const extra = this.benefits.extractFromHtml(body.html);
    return this.benefits.top3WithExtraOffers(body.userUuid, body.merchant, body.amount, extra);
  }
}
