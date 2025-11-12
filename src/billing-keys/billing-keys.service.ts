import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PortOneService } from '../portone/portone.service';
import { encrypt, getLast4Digits } from '../common/encryption.util';
import {
  IssueBillingKeyDto,
  ListBillingKeysDto,
  GetBillingKeyDto,
} from './dto';

@Injectable()
export class BillingKeysService {
  private readonly logger = new Logger('BillingKeysService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly portOneService: PortOneService,
  ) {}

  /**
   * 빌링키 발급
   * 1. PortOne API에 빌링키 발급 요청
   * 2. 결과를 payment_methods 테이블에 저장
   */
  async issueBillingKey(
    userUuid: string,
    dto: IssueBillingKeyDto,
  ): Promise<any> {
    try {
      this.logger.log(`Issuing billing key for user: ${userUuid}`);

      // PortOne API 호출
      const result = await this.portOneService.issueBillingKey({
        channelKey: dto.channelKey,
        billingKeyMethod: dto.billingKeyMethod,
        customData: dto.customData,
        storeId: dto.storeId,
      });

      if (!result.billingKey?.id) {
        throw new BadRequestException('빌링키 발급에 실패했습니다.');
      }

      // payment_methods 테이블에 저장
      const paymentMethod = await this.prisma.payment_methods.create({
        data: {
          user_uuid: userUuid,
          type: 'CARD',
          billing_key_id: result.billingKey.id,
          billing_key_status: result.billingKey.status || 'ISSUED',
          provider_name: result.billingKey.pgProvider || 'UNKNOWN',
          alias: `Billing Key ${new Date().toLocaleDateString('ko-KR')}`,
          last_4_nums: result.billingKey.cardNumber?.slice(-4) || '0000',
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      this.logger.log(`Billing key issued and saved: ${paymentMethod.seq}`);

      return {
        id: paymentMethod.seq,
        billingKeyId: paymentMethod.billing_key_id,
        status: paymentMethod.billing_key_status,
        message: '빌링키가 발급되었습니다.',
      };
    } catch (error) {
      this.logger.error('Error issuing billing key:', error);
      throw error;
    }
  }

  /**
   * 빌링키 조회 (사용자의 빌링키 목록)
   */
  async listUserBillingKeys(
    userUuid: string,
    dto: ListBillingKeysDto,
  ): Promise<any> {
    try {
      this.logger.log(`Listing billing keys for user: ${userUuid}`);

      const pageSize = dto.page?.size || 20;
      const pageOffset = dto.page?.offset || 0;

      // DB에서 해당 사용자의 빌링키 조회
      const billingKeys = await this.prisma.payment_methods.findMany({
        where: {
          user_uuid: userUuid,
          billing_key_id: { not: null },
          ...dto.filter,
        },
        orderBy: dto.sort
          ? {
              [dto.sort.field]: dto.sort.order.toLowerCase(),
            }
          : { created_at: 'desc' },
        take: pageSize,
        skip: pageOffset,
      });

      const totalCount = await this.prisma.payment_methods.count({
        where: {
          user_uuid: userUuid,
          billing_key_id: { not: null },
          ...dto.filter,
        },
      });

      return {
        items: billingKeys.map((key) => ({
          id: key.seq,
          billingKeyId: key.billing_key_id,
          status: key.billing_key_status,
          provider: key.provider_name,
          alias: key.alias,
          lastFourDigits: key.last_4_nums,
          cardHolder: key.card_holder_name,
          isDefault: key.is_primary,
          createdAt: key.created_at,
          expiryMonth: key.expiry_month,
          expiryYear: key.expiry_year,
        })),
        pagination: {
          totalCount,
          pageSize,
          currentOffset: pageOffset,
          hasMore: pageOffset + pageSize < totalCount,
        },
      };
    } catch (error) {
      this.logger.error('Error listing billing keys:', error);
      throw error;
    }
  }

  /**
   * 빌링키 단건 조회
   */
  async getBillingKey(
    userUuid: string,
    billingKeyId: string,
    dto: GetBillingKeyDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `Fetching billing key: ${billingKeyId} for user: ${userUuid}`,
      );

      // DB에서 조회
      const paymentMethod = await this.prisma.payment_methods.findFirst({
        where: {
          user_uuid: userUuid,
          billing_key_id: billingKeyId,
        },
      });

      if (!paymentMethod) {
        throw new NotFoundException('빌링키를 찾을 수 없습니다.');
      }

      // PortOne에서 최신 상태 조회 (선택사항)
      if (paymentMethod.billing_key_id) {
        const portoneData = await this.portOneService.getBillingKey(
          paymentMethod.billing_key_id,
        );

        // DB 상태 동기화
        if (
          portoneData?.billingKey?.status !== paymentMethod.billing_key_status
        ) {
          await this.prisma.payment_methods.update({
            where: { seq: paymentMethod.seq },
            data: {
              billing_key_status: portoneData.billingKey?.status,
              updated_at: new Date(),
            },
          });
        }
      }

      return {
        id: paymentMethod.seq,
        billingKeyId: paymentMethod.billing_key_id,
        status: paymentMethod.billing_key_status,
        provider: paymentMethod.provider_name,
        alias: paymentMethod.alias,
        cardHolder: paymentMethod.card_holder_name,
        lastFourDigits: paymentMethod.last_4_nums,
        expiryMonth: paymentMethod.expiry_month,
        expiryYear: paymentMethod.expiry_year,
        isDefault: paymentMethod.is_primary,
        createdAt: paymentMethod.created_at,
        updatedAt: paymentMethod.updated_at,
      };
    } catch (error) {
      this.logger.error('Error fetching billing key:', error);
      throw error;
    }
  }

  /**
   * 빌링키 삭제
   */
  async deleteBillingKey(
    userUuid: string,
    billingKeyId: string,
  ): Promise<any> {
    try {
      this.logger.log(
        `Deleting billing key: ${billingKeyId} for user: ${userUuid}`,
      );

      const paymentMethod = await this.prisma.payment_methods.findFirst({
        where: {
          user_uuid: userUuid,
          seq: BigInt(billingKeyId),
        },
      });

      if (!paymentMethod) {
        throw new NotFoundException('빌링키를 찾을 수 없습니다.');
      }

      // DB에서 삭제
      await this.prisma.payment_methods.delete({
        where: { seq: paymentMethod.seq },
      });

      this.logger.log(`Billing key deleted: ${billingKeyId}`);

      return {
        message: '빌링키가 삭제되었습니다.',
      };
    } catch (error) {
      this.logger.error('Error deleting billing key:', error);
      throw error;
    }
  }

  /**
   * 기본 빌링키 설정
   */
  async setDefaultBillingKey(
    userUuid: string,
    billingKeyId: string,
  ): Promise<any> {
    try {
      this.logger.log(
        `Setting default billing key: ${billingKeyId} for user: ${userUuid}`,
      );

      const paymentMethod = await this.prisma.payment_methods.findFirst({
        where: {
          user_uuid: userUuid,
          seq: BigInt(billingKeyId),
        },
      });

      if (!paymentMethod) {
        throw new NotFoundException('빌링키를 찾을 수 없습니다.');
      }

      // 기존 기본값 제거
      await this.prisma.payment_methods.updateMany({
        where: {
          user_uuid: userUuid,
          is_primary: true,
        },
        data: {
          is_primary: false,
        },
      });

      // 새로운 기본값 설정
      const updated = await this.prisma.payment_methods.update({
        where: { seq: paymentMethod.seq },
        data: {
          is_primary: true,
          updated_at: new Date(),
        },
      });

      this.logger.log(`Default billing key set: ${billingKeyId}`);

      return {
        message: '기본 빌링키가 설정되었습니다.',
      };
    } catch (error) {
      this.logger.error('Error setting default billing key:', error);
      throw error;
    }
  }
}
