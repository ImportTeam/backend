import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface IdentityVerificationSendRequest {
  channelKey: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  operator: 'SKT' | 'KT' | 'LG' | 'MVN';
  method: 'SMS' | 'APP';
  storeId?: string;
  customData?: string;
  bypass?: Record<string, any>;
}

export interface IdentityVerificationConfirmRequest {
  otp?: string;
  storeId?: string;
}

export interface BillingKeyIssueRequest {
  channelKey?: string;
  billingKeyMethod: string;
  customData?: string;
  storeId?: string;
}

export interface PaymentListRequest {
  page?: {
    size: number;
    offset: number;
  };
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  filter?: Record<string, any>;
}

export interface PortOneError {
  type: string;
  message?: string;
  pgCode?: string;
  pgMessage?: string;
}

@Injectable()
export class PortOneService {
  private readonly logger = new Logger('PortOneService');
  private readonly apiSecret: string;
  private readonly apiBaseUrl: string;
  private readonly channelKey: string;

  // Token caching
  private iamportTokenCache: { token: string; expiresAt: number } | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiSecret = this.configService.get<string>('PORTONE_API_SECRET') || '';
    this.apiBaseUrl = this.configService.get<string>(
      'PORTONE_API_BASE_URL',
      'https://api.portone.io',
    ) || 'https://api.portone.io';
    this.channelKey = this.configService.get<string>('PORTONE_CHANNEL_KEY') || '';

    if (!this.apiSecret) {
      this.logger.warn('⚠️ PORTONE_API_SECRET is not set - PortOne API calls will fail');
    }

