import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { BillingKeysService } from './billing-keys.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  IssueBillingKeyDto,
  ListBillingKeysDto,
  GetBillingKeyDto,
} from './dto';

@Controller('billing-keys')
@UseGuards(JwtAuthGuard)
export class BillingKeysController {
  constructor(private readonly billingKeysService: BillingKeysService) {}

  /**
   * POST /billing-keys
   * 빌링키 발급
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async issueBillingKey(
    @Body() dto: IssueBillingKeyDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.issueBillingKey(userUuid, dto);
  }

  /**
   * GET /billing-keys
   * 사용자의 빌링키 목록 조회
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async listBillingKeys(
    @Query() dto: ListBillingKeysDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.listUserBillingKeys(userUuid, dto);
  }

  /**
   * GET /billing-keys/:id
   * 빌링키 단건 조회
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBillingKey(
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: GetBillingKeyDto,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.getBillingKey(
      userUuid,
      String(id),
      dto,
    );
  }

  /**
   * DELETE /billing-keys/:id
   * 빌링키 삭제
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBillingKey(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.deleteBillingKey(userUuid, String(id));
  }

  /**
   * PATCH /billing-keys/:id/default
   * 기본 빌링키 설정
   */
  @Patch(':id/default')
  @HttpCode(HttpStatus.OK)
  async setDefaultBillingKey(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userUuid = req.user.uuid;
    return this.billingKeysService.setDefaultBillingKey(userUuid, String(id));
  }
}
