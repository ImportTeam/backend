import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  BenefitsCompareResponseDto,
  ErrorResponseDto,
} from '../common/dto/swagger-responses.dto';

@ApiTags('혜택')
@ApiExtraModels(ErrorResponseDto, BenefitsCompareResponseDto)
@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefits: BenefitsService) {}

  @Get('comparisons')
  @ApiOperation({
    summary: '국내 결제 혜택 비교',
    description: '사용자의 결제수단과 매칭해 절약 금액을 비교합니다',
  })
  @ApiQuery({
    name: 'userUuid',
    required: true,
    description: '사용자 UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'merchant',
    required: true,
    description: '가맹점명',
    example: 'GS편의점',
  })
  @ApiQuery({
    name: 'amount',
    required: true,
    type: Number,
    description: '결제 금액 (원)',
    example: 50000,
  })
  @ApiResponse({
    status: 200,
    description: '혜택 비교 성공',
    type: BenefitsCompareResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 쿼리',
    type: ErrorResponseDto,
  })
  async compare(
    @Query('userUuid') userUuid: string,
    @Query('merchant') merchant: string,
    @Query('amount') amount: string,
  ) {
    return this.benefits.compareForUser(userUuid, merchant, Number(amount));
  }

  @Get('recommendations/top-three')
  @ApiOperation({
    summary: 'TOP3 결제수단 추천',
    description: '가장 유리한 결제수단 3가지를 추천합니다',
  })
  @ApiQuery({
    name: 'userUuid',
    required: true,
    description: '사용자 UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'merchant',
    required: true,
    description: '가맹점명',
    example: 'GS편의점',
  })
  @ApiQuery({
    name: 'amount',
    required: true,
    type: Number,
    description: '결제 금액 (원)',
    example: 50000,
  })
  @ApiResponse({
    status: 200,
    description: 'TOP3 추천 성공',
    type: BenefitsCompareResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 쿼리',
    type: ErrorResponseDto,
  })
  async top3(
    @Query('userUuid') userUuid: string,
    @Query('merchant') merchant: string,
    @Query('amount') amount: string,
  ) {
    return this.benefits.top3ForUser(userUuid, merchant, Number(amount));
  }

  @Get('extractions')
  @ApiOperation({
    summary: 'HTML에서 혜택 추출(간단)',
  })
  @ApiQuery({
    name: 'sample',
    required: true,
    description: 'html 또는 텍스트 샘플',
    example: '신한카드 5% 할인',
  })
  @ApiResponse({
    status: 200,
    description: '혜택 추출 성공',
    schema: {
      properties: {
        benefits: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'PERCENT' },
              value: { type: 'number', example: 5 },
              description: { type: 'string', example: '신한카드 할인' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 쿼리',
    type: ErrorResponseDto,
  })
  async extractSample(@Query('sample') sample: string) {
    return this.benefits.extractFromHtml(sample);
  }

  @Post('recommendations/from-html')
  @ApiOperation({
    summary: '페이지 HTML 반영 TOP3 추천',
  })
  @ApiBody({
    schema: {
      properties: {
        userUuid: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        merchant: { type: 'string', example: 'GS편의점' },
        amount: { type: 'number', example: 50000 },
        html: {
          type: 'string',
          example: '신한카드 5% 할인\nBC카드 3% 할인',
        },
      },
    },
    examples: {
      example1: {
        value: {
          userUuid: '550e8400-e29b-41d4-a716-446655440000',
          merchant: 'GS편의점',
          amount: 50000,
          html: '<html>신한카드 5% 할인</html>',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'HTML 반영 TOP3 추천 성공',
    type: BenefitsCompareResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청',
    type: ErrorResponseDto,
  })
  async top3FromHtml(
    @Body()
    body: {
      userUuid: string;
      merchant: string;
      amount: number;
      html: string;
    },
  ) {
    const extra = this.benefits.extractFromHtml(body.html);
    return this.benefits.top3WithExtraOffers(
      body.userUuid,
      body.merchant,
      body.amount,
      extra,
    );
  }
}