    if (!this.channelKey) {
      this.logger.warn('⚠️ PORTONE_CHANNEL_KEY is not set');
    }
  }

    /**
     * iamport (PortOne certified/KG) 토큰 발급
     * 사용: PORTONE_CERTIFIED_API_KEY, PORTONE_CERTIFIED_API_SECRET
     * 캐싱으로 불필요한 API 호출 감소
     */
    private async getIamportAccessToken(): Promise<string> {
      // 캐시된 토큰이 있고 아직 유효하면 재사용
      const now = Date.now();
      if (this.iamportTokenCache && this.iamportTokenCache.expiresAt > now) {
        this.logger.debug('Using cached iamport token');
        return this.iamportTokenCache.token;
      }

      try {
        const impKey = this.configService.get<string>('PORTONE_CERTIFIED_API_KEY');
        const impSecret = this.configService.get<string>('PORTONE_CERTIFIED_API_SECRET');

        if (!impKey || !impSecret) {
          this.logger.warn('PORTONE_CERTIFIED_API_KEY or SECRET not set');
          throw new Error('Missing iamport credentials');
        }

        const url = `https://api.iamport.kr/users/getToken`;

        const response = await lastValueFrom(
          this.httpService.post(
            url,
            {
              imp_key: impKey,
              imp_secret: impSecret,
            },
            {
              timeout: 60000,
            },
          ),
        );

        const token = response?.data?.response?.access_token;
        if (!token) throw new Error('Unable to get iamport access token');

        // 토큰 캐싱 (30분 유효)
        this.iamportTokenCache = {
          token,
          expiresAt: now + 30 * 60 * 1000, // 30분
        };

        this.logger.debug('New iamport token obtained and cached');
        return token;
      } catch (error) {
        this.handleError(error, 'getIamportAccessToken');
        throw error;
      }
    }

  /**
   * API 요청을 위한 헤더 생성
   */
  private getHeaders(idempotencyKey?: string) {
    const headers: Record<string, string> = {
      'Authorization': `PortOne ${this.apiSecret}`,
      'Content-Type': 'application/json',
    };

    if (idempotencyKey) {
      headers['Idempotency-Key'] = `"${idempotencyKey}"`;
    }

    return headers;
  }

  /**
   * imp_uid를 받아 iamport의 certifications API를 이용해 결과를 조회합니다.
   */
  async getCertificationByImpUid(impUid: string): Promise<any> {
    try {
      const token = await this.getIamportAccessToken();

      const url = `https://api.iamport.kr/certifications/${impUid}`;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: token,
          },
          timeout: 60000,
        }),
      );

      const certInfo = response?.data?.response;

      if (!certInfo) {
        throw new Error('Certification not found');
      }

      return {
        name: certInfo.name,
        phone: certInfo.phone,
        birthday: certInfo.birthday,
        gender: certInfo.gender,
        uniqueKey: certInfo.unique_key, // CI
        uniqueInSite: certInfo.unique_in_site, // DI
        carrier: certInfo.carrier,
        impUid: certInfo.imp_uid || impUid,
      };
    } catch (error) {
      this.handleError(error, 'getCertificationByImpUid');
      throw error;
    }
  }

  /**
   * UUID를 멱등 키로 사용하여 생성
   */
  private generateIdempotencyKey(): string {
    return uuidv4();
  }

  /**
   * 에러 응답을 파싱하여 예외 발생
   */
  private handleError(error: any, context: string): void {
    this.logger.error(`PortOne API Error (${context}):`, error?.message);

    if (error?.response?.data) {
      const errorData: PortOneError = error.response.data;
      const statusCode = error.response.status;

      let message = errorData.message || 'Unknown error';
      if (errorData.pgMessage) {
        message += ` (${errorData.pgMessage})`;
      }

      throw new HttpException(
        {
          statusCode,
          message,
          errorType: errorData.type,
          pgCode: errorData.pgCode,
        },
        statusCode,
      );
    }

    if (error?.code === 'ECONNREFUSED') {
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'PortOne API is unavailable',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message || 'Unknown error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // ==================== Identity Verification ====================

  /**
   * 본인인증 요청 전송
   * POST /identity-verifications/{identityVerificationId}/send
   */
  async sendIdentityVerification(
    identityVerificationId: string,
    request: IdentityVerificationSendRequest,
  ): Promise<any> {
    try {
      const body = {
        channelKey: request.channelKey || this.channelKey,
        customer: request.customer,
        operator: request.operator,
        method: request.method,
        storeId: request.storeId,
        customData: request.customData,
        bypass: request.bypass,
      };

      const url = `${this.apiBaseUrl}/identity-verifications/${identityVerificationId}/send`;
      const idempotencyKey = this.generateIdempotencyKey();

      this.logger.log(
        `Sending identity verification request: ${identityVerificationId}`,
      );

      const response = await lastValueFrom(
        this.httpService.post(url, body, {
          headers: this.getHeaders(idempotencyKey),
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'sendIdentityVerification');
    }
  }

  /**
   * 본인인증 확인 (OTP 검증)
   * POST /identity-verifications/{identityVerificationId}/confirm
   */
  async confirmIdentityVerification(
    identityVerificationId: string,
    request: IdentityVerificationConfirmRequest,
  ): Promise<any> {
    try {
      const body = {
        otp: request.otp,
        storeId: request.storeId,
      };

      const url = `${this.apiBaseUrl}/identity-verifications/${identityVerificationId}/confirm`;
      const idempotencyKey = this.generateIdempotencyKey();

      this.logger.log(
        `Confirming identity verification: ${identityVerificationId}`,
      );

      const response = await lastValueFrom(
        this.httpService.post(url, body, {
          headers: this.getHeaders(idempotencyKey),
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'confirmIdentityVerification');
    }
  }

  /**
   * 본인인증 재전송
   * POST /identity-verifications/{identityVerificationId}/resend
   */
  async resendIdentityVerification(
    identityVerificationId: string,
    storeId?: string,
  ): Promise<any> {
    try {
      const url = new URL(
        `${this.apiBaseUrl}/identity-verifications/${identityVerificationId}/resend`,
      );

      if (storeId) {
        url.searchParams.append('storeId', storeId);
      }

      const idempotencyKey = this.generateIdempotencyKey();

      this.logger.log(
        `Resending identity verification: ${identityVerificationId}`,
      );

      const response = await lastValueFrom(
        this.httpService.post(
          url.toString(),
          {},
          {
            headers: this.getHeaders(idempotencyKey),
            timeout: 60000,
          },
        ),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'resendIdentityVerification');
    }
  }

  /**
   * 본인인증 단건 조회
   * GET /identity-verifications/{identityVerificationId}
   */
  async getIdentityVerification(
    identityVerificationId: string,
    storeId?: string,
  ): Promise<any> {
    try {
      const url = new URL(
        `${this.apiBaseUrl}/identity-verifications/${identityVerificationId}`,
      );

      if (storeId) {
        url.searchParams.append('storeId', storeId);
      }

      this.logger.log(`Fetching identity verification: ${identityVerificationId}`);

      const response = await lastValueFrom(
        this.httpService.get(url.toString(), {
          headers: this.getHeaders(),
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'getIdentityVerification');
    }
  }

  /**
   * 본인인증 다건 조회
   * GET /identity-verifications
   */
  async listIdentityVerifications(request: PaymentListRequest): Promise<any> {
    try {
      const body = {
        page: request.page || { size: 20, offset: 0 },
        sort: request.sort,
        filter: request.filter,
      };

      const url = `${this.apiBaseUrl}/identity-verifications`;

      this.logger.log('Listing identity verifications');

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(),
          data: body,
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'listIdentityVerifications');
    }
  }

  // ==================== Billing Key ====================

  /**
   * 빌링키 발급
   * POST /billing-keys
   */
  async issueBillingKey(request: BillingKeyIssueRequest): Promise<any> {
    try {
      const body = {
        channelKey: request.channelKey || this.channelKey,
        billingKeyMethod: request.billingKeyMethod,
        customData: request.customData,
        storeId: request.storeId,
      };

      const url = `${this.apiBaseUrl}/billing-keys`;
      const idempotencyKey = this.generateIdempotencyKey();

      this.logger.log('Issuing billing key');

      const response = await lastValueFrom(
        this.httpService.post(url, body, {
          headers: this.getHeaders(idempotencyKey),
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'issueBillingKey');
    }
  }

  /**
   * 빌링키 조회
   * GET /billing-keys
   */
  async listBillingKeys(request: PaymentListRequest): Promise<any> {
    try {
      const body = {
        page: request.page || { size: 20, offset: 0 },
        sort: request.sort,
        filter: request.filter,
      };

      const url = `${this.apiBaseUrl}/billing-keys`;

      this.logger.log('Listing billing keys');

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(),
          data: body,
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'listBillingKeys');
    }
  }

  /**
   * 빌링키 단건 조회
   * GET /billing-keys/{billingKeyId}
   */
  async getBillingKey(billingKeyId: string): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/billing-keys/${billingKeyId}`;

      this.logger.log(`Fetching billing key: ${billingKeyId}`);

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(),
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'getBillingKey');
    }
  }

  // ==================== Payments ====================

  /**
   * 결제 목록 조회
   * GET /payments
   */
  async listPayments(request: PaymentListRequest): Promise<any> {
    try {
      const body = {
        page: request.page || { size: 20, offset: 0 },
        sort: request.sort,
        filter: request.filter,
      };

      const url = `${this.apiBaseUrl}/payments`;

      this.logger.log('Listing payments');

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(),
          data: body,
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'listPayments');
    }
  }

  /**
   * 결제 단건 조회
   * GET /payments/{paymentId}
   */
  async getPayment(paymentId: string): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/payments/${paymentId}`;

      this.logger.log(`Fetching payment: ${paymentId}`);

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(),
          timeout: 60000,
        }),
      );

      return response.data as any;
    } catch (error) {
      this.handleError(error, 'getPayment');
    }
  }

  /**
   * Pass 인증 검증 (2차 인증)
   * PortOne에서 returnedIdentityId를 통해 인증 결과 조회
   */
  async verifyPassIdentity(returnedIdentityId: string): Promise<
    {
      id: string;
      status: string;
      name?: string;
      phone?: string;
      birthDate?: string;
      ci?: string;
      di?: string;
      verifiedAt?: string | Date;
      message?: string;
    }
  > {
    try {
      this.logger.log(`Verifying Pass identity: ${returnedIdentityId}`);

      const url = `${this.apiBaseUrl}/identity-verifications/${returnedIdentityId}`;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(),
          timeout: 60000,
        }),
      );

      this.logger.log(`Pass identity verified successfully: ${returnedIdentityId}`);

      // PortOne 응답 형식 처리
      const data = response.data;

      // PortOne 반환 형식은 환경에 따라 차이가 있으므로 여러 위치에서 정보를 조회합니다.
      // 1) data.identityVerification (공식 API 기준) 2) data (some SDKs)
      const iv = data.identityVerification || data;

      const verifiedData = iv?.verified_at || iv?.verifiedAt || iv?.verified || iv?.verifiedData || iv;

      const name = verifiedData?.name || verifiedData?.customer?.name || iv?.customer?.name || iv?.identity?.name;
      const phone = verifiedData?.phone || verifiedData?.customer?.phone || iv?.customer?.phone || iv?.identity?.phone;
      const birthDate = verifiedData?.birthDate || verifiedData?.birthday || iv?.birthday;
      const ci = verifiedData?.ci || iv?.ci || iv?.identity?.ci;
      const di = verifiedData?.di || iv?.di || iv?.identity?.di;
      const verifiedAt = iv?.verifiedAt || verifiedData?.verifiedAt || verifiedData?.verified_at || new Date().toISOString();
      return {
        id: returnedIdentityId,
        status: iv?.status || data?.status || 'VERIFIED',
        name,
        phone,
        birthDate,
        ci,
        di,
        verifiedAt,
        message: 'Pass 인증이 완료되었습니다',
      };
    } catch (error) {
      this.logger.error('Error verifying Pass identity:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Pass 인증 검증 실패',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

