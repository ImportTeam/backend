import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PortOneService } from '../portone/portone.service';
import { v4 as uuidv4 } from 'uuid';
import {
  SendIdentityVerificationDto,
  ConfirmIdentityVerificationDto,
  ResendIdentityVerificationDto,
  GetIdentityVerificationDto,
  ListIdentityVerificationsDto,
} from './dto';

@Injectable()
export class IdentityVerificationsService {
  private readonly logger = new Logger('IdentityVerificationsService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly portOneService: PortOneService,
  ) {}

  /**
   * 본인인증 요청 전송
   * 1. PortOne API에 전송 요청
   * 2. 결과를 DB에 저장
   */
  async sendIdentityVerification(
    userUuid: string,
    portoneId: string,
    dto: SendIdentityVerificationDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `Sending identity verification for user: ${userUuid}, portoneId: ${portoneId}`,
      );

      // PortOne API 호출
      await this.portOneService.sendIdentityVerification(portoneId, {
        channelKey: dto.channelKey || '',
        customer: {
          name: dto.customerName,
          phone: dto.customerPhone,
          email: dto.customerEmail,
        },
        operator: dto.operator,
        method: dto.method,
        storeId: dto.storeId,
        customData: dto.customData,
      });

      // DB에 저장
      const verification = await this.prisma.identity_verifications.create({
        data: {
          uuid: uuidv4(),
          user_uuid: userUuid,
          portone_id: portoneId,
          channel_key: dto.channelKey || '',
          operator: dto.operator,
          method: dto.method,
          status: 'SENT',
          customer_name: dto.customerName,
          customer_phone: dto.customerPhone,
          customer_email: dto.customerEmail,
          custom_data: dto.customData,
          requested_at: new Date(),
          status_changed_at: new Date(),
        },
      });

      this.logger.log(`Identity verification created: ${verification.seq}`);

      return {
        id: verification.uuid,
        portoneId: verification.portone_id,
        status: verification.status,
        message: '본인인증 요청이 전송되었습니다.',
      };
    } catch (error) {
      this.logger.error('Error sending identity verification:', error);
      throw error;
    }
  }

  /**
   * 본인인증 확인 (OTP 검증)
   * 1. PortOne API에 OTP 검증 요청
   * 2. 성공 시 DB 상태 업데이트
   */
  async confirmIdentityVerification(
    userUuid: string,
    portoneId: string,
    dto: ConfirmIdentityVerificationDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `Confirming identity verification for user: ${userUuid}, portoneId: ${portoneId}`,
      );

      // DB에서 조회
      const verification = await this.prisma.identity_verifications.findUnique({
        where: { portone_id: portoneId },
      });

      if (!verification) {
        throw new NotFoundException('본인인증 기록을 찾을 수 없습니다.');
      }

      if (verification.user_uuid !== userUuid) {
        throw new BadRequestException('본인의 인증 기록만 확인할 수 있습니다.');
      }

      // PortOne API 호출
      const result = await this.portOneService.confirmIdentityVerification(
        portoneId,
        {
          otp: dto.otp,
          storeId: dto.storeId,
        },
      );

      // DB 업데이트
      const updatedVerification = await this.prisma.identity_verifications.update({
        where: { portone_id: portoneId },
        data: {
          status: result.identityVerification?.status || 'VERIFIED',
          status_changed_at: new Date(),
        },
      });

      this.logger.log(
        `Identity verification confirmed: ${updatedVerification.seq}`,
      );

      return {
        id: updatedVerification.uuid,
        status: updatedVerification.status,
        verifiedAt: updatedVerification.status_changed_at,
        message: '본인인증이 완료되었습니다.',
      };
    } catch (error) {
      this.logger.error('Error confirming identity verification:', error);
      throw error;
    }
  }

  /**
   * 본인인증 재전송
   */
  async resendIdentityVerification(
    userUuid: string,
    portoneId: string,
    dto: ResendIdentityVerificationDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `Resending identity verification for user: ${userUuid}, portoneId: ${portoneId}`,
      );

      // DB에서 조회
      const verification = await this.prisma.identity_verifications.findUnique({
        where: { portone_id: portoneId },
      });

      if (!verification) {
        throw new NotFoundException('본인인증 기록을 찾을 수 없습니다.');
      }

      if (verification.user_uuid !== userUuid) {
        throw new BadRequestException('본인의 인증 기록만 재전송할 수 있습니다.');
      }

      // PortOne API 호출
      await this.portOneService.resendIdentityVerification(
        portoneId,
        dto.storeId,
      );

      this.logger.log(`Identity verification resent: ${verification.seq}`);

      return {
        id: verification.uuid,
        message: '본인인증 요청이 재전송되었습니다.',
      };
    } catch (error) {
      this.logger.error('Error resending identity verification:', error);
      throw error;
    }
  }

  /**
   * 본인인증 단건 조회
   */
  async getIdentityVerification(
    userUuid: string,
    portoneId: string,
    dto: GetIdentityVerificationDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `Fetching identity verification for user: ${userUuid}, portoneId: ${portoneId}`,
      );

      // DB에서 조회
      const verification = await this.prisma.identity_verifications.findUnique({
        where: { portone_id: portoneId },
      });

      if (!verification) {
        throw new NotFoundException('본인인증 기록을 찾을 수 없습니다.');
      }

      if (verification.user_uuid !== userUuid) {
        throw new BadRequestException('본인의 인증 기록만 조회할 수 있습니다.');
      }

      // PortOne API에서도 최신 상태 조회
      const portoneData = await this.portOneService.getIdentityVerification(
        portoneId,
        dto.storeId,
      );

      // DB 상태 동기화
      if (portoneData?.identityVerification?.status !== verification.status) {
        await this.prisma.identity_verifications.update({
          where: { portone_id: portoneId },
          data: {
            status: portoneData.identityVerification?.status,
            status_changed_at: new Date(),
          },
        });
      }

      return {
        id: verification.uuid,
        status: verification.status,
        operator: verification.operator,
        method: verification.method,
        customerName: verification.customer_name,
        customerPhone: verification.customer_phone,
        customerEmail: verification.customer_email,
        requestedAt: verification.requested_at,
        statusChangedAt: verification.status_changed_at,
      };
    } catch (error) {
      this.logger.error('Error fetching identity verification:', error);
      throw error;
    }
  }

  /**
   * 본인인증 다건 조회 (사용자별)
   */
  async listUserIdentityVerifications(
    userUuid: string,
    dto: ListIdentityVerificationsDto,
  ): Promise<any> {
    try {
      this.logger.log(`Listing identity verifications for user: ${userUuid}`);

      const pageSize = dto.page?.size || 20;
      const pageOffset = dto.page?.offset || 0;

      const verifications = await this.prisma.identity_verifications.findMany({
        where: {
          user_uuid: userUuid,
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

      const totalCount = await this.prisma.identity_verifications.count({
        where: {
          user_uuid: userUuid,
          ...dto.filter,
        },
      });

      return {
        items: verifications.map((v) => ({
          id: v.uuid,
          status: v.status,
          operator: v.operator,
          method: v.method,
          customerName: v.customer_name,
          requestedAt: v.requested_at,
          statusChangedAt: v.status_changed_at,
        })),
        pagination: {
          totalCount,
          pageSize,
          currentOffset: pageOffset,
          hasMore: pageOffset + pageSize < totalCount,
        },
      };
    } catch (error) {
      this.logger.error('Error listing identity verifications:', error);
      throw error;
    }
  }
}
