# PortOne V2 Payment Integration Guide for NestJS Backend

> **작성일**: 2025-11-12
> **프로젝트**: PicSel Backend
> **상태**: 구현 가이드 (실제 코드는 별도 파일에서 생성)

---

## 📚 Table of Contents

1. [개요](#개요)
2. [SDK 설치 & 초기화](#sdk-설치--초기화)
3. [환경 설정](#환경-설정)
4. [API 구조](#api-구조)
5. [인증 메커니즘](#인증-메커니즘)
6. [결제 흐름](#결제-흐름)
7. [본인인증 구현](#본인인증-구현)
8. [빌링키 (정기결제) 구현](#빌링키-정기결제-구현)
9. [Webhook 처리](#webhook-처리)
10. [에러 핸들링](#에러-핸들링)
11. [테스트 가이드](#테스트-가이드)

---

## 개요

**포트원(PortOne)**은 한국의 올인원 결제/정산 솔루션입니다.

### V2 API 특징
- **RESTful API**: 모든 결제 기능을 HTTP로 제어
- **Server SDK**: JavaScript/TypeScript, Python 등 공식 SDK 제공
- **멱등성 보장**: 3시간 동안 같은 요청 자동 중복 방지
- **Webhook**: 결제 상태 변경 실시간 알림
- **결제 예약**: 자동 정기 결제 지원
- **다중 PG**: Toss Payments, Kakao Pay, Naver Pay 등 연동 가능

### 핵심 기능
| 기능 | 설명 |
|------|------|
| **Payment** | 일회성 결제, 결제 조회, 취소, 승인 |
| **Billing Key** | 카드정보 저장 후 반복 결제 |
| **Payment Schedule** | 자동 정기 결제 (구독료, 월간 결제 등) |
| **Identity Verification** | SMS/앱 기반 본인인증 |
| **Cash Receipt** | 현금영수증 자동 발급 |
| **Reconciliation** | 거래 대사 서비스 |

---

## SDK 설치 & 초기화

### Step 1: 패키지 설치

```bash
# npm
npm install --save @portone/server-sdk

# pnpm (현재 프로젝트)
pnpm add @portone/server-sdk

# yarn
yarn add @portone/server-sdk
```

### Step 2: NestJS Service 생성

```typescript
// src/payment/portone.service.ts
import { Injectable } from '@nestjs/common';
import { PortOneClient, PaymentClient } from '@portone/server-sdk';

@Injectable()
export class PortOneService {
  private portoneClient: PortOneClient;
  private paymentClient: PaymentClient;

  constructor() {
    const apiSecret = process.env.PORTONE_API_SECRET;
    
    // Option 1: 전체 API 사용
    this.portoneClient = new PortOneClient({ secret: apiSecret });
    
    // Option 2: 결제 API만 사용
    this.paymentClient = new PaymentClient({ secret: apiSecret });
  }

  // 결제 API 접근
  async getPayment(paymentId: string) {
    return this.portoneClient.payment.getPayment({ paymentId });
  }

  // 본인인증 API 접근
  async getIdentityVerification(identityVerificationId: string) {
    return this.portoneClient.identityVerification.get({ 
      identityVerificationId 
    });
  }

  // 빌링키 API 접근
  async getBillingKey(billingKey: string) {
    return this.portoneClient.billingKey.get({ billingKey });
  }
}
```

---

## 환경 설정

### Step 1: .env 파일 업데이트

```env
# PortOne API 자격증
PORTONE_API_SECRET=test_sk_abc123...  # 관리자콘솔에서 발급
PORTONE_WEBHOOK_SECRET=test_wh_xyz...  # 웹훅 검증용
PORTONE_STORE_ID=store-xxxx-xxxx      # 매장 ID (선택)

# PortOne 환경
PORTONE_ENV=sandbox  # sandbox | production

# API 타임아웃
PORTONE_TIMEOUT_MS=60000  # 최소 60초 권장
```

### Step 2: env.validation.ts 업데이트

```typescript
// src/config/env.validation.ts
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

class EnvironmentVariables {
  // ... 기존 환경변수들 ...

  @IsNotEmpty()
  @IsString()
  PORTONE_API_SECRET: string;

  @IsNotEmpty()
  @IsString()
  PORTONE_WEBHOOK_SECRET: string;

  @IsString()
  PORTONE_STORE_ID?: string;

  @IsIn(['sandbox', 'production'])
  PORTONE_ENV: 'sandbox' | 'production' = 'sandbox';

  PORTONE_TIMEOUT_MS: number = 60000;
}
```

### Step 3: ConfigService 확장

```typescript
// src/config/portone.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PortOneConfig {
  constructor(private configService: ConfigService) {}

  getApiSecret(): string {
    return this.configService.get('PORTONE_API_SECRET');
  }

  getWebhookSecret(): string {
    return this.configService.get('PORTONE_WEBHOOK_SECRET');
  }

  getStoreId(): string {
    return this.configService.get('PORTONE_STORE_ID', '');
  }

  isProduction(): boolean {
    return this.configService.get('PORTONE_ENV') === 'production';
  }

  getTimeoutMs(): number {
    return this.configService.get('PORTONE_TIMEOUT_MS', 60000);
  }
}
```

---

## API 구조

### API Hostname
```
api.portone.io (V2 REST API)
```

### 인증 방식

#### 방식 1: API Secret (권장)
```
Authorization: PortOne {API_SECRET}
```

#### 방식 2: Bearer Token
```typescript
// Step 1: Token 발급
const token = await portoneClient.auth.login({
  secret: PORTONE_API_SECRET
});

// Step 2: Bearer Token 사용
Authorization: Bearer {ACCESS_TOKEN}

// Step 3: Token 갱신 (필요시)
const newToken = await portoneClient.auth.refresh({ token });
```

### Idempotency Key (멱등 키)

**목적**: 네트워크 오류로 인한 중복 요청 방지

```typescript
import { v4 as uuidv4 } from 'uuid';

const idempotencyKey = uuidv4(); // or custom unique string

// 요청 시
const result = await axios.post('/payments', data, {
  headers: {
    'Idempotency-Key': `"${idempotencyKey}"` // RFC 8941 형식
  }
});

// 같은 키로 재시도 시
// - 처리 중: 409 IDEMPOTENCY_OUTSTANDING_REQUEST
// - 완료됨: 기존 응답 반환
```

### GET with Body

```typescript
// 표준 GET은 body를 지원하지 않으므로
// requestBody query 파라미터 사용
const filter = { status: 'PAID' };
const encodedBody = encodeURIComponent(JSON.stringify(filter));

const response = await axios.get('/payments', {
  params: {
    requestBody: encodedBody
  }
});
```

---

## 인증 메커니즘

### 1. API Secret 기반

```typescript
// ✅ 권장: SDK 자동 처리
import { PortOneClient } from '@portone/server-sdk';

const client = new PortOneClient({
  secret: process.env.PORTONE_API_SECRET
});

// SDK가 자동으로 Authorization: PortOne {secret} 헤더 추가
```

### 2. Bearer Token 기반

```typescript
// Token 발급
POST /login/api-secret
Authorization: PortOne {API_SECRET}

Response: { accessToken: "token...", expiresIn: 3600 }

// Token 사용
Authorization: Bearer {accessToken}

// Token 갱신
POST /token/refresh
Authorization: Bearer {accessToken}
```

---

## 결제 흐름

### 일반 결제 흐름

```
1. Frontend: 결제 정보 입력 (카드/간편결제)
   ↓
2. PortOne SDK: 결제 프로세스 진행 (클라이언트 측)
   ↓
3. Frontend: 결제 성공 시 paymentId 전달
   ↓
4. Backend: POST /payments 또는 결제 확인
   ↓
5. PortOne: 결제 승인/거절
   ↓
6. Backend: 결제 상태 저장, 주문 처리
   ↓
7. Webhook: 결제 완료 알림 (비동기)
```

### 1단계: 결제 요청 (Frontend)

```javascript
// Frontend: src/components/Payment.tsx
import { PortOne } from "@portone/browser-sdk";

export async function requestPayment() {
  const response = await PortOne.requestPayment({
    storeId: "store-xxxx-xxxx", // 포트원 매장 ID
    channelKey: "channel_key_xxxx", // 결제 채널 (PG)
    orderName: "나이키 신발",
    totalAmount: 100000,
    currency: "KRW",
    payMethod: "CARD", // CARD, TRANSFER, VIRTUAL_ACCOUNT, PAYPAL
    customer: {
      fullName: "김철수",
      phoneNumber: "01012345678",
      email: "test@example.com"
    },
    customData: JSON.stringify({ userId: "user123" })
  });

  if (response.code !== null) {
    console.error("결제 실패:", response.message);
    return;
  }

  // 결제 성공 → backend로 paymentId 전달
  const { paymentId } = response;
  await fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId })
  });
}
```

### 2단계: 결제 승인 (Backend)

```typescript
// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { PortOneClient } from '@portone/server-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    private portoneClient: PortOneClient,
    private prisma: PrismaService
  ) {}

  async confirmPayment(paymentId: string, userId: string) {
    const idempotencyKey = uuidv4();

    try {
      // Step 1: PortOne에서 결제 조회
      const payment = await this.portoneClient.payment.getPayment({
        paymentId
      });

      if (payment.status !== 'READY') {
        throw new Error(`Invalid payment status: ${payment.status}`);
      }

      // Step 2: 결제 승인
      const confirmed = await this.portoneClient.payment.confirmPayment({
        paymentId,
        idempotencyKey: `"${idempotencyKey}"` // RFC 8941 형식
      });

      // Step 3: DB에 결제 정보 저장
      await this.prisma.payment_transactions.create({
        data: {
          user_uuid: userId,
          payment_id: paymentId,
          merchant_name: payment.orderName,
          amount: new Decimal(payment.amount.total),
          currency: payment.currency,
          status: confirmed.status, // PAID, FAILED, etc.
          portone_response: JSON.stringify(confirmed),
          created_at: new Date()
        }
      });

      return confirmed;
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    const payment = await this.portoneClient.payment.getPayment({
      paymentId
    });
    
    return {
      paymentId,
      status: payment.status,
      amount: payment.amount.total,
      currency: payment.currency,
      failureReason: payment.failureReason
    };
  }

  async cancelPayment(paymentId: string, reason: string) {
    const idempotencyKey = uuidv4();

    const result = await this.portoneClient.payment.cancelPayment({
      paymentId,
      reason,
      idempotencyKey: `"${idempotencyKey}"`
    });

    // DB 업데이트
    await this.prisma.payment_transactions.update({
      where: { payment_id: paymentId },
      data: {
        status: 'CANCELLED',
        cancelled_at: new Date(),
        cancellation_reason: reason
      }
    });

    return result;
  }
}
```

### 3단계: Controller

```typescript
// src/payment/payment.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  async confirmPayment(
    @Body('paymentId') paymentId: string,
    @CurrentUser('uuid') userUuid: string
  ) {
    return this.paymentService.confirmPayment(paymentId, userUuid);
  }

  @Get(':paymentId')
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.paymentService.getPaymentStatus(paymentId);
  }

  @Post(':paymentId/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelPayment(
    @Param('paymentId') paymentId: string,
    @Body('reason') reason: string
  ) {
    return this.paymentService.cancelPayment(paymentId, reason);
  }
}
```

---

## 본인인증 구현

### 인증 상태 흐름

```
READY (초기) → SENT (요청 전송) → VERIFIED (인증 완료)
                                  ↓
                               FAILED (실패)
```

### Step 1: 본인인증 요청

```typescript
// src/payment/identity-verification.service.ts
@Injectable()
export class IdentityVerificationService {
  constructor(private portoneClient: PortOneClient) {}

  async requestVerification(
    identityVerificationId: string,
    customerInfo: {
      name: string;
      phoneNumber: string;
      email?: string;
    },
    method: 'SMS' | 'APP' = 'SMS',
    operator: 'SKT' | 'KT' | 'LG' | 'MVN' = 'SKT'
  ) {
    const idempotencyKey = v4();

    try {
      const result = await this.portoneClient.identityVerification.send({
        identityVerificationId,
        storeId: process.env.PORTONE_STORE_ID,
        channelKey: 'channel_key_xxxx',
        method,
        operator,
        customer: {
          fullName: customerInfo.name,
          phoneNumber: customerInfo.phoneNumber,
          email: customerInfo.email
        },
        customData: JSON.stringify({ createdAt: new Date() })
      }, {
        headers: {
          'Idempotency-Key': `"${idempotencyKey}"`
        }
      });

      return result; // 200 OK
    } catch (error) {
      console.error('Verification request failed:', error);
      throw error;
    }
  }

  async resendVerification(identityVerificationId: string) {
    return this.portoneClient.identityVerification.resend({
      identityVerificationId,
      storeId: process.env.PORTONE_STORE_ID
    });
  }

  async confirmVerification(
    identityVerificationId: string,
    otp?: string // SMS 방식인 경우 필수
  ) {
    const result = await this.portoneClient.identityVerification.confirm({
      identityVerificationId,
      storeId: process.env.PORTONE_STORE_ID,
      otp
    });

    // result.identityVerification 에서 인증 정보 확인
    const {
      status,
      id,
      channel,
      customData,
      requestedAt,
      updatedAt
    } = result.identityVerification;

    if (status === 'VERIFIED') {
      return {
        verified: true,
        verificationId: id,
        verifiedAt: updatedAt
      };
    }

    return {
      verified: false,
      status
    };
  }

  async getVerificationStatus(identityVerificationId: string) {
    const result = await this.portoneClient.identityVerification.get({
      identityVerificationId,
      storeId: process.env.PORTONE_STORE_ID
    });

    return result;
  }

  async listVerifications(
    filter?: {
      status?: 'READY' | 'SENT' | 'VERIFIED' | 'FAILED';
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const result = await this.portoneClient.identityVerification.list({
      filter,
      sort: { requestedAt: 'DESC' }
    });

    return result.items;
  }
}
```

### Step 2: Controller

```typescript
@Controller('api/identity-verification')
export class IdentityVerificationController {
  constructor(private idVerService: IdentityVerificationService) {}

  @Post('request/:verificationId')
  async requestVerification(
    @Param('verificationId') verificationId: string,
    @Body() dto: {
      name: string;
      phoneNumber: string;
      email?: string;
      method?: 'SMS' | 'APP';
    }
  ) {
    return this.idVerService.requestVerification(
      verificationId,
      dto,
      dto.method
    );
  }

  @Post('confirm/:verificationId')
  async confirmVerification(
    @Param('verificationId') verificationId: string,
    @Body('otp') otp?: string
  ) {
    return this.idVerService.confirmVerification(verificationId, otp);
  }

  @Post('resend/:verificationId')
  async resendVerification(
    @Param('verificationId') verificationId: string
  ) {
    return this.idVerService.resendVerification(verificationId);
  }

  @Get('status/:verificationId')
  async getStatus(
    @Param('verificationId') verificationId: string
  ) {
    return this.idVerService.getVerificationStatus(verificationId);
  }
}
```

---

## 빌링키 (정기결제) 구현

### 빌링키 발급 흐름

```
1. 카드정보 입력 (Frontend)
   ↓
2. 빌링키 발급 요청 (Backend)
   ↓
3. 고객 인증 (SMS/OTP - 일부 PG)
   ↓
4. 빌링키 발급 완료
   ↓
5. 발급된 빌링키로 반복 결제
```

### Step 1: 빌링키 발급

```typescript
// src/payment/billing-key.service.ts
@Injectable()
export class BillingKeyService {
  constructor(private portoneClient: PortOneClient) {}

  async issueBillingKey(
    billingKeyId: string,
    userId: string,
    cardInfo: {
      cardNumber: string;
      expiryMonth: string;
      expiryYear: string;
      cardholderName: string;
      birthdate?: string;
    }
  ) {
    const idempotencyKey = v4();

    try {
      const result = await this.portoneClient.billingKey.issue({
        billingKeyId,
        method: 'CARD',
        customer: {
          customerId: userId,
          fullName: cardInfo.cardholderName
        },
        card: {
          number: cardInfo.cardNumber,
          expiryMonth: cardInfo.expiryMonth,
          expiryYear: cardInfo.expiryYear,
          cardholderName: cardInfo.cardholderName,
          birthDate: cardInfo.birthdate
        },
        bypass: {
          // PG사별 추가 파라미터 (필요시)
          pgCode: 'tosspayments'
        }
      }, {
        headers: {
          'Idempotency-Key': `"${idempotencyKey}"`
        }
      });

      return result;
    } catch (error) {
      console.error('Billing key issue failed:', error);
      throw error;
    }
  }

  async confirmBillingKey(billingKeyId: string) {
    return this.portoneClient.billingKey.confirm({
      billingKeyId,
      storeId: process.env.PORTONE_STORE_ID
    });
  }

  async getBillingKey(billingKey: string) {
    return this.portoneClient.billingKey.get({ billingKey });
  }

  async listBillingKeys(customerId: string) {
    return this.portoneClient.billingKey.list({
      filter: { customerId }
    });
  }

  async deleteBillingKey(billingKey: string) {
    return this.portoneClient.billingKey.delete({ billingKey });
  }

  // 빌링키로 결제
  async payWithBillingKey(
    paymentId: string,
    billingKey: string,
    orderInfo: {
      orderName: string;
      amount: number;
      currency?: string;
      customData?: string;
    }
  ) {
    const idempotencyKey = v4();

    const payment = await this.portoneClient.payment.billingKeyPayment({
      paymentId,
      billingKey,
      orderName: orderInfo.orderName,
      totalAmount: orderInfo.amount,
      currency: orderInfo.currency || 'KRW',
      customData: orderInfo.customData,
      idempotencyKey: `"${idempotencyKey}"`
    });

    return payment;
  }

  // 빌링키 + 초회 결제 동시 진행
  async issueAndPay(
    billingKeyId: string,
    paymentId: string,
    userId: string,
    cardInfo: {
      cardNumber: string;
      expiryMonth: string;
      expiryYear: string;
      cardholderName: string;
    },
    orderInfo: {
      orderName: string;
      amount: number;
      currency?: string;
    }
  ) {
    const idempotencyKey = v4();

    const result = await this.portoneClient.billingKey.issueAndPay({
      billingKeyId,
      paymentId,
      method: 'CARD',
      customer: {
        customerId: userId,
        fullName: cardInfo.cardholderName
      },
      card: cardInfo,
      orderName: orderInfo.orderName,
      totalAmount: orderInfo.amount,
      currency: orderInfo.currency || 'KRW',
      idempotencyKey: `"${idempotencyKey}"`
    });

    return result;
  }
}
```

### Step 2: 정기결제 스케줄 설정

```typescript
// 매달 첫날 자동 결제
async setupScheduledPayment(
  paymentId: string,
  billingKey: string,
  scheduleInfo: {
    orderName: string;
    amount: number;
    timeToPay: Date; // 결제 예정 시간
    intervalCount?: number; // 간격 (기본: 1)
    intervalUnit?: 'MONTH' | 'WEEK' | 'DAY'; // 단위 (기본: MONTH)
  }
) {
  const result = await this.portoneClient.paymentSchedule.schedule({
    paymentId,
    payment: {
      billingKey,
      orderName: scheduleInfo.orderName,
      totalAmount: scheduleInfo.amount,
      currency: 'KRW'
    },
    timeToPay: scheduleInfo.timeToPay.toISOString(),
    interval: {
      unit: scheduleInfo.intervalUnit || 'MONTH',
      count: scheduleInfo.intervalCount || 1
    }
  });

  return result;
}

// 스케줄 조회
async getSchedule(paymentScheduleId: string) {
  return this.portoneClient.paymentSchedule.get({
    paymentScheduleId
  });
}

// 스케줄 취소
async cancelSchedule(paymentScheduleId: string) {
  return this.portoneClient.paymentSchedule.cancel({
    paymentScheduleId
  });
}
```

---

## Webhook 처리

### Webhook 설정

1. **관리자콘솔에서 Webhook URL 등록**:
   - https://api.picsel.com/webhook/portone

2. **Secret Key 발급받기** (PORTONE_WEBHOOK_SECRET)

### Webhook 검증 & 처리

```typescript
// src/payment/webhook.controller.ts
import { Controller, Post, Req, Raw } from '@nestjs/common';
import { Webhook } from '@portone/server-sdk';
import { PaymentService } from './payment.service';

@Controller('webhook')
export class WebhookController {
  constructor(private paymentService: PaymentService) {}

  @Post('portone')
  async handlePortoneWebhook(
    @Req() request: Request & { rawBody: Buffer }
  ) {
    const signature = request.headers['webhook-signature'] as string;
    const timestamp = request.headers['webhook-timestamp'] as string;
    const id = request.headers['webhook-id'] as string;
    const payload = request.rawBody.toString('utf-8');

    try {
      // Step 1: Webhook 검증
      const webhook = await Webhook.verify(
        process.env.PORTONE_WEBHOOK_SECRET,
        payload,
        {
          'webhook-id': id,
          'webhook-signature': signature,
          'webhook-timestamp': timestamp
        }
      );

      // Step 2: 타입별 처리
      switch (webhook.type) {
        case 'Transaction.Paid':
          await this.handleTransactionPaid(webhook.data);
          break;

        case 'Transaction.Cancelled':
          await this.handleTransactionCancelled(webhook.data);
          break;

        case 'BillingKey.Issued':
          await this.handleBillingKeyIssued(webhook.data);
          break;

        case 'BillingKey.Updated':
          await this.handleBillingKeyUpdated(webhook.data);
          break;

        case 'BillingKey.Deleted':
          await this.handleBillingKeyDeleted(webhook.data);
          break;

        default:
          console.warn(`Unhandled webhook type: ${webhook.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  private async handleTransactionPaid(data: any) {
    const { paymentId, orderId } = data;
    console.log(`Payment completed: ${paymentId}`);
    
    // DB 업데이트
    await this.paymentService.updatePaymentStatus(paymentId, 'COMPLETED');
    
    // 주문 처리
    // await orderService.processOrder(orderId);
  }

  private async handleTransactionCancelled(data: any) {
    const { paymentId, cancellationId, reason } = data;
    console.log(`Payment cancelled: ${paymentId}`);
    
    await this.paymentService.updatePaymentStatus(paymentId, 'CANCELLED');
  }

  private async handleBillingKeyIssued(data: any) {
    const { billingKey, customerId } = data;
    console.log(`Billing key issued: ${billingKey}`);
    
    // Billing key 저장
  }

  private async handleBillingKeyUpdated(data: any) {
    const { billingKey } = data;
    console.log(`Billing key updated: ${billingKey}`);
  }

  private async handleBillingKeyDeleted(data: any) {
    const { billingKey } = data;
    console.log(`Billing key deleted: ${billingKey}`);
  }
}
```

### Raw Body 접근 설정

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Raw body 저장 (Webhook 검증용)
  app.use((req, res, next) => {
    if (req.path === '/webhook/portone') {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        req.rawBody = Buffer.from(data);
        next();
      });
    } else {
      next();
    }
  });

  // ...
}
```

---

## 에러 핸들링

### HTTP Status Codes

| 상태 | 설명 | 처리 |
|------|------|------|
| **200** | 성공 | - |
| **400** | Bad Request (INVALID_REQUEST) | 입력값 검증 |
| **401** | Unauthorized | API Secret 확인 |
| **403** | Forbidden | 권한 없음 |
| **404** | Not Found | 리소스 없음 |
| **409** | Conflict | 중복 요청/상태 오류 |
| **502** | Bad Gateway (PG_PROVIDER) | PG사 오류 |

### SDK 에러 처리

```typescript
import {
  GetPaymentError,
  PaymentNotFoundError,
  UnauthorizedError,
  ForbiddenError,
  InvalidRequestError
} from '@portone/server-sdk/payment';

try {
  const payment = await paymentClient.getPayment({ paymentId });
} catch (error) {
  if (error instanceof GetPaymentError) {
    if (error instanceof PaymentNotFoundError) {
      console.error('Payment not found');
    } else if (error instanceof UnauthorizedError) {
      console.error('Unauthorized - check API secret');
    } else if (error instanceof ForbiddenError) {
      console.error('Forbidden - insufficient permissions');
    } else if (error instanceof InvalidRequestError) {
      console.error('Invalid request:', error.message);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### NestJS Exception Filter

```typescript
// src/common/filters/portone-exception.filter.ts
import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class PortOneExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof Error) {
      if (exception.message.includes('PAYMENT_NOT_FOUND')) {
        status = HttpStatus.NOT_FOUND;
        message = 'Payment not found';
      } else if (exception.message.includes('UNAUTHORIZED')) {
        status = HttpStatus.UNAUTHORIZED;
        message = 'Invalid API credentials';
      } else if (exception.message.includes('ALREADY_PAID')) {
        status = HttpStatus.CONFLICT;
        message = 'Payment already completed';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString()
    });
  }
}
```

---

## 테스트 가이드

### 환경별 설정

```env
# 개발 환경 (.env.development)
PORTONE_ENV=sandbox
PORTONE_API_SECRET=test_sk_abc123...
PORTONE_WEBHOOK_SECRET=test_wh_xyz...

# 프로덕션 환경 (.env.production)
PORTONE_ENV=production
PORTONE_API_SECRET=live_sk_...
PORTONE_WEBHOOK_SECRET=live_wh_...
```

### 테스트 결제

```typescript
// src/payment/payment.service.spec.ts
describe('PaymentService', () => {
  let service: PaymentService;
  let portoneClient: PortOneClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PortOneClient,
          useValue: {
            payment: {
              getPayment: jest.fn(),
              confirmPayment: jest.fn(),
              cancelPayment: jest.fn()
            }
          }
        }
      ]
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    portoneClient = module.get<PortOneClient>(PortOneClient);
  });

  it('should confirm payment successfully', async () => {
    const mockPayment = {
      paymentId: 'test_payment_1',
      status: 'PAID',
      amount: { total: 10000 },
      currency: 'KRW'
    };

    jest.spyOn(portoneClient.payment, 'confirmPayment')
      .mockResolvedValue(mockPayment);

    const result = await service.confirmPayment(
      'test_payment_1',
      'user_uuid'
    );

    expect(result.status).toBe('PAID');
  });
});
```

### 테스트 카드 번호

```
카드사        카드번호             상태
──────────────────────────────────────
비자          4111 1111 1111 1111  성공
마스터카드    5555 5555 5555 4444  성공
테스트실패    4111 1111 1111 1112  실패
```

---

## 🎯 구현 체크리스트

- [ ] SDK 설치 및 초기화
- [ ] 환경 변수 설정 (.env)
- [ ] PortOneService 생성
- [ ] 결제 API 구현
- [ ] 본인인증 구현
- [ ] 빌링키 구현
- [ ] Webhook 처리
- [ ] 에러 핸들링
- [ ] 단위 테스트
- [ ] 통합 테스트
- [ ] 프로덕션 배포

---

## 📚 참고 링크

- [포트원 개발자센터](https://developers.portone.io)
- [PortOne V2 REST API](https://developers.portone.io/api/rest-v2)
- [PortOne Server SDK](https://developers.portone.io/sdk/ko/v2-server-sdk/readme)
- [PortOne Browser SDK](https://developers.portone.io/sdk/ko/v2-sdk/readme)
- [관리자콘솔](https://admin.portone.io)

---

**작성**: AI Assistant
**마지막 수정**: 2025-11-12
