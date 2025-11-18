import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
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

  /**
   * Pass 인증 검증 및 저장 (2차 인증)
   * Frontend에서 받은 returnedIdentityId를 PortOne에서 검증하고 DB에 저장
   */
  async verifyPassIdentity(
    userUuid: string,
    returnedIdentityId: string,
  ): Promise<any> {
    try {
      this.logger.log(
        `Verifying Pass identity for user: ${userUuid}, returnedIdentityId: ${returnedIdentityId}`,
      );

      // PortOne API에서 Pass 인증 결과 조회
      const passResult = await this.portOneService.verifyPassIdentity(returnedIdentityId);

      // CI가 이미 존재하는지 확인(중복가입 방지)
      if (passResult?.ci) {
        const existingByCi = await this.prisma.identity_verifications.findUnique({
          where: { ci: passResult.ci },
        });

        if (existingByCi && existingByCi.user_uuid !== userUuid) {
          // 이미 동일한 CI가 다른 사용자에 의해 사용중
          throw new BadRequestException('이미 다른 계정에서 사용된 인증 정보입니다.');
        }
        
        // 동일한 사용자의 기존 Pass 인증이 있으면 상태만 업데이트하고 반환
        if (existingByCi && existingByCi.user_uuid === userUuid) {
          const updated = await this.prisma.identity_verifications.update({
            where: { seq: existingByCi.seq },
            data: {
              portone_id: returnedIdentityId,
              status: 'VERIFIED',
              status_changed_at: new Date(),
              customer_name: passResult.name || existingByCi.customer_name,
              customer_phone: passResult.phone || existingByCi.customer_phone,
              ci: passResult.ci || existingByCi.ci,
              di: passResult.di || existingByCi.di,
            },
          });

          return {
            id: updated.uuid,
            portoneId: updated.portone_id,
            status: updated.status,
            name: updated.customer_name,
            phone: updated.customer_phone,
            ci: updated.ci,
            di: updated.di,
            verifiedAt: updated.status_changed_at,
            message: '이미 저장된 Pass 인증 기록을 업데이트했습니다.',
          };
        }
      }

      // DB에 저장
      const verification = await this.prisma.identity_verifications.create({
        data: {
          uuid: uuidv4(),
          user_uuid: userUuid,
          portone_id: returnedIdentityId,
          channel_key: 'PASS',
          status: 'VERIFIED',
          customer_name: passResult.name || 'Unknown',
          customer_phone: passResult.phone,
          customer_email: '',
          ci: passResult.ci, // 개인 고유 식별자
          di: passResult.di, // 중복 가입 확인용
          method: 'PASS',
          operator: 'PASS',
          requested_at: new Date(),
          status_changed_at: new Date(),
        },
      });

      this.logger.log(`Pass identity verification saved: ${verification.seq}`);

      return {
        id: verification.uuid,
        portoneId: returnedIdentityId,
        status: 'VERIFIED',
        name: passResult.name,
        phone: passResult.phone,
        ci: passResult.ci,
        di: passResult.di,
        verifiedAt: verification.status_changed_at,
        message: 'Pass 인증이 완료되었습니다',
      };
    } catch (error) {
      this.logger.error('Error verifying Pass identity:', error);
      throw error;
    }
  }

  /**
   * imp_uid를 통한 certified(예: KG이니시스) 본인인증 검증
   * 프론트는 imp_uid를 전달하고, 백엔드는 PortOne(iamport)에서 결과를 조회하여 DB에 저장합니다.
   */
  async verifyCertifiedIdentity(userUuid: string, impUid: string): Promise<any> {
    try {
      this.logger.log(
        `Verifying certified identity for user: ${userUuid}, impUid: ${impUid}`,
      );
      this.logger.debug(`Config cert channel: ${this.configService.get<string>('PORTONE_CERTIFIED_CHANEL_KEY')}`);

      const certified = await this.portOneService.getCertificationByImpUid(impUid);
      this.logger.debug(`Certified info: ${JSON.stringify(certified).slice(0, 500)}`);

      if (!certified) {
        throw new BadRequestException('인증 정보를 찾을 수 없습니다.');
      }

      // CI 중복 검사
      if (certified.uniqueKey) {
        const existing = await this.prisma.identity_verifications.findUnique({
          where: { ci: certified.uniqueKey },
        });

        if (existing && existing.user_uuid !== userUuid) {
          throw new BadRequestException('이미 다른 계정에서 사용된 인증 정보입니다.');
        }

        if (existing && existing.user_uuid === userUuid) {
          // 이미 사용자의 인증이 있으면 업데이트
          const updated = await this.prisma.identity_verifications.update({
            where: { seq: existing.seq },
            data: {
              portone_id: impUid,
              channel_key: this.configService.get<string>('PORTONE_CERTIFIED_CHANEL_KEY') || 'KG_INIT',
              status: 'VERIFIED',
              status_changed_at: new Date(),
              customer_name: certified.name || existing.customer_name,
              customer_phone: certified.phone || existing.customer_phone,
              ci: certified.uniqueKey || existing.ci,
              di: certified.uniqueInSite || existing.di,
            },
          });

          return {
            id: updated.uuid,
            portoneId: updated.portone_id,
            status: updated.status,
            name: updated.customer_name,
            phone: updated.customer_phone,
            ci: updated.ci,
            di: updated.di,
            verifiedAt: updated.status_changed_at,
            message: '이미 저장된 인증 기록을 업데이트했습니다.',
          };
        }
      }

      // DB 생성
      const verification = await this.prisma.identity_verifications.create({
        data: {
          uuid: uuidv4(),
          user_uuid: userUuid,
          portone_id: impUid,
          channel_key: this.configService.get<string>('PORTONE_CERTIFIED_CHANEL_KEY') || '',
          operator: 'KG',
          method: 'CERTIFIED',
          status: 'VERIFIED',
          customer_name: certified.name || '',
          customer_phone: certified.phone || '',
          customer_email: '',
          ci: certified.uniqueKey,
          di: certified.uniqueInSite,
          requested_at: new Date(),
          status_changed_at: new Date(),
        },
      });

      this.logger.log(`Certified identity verification saved: ${verification.seq}`);

      return {
        id: verification.uuid,
        portoneId: verification.portone_id,
        status: verification.status,
        name: verification.customer_name,
        phone: verification.customer_phone,
        ci: verification.ci,
        di: verification.di,
        verifiedAt: verification.status_changed_at,
        message: 'Certified 본인인증이 완료되었습니다',
      };
    } catch (error) {
      this.logger.error('Error verifying certified identity: ', error);
      throw error;
    }
  }

  /**
   * 사용자의 최신 Pass 인증 정보 조회
   */
  async getLatestVerifiedIdentity(userUuid: string): Promise<any> {
    try {
      const verification = await this.prisma.identity_verifications.findFirst({
        where: {
          user_uuid: userUuid,
          status: 'VERIFIED',
          method: 'PASS',
        },
        orderBy: {
          status_changed_at: 'desc',
        },
      });

      if (!verification) {
        throw new NotFoundException('인증된 정보가 없습니다');
      }

      return {
        id: verification.uuid,
        name: verification.customer_name,
        phone: verification.customer_phone,
        ci: verification.ci,
        di: verification.di,
        verifiedAt: verification.status_changed_at,
      };
    } catch (error) {
      this.logger.error('Error getting latest verified identity:', error);
      throw error;
    }
  }
}

