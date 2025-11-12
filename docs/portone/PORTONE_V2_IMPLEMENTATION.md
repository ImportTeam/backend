# PortOne V2 통합 구현 가이드

## 개요

이 문서는 NestJS 백엔드에 PortOne V2 REST API를 통합한 3가지 주요 기능을 설명합니다:

1. **Identity Verification (본인인증)** - 사용자 신원 확인
2. **Billing Key (결제 카드 등록)** - 정기 결제용 카드 등록
3. **Payment History (결제 이력)** - 사용자 결제 거래 조회 및 통계

## 📋 목차

- [아키텍처 개요](#아키텍처-개요)
- [기술 스택](#기술-스택)
- [설치 및 설정](#설치-및-설정)
- [주요 모듈](#주요-모듈)
  - [PortOne Service](#portone-service)
  - [Identity Verification](#identity-verification)
  - [Billing Keys](#billing-keys)
  - [Payment History](#payment-history)
- [데이터베이스 스키마](#데이터베이스-스키마)
- [API 레퍼런스](#api-레퍼런스)
- [사용 예제](#사용-예제)
- [에러 처리](#에러-처리)
- [배포 체크리스트](#배포-체크리스트)

---

## 아키텍처 개요

### 계층 구조

```
Client/Frontend
    ↓
Controller (REST Endpoints)
    ↓
Service (Business Logic)
    ├─ PortOneService (API Client)
    ├─ PrismaService (Database)
    └─ EncryptionUtil (Encryption)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

### 통합 흐름

```
User Request
    ↓
[Controller] - 요청 검증
    ↓
[Service] - 비즈니스 로직
    ├─ PortOne API 호출
    ├─ 데이터베이스 저장
    └─ 동기화 처리
    ↓
Response to Client
```

### 설계 원칙

- **DB-First Approach**: PortOne API 호출 후 결과를 로컬 DB에 저장
- **Idempotency**: UUID 기반 멱등성 키로 중복 요청 방지
- **Error Handling**: 상세한 로깅과 에러 분류
- **State Sync**: 주기적으로 PortOne과 로컬 상태 동기화
- **Encryption**: 민감한 정보 암호화 저장

---

## 기술 스택

| 레이어 | 기술 | 버전 |
|--------|------|------|
| **Framework** | NestJS | 11.x |
| **Language** | TypeScript | 5.9.x |
| **Database** | PostgreSQL | 14+ |
| **ORM** | Prisma | 6.x |
| **HTTP Client** | @nestjs/axios | 최신 |
| **Utilities** | uuid, class-validator | 최신 |
| **External API** | PortOne V2 REST API | - |

---

## 설치 및 설정

### 1. 필수 패키지 설치

```bash
pnpm add @nestjs/axios uuid
pnpm add -D @types/node
```

### 2. 환경 변수 설정 (`.env`)

```env
# PortOne API 설정
PORTONE_API_SECRET=your_api_secret_key
PORTONE_API_BASE_URL=https://api.portone.io

# JWT 설정
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600

# 데이터베이스
DATABASE_URL=YourDataBaseURL

# 암호화
ENCRYPTION_KEY=32_character_key_for_encryption
```

### 3. Prisma 마이그레이션

```bash
# 마이그레이션 생성
npx prisma migrate dev --name add_portone_models

# 마이그레이션 배포 (프로덕션)
npx prisma migrate deploy

# Prisma Client 재생성
npx prisma generate
```

### 4. AppModule 등록

```typescript
import { PortOneModule } from './portone/portone.module';
import { IdentityVerificationsModule } from './identity-verifications/identity-verifications.module';
import { BillingKeysModule } from './billing-keys/billing-keys.module';

@Module({
  imports: [
    // ... 다른 모듈들
    PortOneModule,
    IdentityVerificationsModule,
    BillingKeysModule,
  ],
})
export class AppModule {}
```

---

## 주요 모듈

### PortOne Service

**파일**: `src/portone/portone.service.ts`

중앙 집중식 PortOne API 클라이언트로, 모든 API 호출을 관리합니다.

#### 제공 메서드

| 메서드 | 용도 | HTTP 메서드 |
|--------|------|-----------|
| `sendIdentityVerification()` | 본인인증 시작 | POST |
| `confirmIdentityVerification()` | OTP 검증 | POST |
| `resendIdentityVerification()` | 본인인증 재발송 | POST |
| `getIdentityVerificationStatus()` | 본인인증 상태 조회 | GET |
| `issueBillingKey()` | 빌링키 발급 | POST |
| `getBillingKeyStatus()` | 빌링키 상태 조회 | GET |
| `listPaymentHistory()` | 결제 이력 조회 | GET |

#### 핵심 기능

```typescript
// 1. Authorization 헤더
// 형식: Authorization: PortOne {API_SECRET}

// 2. Idempotency Key
// UUID 형식으로 중복 요청 방지
// 헤더: Idempotency-Key: {UUID}

// 3. 타임아웃
// 모든 요청: 60초

// 4. 에러 처리
// 상세한 로깅과 스택 추적
```

#### 사용 예제

```typescript
import { PortOneService } from './portone/portone.service';

constructor(private portOne: PortOneService) {}

async verifyIdentity() {
  const result = await this.portOne.sendIdentityVerification({
    operator: 'SKT',
    method: 'SMS',
    storeId: 'store_123',
  });
  return result;
}
```

---

### Identity Verification (본인인증)

**디렉토리**: `src/identity-verifications/`

SMS/앱 기반 사용자 신원 확인 시스템.

#### 파일 구조

```
identity-verifications/
├── dto/
│   └── index.ts              # 7개 DTO 클래스
├── identity-verifications.service.ts   # 비즈니스 로직
├── identity-verifications.controller.ts # REST 엔드포인트
└── identity-verifications.module.ts    # 모듈 정의
```

#### 제공 DTO

| DTO | 용도 |
|-----|------|
| `SendIdentityVerificationDto` | 본인인증 시작 요청 |
| `ConfirmIdentityVerificationDto` | OTP 검증 요청 |
| `ResendIdentityVerificationDto` | 재발송 요청 |
| `GetIdentityVerificationDto` | 상태 조회 요청 |
| `ListIdentityVerificationsDto` | 페이지네이션 쿼리 |
| `Operator` enum | SKT, KT, LG, MVN |
| `Method` enum | SMS, APP |

#### 서비스 메서드

```typescript
// 1. 본인인증 시작
async sendIdentityVerification(
  userUuid: string,
  dto: SendIdentityVerificationDto
): Promise<any>
// - PortOne API에 요청
// - 결과를 identity_verifications 테이블에 저장
// - portone_id 반환

// 2. OTP 확인
async confirmIdentityVerification(
  userUuid: string,
  portoneId: string,
  dto: ConfirmIdentityVerificationDto
): Promise<any>
// - OTP 검증
// - DB 상태 업데이트
// - 확인 완료 여부 반환

// 3. 재발송
async resendIdentityVerification(
  userUuid: string,
  portoneId: string
): Promise<any>
// - PortOne에 재발송 요청
// - 재시도 횟수 증가

// 4. 단일 조회 (동기화 포함)
async getIdentityVerification(
  userUuid: string,
  portoneId: string
): Promise<any>
// - DB에서 조회
// - PortOne과 상태 동기화
// - 최신 정보 반환

// 5. 사용자 본인인증 목록
async listUserIdentityVerifications(
  userUuid: string,
  dto: ListIdentityVerificationsDto
): Promise<any>
// - 페이지네이션 지원
// - 최신순 정렬
```

#### 데이터베이스 스키마

```sql
CREATE TABLE identity_verifications (
  seq BIGSERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) NOT NULL,
  portone_id VARCHAR(100) UNIQUE NOT NULL,
  operator VARCHAR(20),           -- SKT, KT, LG, MVN
  method VARCHAR(20),             -- SMS, APP
  name VARCHAR(50),               -- 인증된 이름
  phone_number VARCHAR(20),       -- 암호화됨
  gender VARCHAR(10),
  birth_date VARCHAR(10),
  nationality VARCHAR(20),
  status VARCHAR(50),             -- PENDING, VERIFIED, FAILED
  reason_code VARCHAR(50),
  reason_message TEXT,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
);
```

---

### Billing Keys (결제 카드 등록)

**디렉토리**: `src/billing-keys/`

정기 결제용 카드 등록 및 관리 시스템.

#### 파일 구조

```
billing-keys/
├── dto/
│   └── index.ts              # 3개 DTO 클래스
├── billing-keys.service.ts    # 비즈니스 로직
├── billing-keys.controller.ts # REST 엔드포인트
└── billing-keys.module.ts     # 모듈 정의
```

#### 제공 DTO

| DTO | 용도 |
|-----|------|
| `IssueBillingKeyDto` | 빌링키 발급 요청 |
| `ListBillingKeysDto` | 페이지네이션 쿼리 |
| `GetBillingKeyDto` | 상태 조회 요청 |

#### 서비스 메서드

```typescript
// 1. 빌링키 발급
async issueBillingKey(
  userUuid: string,
  dto: IssueBillingKeyDto
): Promise<any>
// - PortOne API에 발급 요청
// - payment_methods 테이블에 저장
// - billing_key_id와 상태 반환
// - 민감한 정보는 암호화

// 2. 사용자 빌링키 목록
async listUserBillingKeys(
  userUuid: string,
  dto: ListBillingKeysDto
): Promise<any>
// - 페이지네이션 지원
// - 정렬 옵션 (created_at, billing_key_status)
// - 필터링 옵션

// 3. 빌링키 조회 (동기화)
async getBillingKey(
  userUuid: string,
  id: string
): Promise<any>
// - DB에서 조회
// - PortOne과 상태 동기화
// - 최신 정보 반환

// 4. 빌링키 삭제
async deleteBillingKey(
  userUuid: string,
  id: string
): Promise<any>
// - PortOne에서 삭제
// - DB에서 표시 삭제 또는 완전 삭제
// - 연관된 구독 처리

// 5. 기본 결제 수단 설정
async setDefaultBillingKey(
  userUuid: string,
  id: string
): Promise<any>
// - is_primary 플래그 업데이트
// - 이전 기본 수단 해제
```

#### 데이터베이스 확장

`payment_methods` 테이블에 추가된 필드:

```sql
-- PortOne Billing Key 정보
billing_key_id VARCHAR UNIQUE,   -- PortOne Billing Key ID
billing_key_status VARCHAR(50),  -- ISSUED, PENDING, DELETED
operator VARCHAR(20),            -- 통신사 정보 (SKT, KT, LG, MVN)
```

#### 상태 전이도

```
발급 요청
    ↓
[PortOne API] → ISSUED/PENDING
    ↓
[DB 저장] → payment_methods
    ↓
활성 (is_primary = true/false)
    ↓
삭제 요청 → DELETED
```

---

### Payment History (결제 이력)

**디렉토리**: `src/payments/`

사용자 결제 거래 조회, 필터링, 통계 분석.

#### 파일 구조

```
payments/
├── payment-history.service.ts    # 복잡한 쿼리 로직
├── payment-history.controller.ts # REST 엔드포인트
├── payments.controller.ts        # 기존 결제 관련 엔드포인트
├── payments.service.ts           # 기존 결제 로직 (수정됨)
└── payments.module.ts            # 모듈 정의
```

#### 서비스 메서드

```typescript
// 1. 결제 이력 조회 (필터링 & 페이지네이션)
async getUserPaymentHistory(
  userUuid: string,
  filters: {
    startDate?: Date;
    endDate?: Date;
    status?: string;       // PENDING, COMPLETED, FAILED
    minAmount?: number;
    maxAmount?: number;
  },
  pagination: {
    page: number;
    pageSize: number;
  }
): Promise<any>
// - 복잡한 WHERE 조건
// - 오프셋 기반 페이지네이션
// - 최신순 정렬
// - 거래 금액 범위 필터

// 2. 결제 상세 정보
async getPaymentDetail(
  userUuid: string,
  paymentId: string
): Promise<any>
// - 단일 거래 조회
// - PortOne과 동기화
// - 결제 수단 정보 포함
// - 상태 업데이트

// 3. 결제 통계
async getPaymentStatistics(
  userUuid: string,
  startDate?: Date,
  endDate?: Date
): Promise<any>
// - 상태별 거래 건수
// - 상태별 거래 금액 합계
// - 가맹점별 통계
// - 월별 트렌드 데이터
```

#### 데이터베이스 확장

`payment_transactions` 테이블에 추가된 필드:

```sql
CREATE TABLE payment_transactions (
  seq BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL,              -- 멱등성 키
  user_uuid VARCHAR(36) NOT NULL,
  payment_method_seq BIGINT,
  merchant_name VARCHAR(100),
  amount DECIMAL(12,2),
  benefit_value DECIMAL(12,2) DEFAULT 0,
  benefit_desc VARCHAR(255),
  compared_at TIMESTAMP,
  
  -- PortOne 연동 필드
  portone_payment_id VARCHAR(100) UNIQUE,
  portone_transaction_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'PENDING',   -- PENDING, COMPLETED, FAILED
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE,
  FOREIGN KEY (payment_method_seq) REFERENCES payment_methods(seq) ON DELETE SET NULL,
  
  INDEX idx_user_status (user_uuid, status),
  INDEX idx_user_created (user_uuid, created_at),
  INDEX idx_portone_payment (portone_payment_id)
);
```

#### 복잡 쿼리 예제

```typescript
// 동적 필터 구성
const whereClause = {
  user_uuid: userUuid,
  ...(startDate && { compared_at: { gte: startDate } }),
  ...(endDate && { compared_at: { lte: endDate } }),
  ...(status && { status }),
  ...(minAmount && amount && { amount: { gte: minAmount } }),
  ...(maxAmount && amount && { amount: { lte: maxAmount } }),
};

// 페이지네이션
const transactions = await this.prisma.payment_transactions.findMany({
  where: whereClause,
  include: {
    payment_method: true,
  },
  orderBy: { compared_at: 'desc' },
  take: pageSize,
  skip: (page - 1) * pageSize,
});
```

---

## 데이터베이스 스키마

### ERD (Entity Relationship Diagram)

```
users
├── identity_verifications (1:N)
├── payment_methods (1:N)
│   └── payment_transactions (1:N)
└── payment_transactions (1:N)
```

### 주요 테이블

#### 1. users (기존)
```sql
seq BIGSERIAL PRIMARY KEY
uuid VARCHAR(36) UNIQUE NOT NULL
email VARCHAR(100) UNIQUE NOT NULL
name VARCHAR(100)
phone VARCHAR(20)
created_at TIMESTAMP DEFAULT NOW()
```

#### 2. payment_methods (확장)
```sql
seq BIGSERIAL PRIMARY KEY
user_uuid VARCHAR(36) NOT NULL
type VARCHAR(20)              -- CARD, BANK_ACCOUNT, etc
card_number_hash VARCHAR(255) -- 암호화됨
expiry_year INT
expiry_month INT
last_4_nums VARCHAR(4)        -- ✨ 신규
cvv_hash VARCHAR(255)         -- 암호화됨
billing_address VARCHAR(255)
billing_zip VARCHAR(20)
alias VARCHAR(50)
is_primary BOOLEAN DEFAULT false
billing_key_id VARCHAR UNIQUE -- ✨ 신규
billing_key_status VARCHAR(50) -- ✨ 신규
operator VARCHAR(20)          -- ✨ 신규
created_at TIMESTAMP DEFAULT NOW()
```

#### 3. payment_transactions (확장)
```sql
seq BIGSERIAL PRIMARY KEY
uuid UUID UNIQUE NOT NULL     -- ✨ 신규
user_uuid VARCHAR(36) NOT NULL
payment_method_seq BIGINT
merchant_name VARCHAR(100)
amount DECIMAL(12,2)
benefit_value DECIMAL(12,2)
benefit_desc VARCHAR(255)
compared_at TIMESTAMP
portone_payment_id VARCHAR UNIQUE -- ✨ 신규
portone_transaction_id VARCHAR    -- ✨ 신규
status VARCHAR(50) DEFAULT 'PENDING' -- ✨ 신규
created_at TIMESTAMP DEFAULT NOW()
```

#### 4. identity_verifications (신규)
```sql
seq BIGSERIAL PRIMARY KEY
user_uuid VARCHAR(36) NOT NULL
portone_id VARCHAR(100) UNIQUE NOT NULL
operator VARCHAR(20)
method VARCHAR(20)
name VARCHAR(50)
phone_number VARCHAR(20)
gender VARCHAR(10)
birth_date VARCHAR(10)
nationality VARCHAR(20)
status VARCHAR(50)
reason_code VARCHAR(50)
reason_message TEXT
retry_count INT DEFAULT 0
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

---

## API 레퍼런스

### 인증

모든 엔드포인트는 JWT 토큰 필요:

```http
Authorization: Bearer {JWT_TOKEN}
```

### 1. Identity Verification (본인인증)

#### 1.1 본인인증 시작

```http
POST /identity-verifications/{portoneId}/send
Content-Type: application/json
Authorization: Bearer {token}

{
  "operator": "SKT",      // SKT, KT, LG, MVN
  "method": "SMS",        // SMS, APP
  "storeId": "store_123"  // 선택사항
}

Response 200 OK:
{
  "portoneId": "imp_12345",
  "status": "PENDING",
  "message": "본인인증이 시작되었습니다.",
  "expiresAt": "2025-01-13T12:34:56Z"
}
```

#### 1.2 OTP 검증

```http
POST /identity-verifications/{portoneId}/confirm
Content-Type: application/json
Authorization: Bearer {token}

{
  "otp": "123456",        // 6자리 OTP
  "storeId": "store_123"  // 선택사항
}

Response 200 OK:
{
  "portoneId": "imp_12345",
  "status": "VERIFIED",
  "userData": {
    "name": "홍길동",
    "phone": "01012345678",
    "birthDate": "1990-01-15",
    "gender": "M"
  },
  "message": "인증이 완료되었습니다."
}

Response 400 Bad Request:
{
  "statusCode": 400,
  "message": "OTP가 일치하지 않습니다.",
  "error": "BadRequestException"
}
```

#### 1.3 본인인증 재발송

```http
POST /identity-verifications/{portoneId}/resend
Content-Type: application/json
Authorization: Bearer {token}

{}

Response 200 OK:
{
  "portoneId": "imp_12345",
  "status": "PENDING",
  "message": "본인인증이 재발송되었습니다.",
  "retryCount": 2
}
```

#### 1.4 본인인증 조회

```http
GET /identity-verifications/{portoneId}
Authorization: Bearer {token}

Response 200 OK:
{
  "seq": 1,
  "portoneId": "imp_12345",
  "operator": "SKT",
  "method": "SMS",
  "status": "VERIFIED",
  "userData": {
    "name": "홍길동",
    "phone": "01012345678",
    "birthDate": "1990-01-15",
    "gender": "M"
  },
  "createdAt": "2025-01-13T11:00:00Z",
  "updatedAt": "2025-01-13T11:05:00Z"
}
```

#### 1.5 본인인증 목록

```http
GET /identity-verifications?page=1&pageSize=20
Authorization: Bearer {token}

Response 200 OK:
{
  "data": [
    {
      "seq": 2,
      "portoneId": "imp_12346",
      "operator": "KT",
      "status": "VERIFIED",
      "createdAt": "2025-01-13T10:00:00Z"
    },
    {
      "seq": 1,
      "portoneId": "imp_12345",
      "operator": "SKT",
      "status": "VERIFIED",
      "createdAt": "2025-01-13T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 2
  }
}
```

---

### 2. Billing Keys (결제 카드 등록)

#### 2.1 빌링키 발급

```http
POST /billing-keys
Content-Type: application/json
Authorization: Bearer {token}

{
  "channelKey": "channel_key_or_live_key",  // 선택사항
  "billingKeyMethod": "CARD",
  "customData": "user_custom_data",         // 선택사항
  "storeId": "store_123"                    // 선택사항
}

Response 201 Created:
{
  "id": 5,
  "billingKeyId": "billing_key_abc123",
  "status": "ISSUED",
  "message": "빌링키가 발급되었습니다."
}

Response 400 Bad Request:
{
  "statusCode": 400,
  "message": "빌링키 발급에 실패했습니다.",
  "error": "BadRequestException"
}
```

#### 2.2 빌링키 목록

```http
GET /billing-keys?page=1&pageSize=10&sort=created_at&order=DESC
Authorization: Bearer {token}

Response 200 OK:
{
  "data": [
    {
      "id": 5,
      "billingKeyId": "billing_key_abc123",
      "type": "CARD",
      "alias": "Billing Key 2025.1.13",
      "last4Nums": "1234",
      "billingKeyStatus": "ISSUED",
      "isPrimary": true,
      "createdAt": "2025-01-13T11:00:00Z"
    },
    {
      "id": 4,
      "billingKeyId": "billing_key_xyz789",
      "type": "CARD",
      "alias": "Billing Key 2025.1.12",
      "last4Nums": "5678",
      "billingKeyStatus": "ISSUED",
      "isPrimary": false,
      "createdAt": "2025-01-12T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 2
  }
}
```

#### 2.3 빌링키 조회

```http
GET /billing-keys/5
Authorization: Bearer {token}

Response 200 OK:
{
  "id": 5,
  "billingKeyId": "billing_key_abc123",
  "type": "CARD",
  "alias": "Billing Key 2025.1.13",
  "last4Nums": "1234",
  "billingKeyStatus": "ISSUED",
  "isPrimary": true,
  "provider": "UNKNOWN",
  "createdAt": "2025-01-13T11:00:00Z",
  "updatedAt": "2025-01-13T11:00:00Z"
}
```

#### 2.4 빌링키 삭제

```http
DELETE /billing-keys/5
Authorization: Bearer {token}

Response 200 OK:
{
  "message": "빌링키가 삭제되었습니다.",
  "id": 5
}

Response 404 Not Found:
{
  "statusCode": 404,
  "message": "빌링키를 찾을 수 없습니다.",
  "error": "NotFoundException"
}
```

#### 2.5 기본 결제 수단 설정

```http
PATCH /billing-keys/5/default
Authorization: Bearer {token}

{}

Response 200 OK:
{
  "id": 5,
  "isPrimary": true,
  "message": "기본 결제 수단으로 설정되었습니다."
}
```

---

### 3. Payment History (결제 이력)

#### 3.1 결제 이력 조회

```http
GET /payments/history?startDate=2025-01-01&endDate=2025-01-31&status=COMPLETED&page=1&pageSize=20
Authorization: Bearer {token}

Query Parameters:
- startDate: ISO 8601 형식 (선택사항)
- endDate: ISO 8601 형식 (선택사항)
- status: PENDING, COMPLETED, FAILED (선택사항)
- minAmount: 최소 금액 (선택사항)
- maxAmount: 최대 금액 (선택사항)
- page: 페이지 번호 (기본값: 1)
- pageSize: 페이지 크기 (기본값: 20)

Response 200 OK:
{
  "data": [
    {
      "id": 3,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "merchant": "카페 아메리",
      "amount": 5000,
      "benefit": {
        "value": 500,
        "description": "5% 캐시백"
      },
      "status": "COMPLETED",
      "createdAt": "2025-01-13T11:30:00Z",
      "paymentMethod": {
        "id": 5,
        "type": "CARD",
        "alias": "Billing Key 2025.1.13",
        "last4Nums": "1234"
      }
    },
    {
      "id": 2,
      "uuid": "660e8400-e29b-41d4-a716-446655440001",
      "merchant": "편의점",
      "amount": 15000,
      "benefit": {
        "value": 1500,
        "description": "10% 할인"
      },
      "status": "COMPLETED",
      "createdAt": "2025-01-13T10:00:00Z",
      "paymentMethod": {
        "id": 4,
        "type": "CARD",
        "alias": "카드 1234",
        "last4Nums": "5678"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 2
  }
}
```

#### 3.2 결제 상세 정보

```http
GET /payments/history/3
Authorization: Bearer {token}

Response 200 OK:
{
  "id": 3,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "portonePaymentId": "payment_123456",
  "portoneTransactionId": "transaction_789",
  "merchant": "카페 아메리",
  "amount": 5000,
  "benefit": {
    "value": 500,
    "description": "5% 캐시백"
  },
  "status": "COMPLETED",
  "paymentMethod": {
    "id": 5,
    "type": "CARD",
    "alias": "Billing Key 2025.1.13",
    "last4Nums": "1234",
    "brand": "VISA",
    "expiryMonth": 12,
    "expiryYear": 2026
  },
  "createdAt": "2025-01-13T11:30:00Z",
  "updatedAt": "2025-01-13T11:30:05Z"
}

Response 404 Not Found:
{
  "statusCode": 404,
  "message": "결제 거래를 찾을 수 없습니다.",
  "error": "NotFoundException"
}
```

#### 3.3 결제 통계

```http
GET /payments/statistics/overview?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {token}

Query Parameters:
- startDate: ISO 8601 형식 (선택사항)
- endDate: ISO 8601 형식 (선택사항)

Response 200 OK:
{
  "summary": {
    "totalTransactions": 45,
    "totalAmount": 125000,
    "totalBenefit": 12500
  },
  "byStatus": {
    "COMPLETED": {
      "count": 40,
      "amount": 120000,
      "benefit": 12000
    },
    "PENDING": {
      "count": 3,
      "amount": 3000,
      "benefit": 300
    },
    "FAILED": {
      "count": 2,
      "amount": 2000,
      "benefit": 200
    }
  },
  "byMerchant": [
    {
      "merchant": "카페 아메리",
      "count": 15,
      "amount": 45000,
      "benefit": 4500
    },
    {
      "merchant": "편의점",
      "count": 20,
      "amount": 50000,
      "benefit": 5000
    }
  ],
  "monthlyTrends": [
    {
      "month": "2025-01",
      "amount": 125000,
      "count": 45,
      "benefit": 12500
    }
  ]
}
```

---

## 사용 예제

### 예제 1: 완전한 본인인증 플로우

```typescript
// 1. 본인인증 시작 (SMS)
const sendResult = await fetch('/identity-verifications/imp_123/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer {token}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    operator: 'SKT',
    method: 'SMS',
    storeId: 'store_001'
  })
});

const { portoneId, status, expiresAt } = await sendResult.json();
console.log(`본인인증 시작: ${portoneId}, 상태: ${status}`);

// 사용자가 SMS로 수신한 OTP 입력
const userOtp = await getUserInput(); // "123456"

// 2. OTP 검증
const confirmResult = await fetch(`/identity-verifications/${portoneId}/confirm`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer {token}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    otp: userOtp,
    storeId: 'store_001'
  })
});

const { status: confirmStatus, userData } = await confirmResult.json();

if (confirmStatus === 'VERIFIED') {
  console.log('본인인증 완료:', userData);
  // 사용자 프로필 업데이트 등의 다음 작업 수행
}
```

### 예제 2: 빌링키 발급 및 결제

```typescript
// 1. 빌링키 발급
const billingKeyResponse = await fetch('/billing-keys', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer {token}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    billingKeyMethod: 'CARD',
    storeId: 'store_001',
    customData: 'subscription_monthly'
  })
});

const { id: billingKeyId, billingKeyId: portioneBillingKeyId, status } = 
  await billingKeyResponse.json();
console.log(`빌링키 발급: ${portioneBillingKeyId}, 상태: ${status}`);

// 2. 빌링키 목록 확인
const listResponse = await fetch('/billing-keys?page=1&pageSize=10', {
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

const { data: billingKeys } = await listResponse.json();
console.log(`등록된 빌링키: ${billingKeys.length}개`);

// 3. 기본 결제 수단 설정
const defaultResponse = await fetch(`/billing-keys/${billingKeyId}/default`, {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer {token}',
    'Content-Type': 'application/json'
  },
  body: '{}'
});

const { isPrimary, message } = await defaultResponse.json();
console.log(message);
```

### 예제 3: 결제 이력 조회 및 분석

```typescript
// 1. 지난 30일 완료된 결제 조회
const today = new Date();
const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

const historyResponse = await fetch(
  `/payments/history?` +
  `startDate=${thirtyDaysAgo.toISOString()}&` +
  `endDate=${today.toISOString()}&` +
  `status=COMPLETED&` +
  `page=1&pageSize=50`,
  {
    headers: {
      'Authorization': 'Bearer {token}'
    }
  }
);

const { data: transactions, pagination } = await historyResponse.json();
console.log(`지난 30일 완료된 결제: ${transactions.length}건`);

// 2. 결제 상세 정보 확인
const detailResponse = await fetch(
  `/payments/history/${transactions[0].id}`,
  {
    headers: {
      'Authorization': 'Bearer {token}'
    }
  }
);

const detail = await detailResponse.json();
console.log(`가맹점: ${detail.merchant}`);
console.log(`금액: ${detail.amount}원`);
console.log(`혜택: ${detail.benefit.description} (${detail.benefit.value}원)`);

// 3. 통계 조회
const statsResponse = await fetch(
  `/payments/statistics/overview?` +
  `startDate=${thirtyDaysAgo.toISOString()}&` +
  `endDate=${today.toISOString()}`,
  {
    headers: {
      'Authorization': 'Bearer {token}'
    }
  }
);

const stats = await statsResponse.json();
console.log(`총 결제액: ${stats.summary.totalAmount}원`);
console.log(`총 혜택: ${stats.summary.totalBenefit}원`);
console.log(`거래 건수: ${stats.summary.totalTransactions}건`);

// 가맹점별 분석
stats.byMerchant.forEach(merchant => {
  console.log(`${merchant.merchant}: ${merchant.count}건, ${merchant.amount}원`);
});
```

---

## 에러 처리

### 공통 HTTP 상태 코드

| 상태 코드 | 설명 | 대응 |
|---------|------|------|
| 200 | 성공 | 응답 데이터 처리 |
| 201 | 생성됨 | 새 리소스 생성 완료 |
| 400 | 잘못된 요청 | 요청 파라미터 검증 |
| 401 | 인증 실패 | JWT 토큰 갱신 필요 |
| 403 | 권한 거부 | 다른 사용자 데이터 접근 시도 |
| 404 | 찾을 수 없음 | 리소스 확인 필요 |
| 500 | 서버 오류 | 로그 확인, 지원팀 연락 |

### PortOne API 에러

```typescript
// PortOne API 호출 실패 예제
{
  "statusCode": 400,
  "message": "빌링키 발급에 실패했습니다.",
  "error": "BadRequestException",
  "details": {
    "type": "INVALID_REQUEST",
    "pgCode": "400000",
    "pgMessage": "Invalid merchant key"
  }
}
```

### 에러 응답 구조

```typescript
{
  "statusCode": number;        // HTTP 상태 코드
  "message": string;           // 사용자 친화적 메시지
  "error": string;             // 에러 타입
  "details"?: {                // 추가 상세 정보 (선택사항)
    "type": string;
    "pgCode"?: string;
    "pgMessage"?: string;
  };
  "timestamp": string;         // ISO 8601 형식
  "path": string;              // 요청 경로
}
```

### 프론트엔드 에러 처리 예제

```typescript
async function handleApiError(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    
    switch (response.status) {
      case 400:
        showToast(error.message, 'error');
        break;
      case 401:
        // JWT 갱신 또는 로그인 페이지로 이동
        redirectToLogin();
        break;
      case 403:
        showToast('권한이 없습니다.', 'error');
        break;
      case 404:
        showToast('요청한 리소스를 찾을 수 없습니다.', 'error');
        break;
      case 500:
        showToast('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.', 'error');
        break;
      default:
        showToast('알 수 없는 오류가 발생했습니다.', 'error');
    }
    
    throw new Error(error.message);
  }
}
```

---

## 배포 체크리스트

### 사전 검사

- [ ] 환경 변수 설정 확인
  - [ ] `PORTONE_API_SECRET` 설정됨
  - [ ] `PORTONE_API_BASE_URL` 올바른 값
  - [ ] `ENCRYPTION_KEY` 32자 이상

- [ ] 데이터베이스
  - [ ] PostgreSQL 14+ 버전 확인
  - [ ] 마이그레이션 적용: `npx prisma migrate deploy`
  - [ ] 백업 생성

- [ ] 코드 품질
  - [ ] 빌드 성공: `pnpm build`
  - [ ] 린트 확인: `pnpm lint`
  - [ ] 타입 체크: `pnpm type-check`

- [ ] 테스트
  - [ ] 단위 테스트 실행: `pnpm test`
  - [ ] E2E 테스트: `pnpm test:e2e`
  - [ ] PortOne API 연동 테스트 (테스트 키 사용)

### 배포 절차

```bash
# 1. 마이그레이션 적용
npx prisma migrate deploy

# 2. 프로덕션 빌드
pnpm build

# 3. 서버 시작
pnpm start:prod

# 4. 헬스 체크
curl http://localhost:3000/health
```

### 모니터링

배포 후 다음을 모니터링합니다:

- [ ] 애플리케이션 로그
  - 에러 레벨 로그 확인
  - PortOne API 응답 시간 확인

- [ ] 데이터베이스
  - 쿼리 성능 모니터링
  - 인덱스 활용도 확인
  - 연결 풀 상태 확인

- [ ] 외부 서비스
  - PortOne API 가용성 확인
  - 네트워크 지연 모니터링

### 롤백 계획

문제 발생 시:

```bash
# 1. 서버 중지
pm2 stop app

# 2. 이전 버전으로 복구
git checkout {previous-commit}
pnpm install
pnpm build

# 3. 데이터베이스 마이그레이션 롤백
npx prisma migrate resolve --rolled-back {migration-name}

# 4. 서버 재시작
pm2 start app
```

---

## 트러블슈팅

### 문제: PortOne API 호출 실패

**증상**: 
```
Error: 401 Unauthorized
```

**해결책**:
```bash
# 1. API 시크릿 확인
echo $PORTONE_API_SECRET

# 2. API 엔드포인트 확인
curl -H "Authorization: PortOne {API_SECRET}" \
  https://api.portone.io/identity-verifications

# 3. 타임아웃 확인
# PortOneService에서 타임아웃 값 조정 (기본값: 60000ms)
```

### 문제: 데이터베이스 마이그레이션 실패

**증상**:
```
Error: P3008 - Failed to create shadow database
```

**해결책**:
```bash
# 1. 마이그레이션 상태 확인
npx prisma migrate status

# 2. 풀링 연결 비활성화 (마이그레이션 중)
# .env에서 DATABASE_URL 수정

# 3. 마이그레이션 재시도
npx prisma migrate deploy
```

### 문제: JWT 인증 오류

**증상**:
```
Error: 401 Unauthorized - Invalid token
```

**해결책**:
```typescript
// 1. JWT_SECRET 설정 확인
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// 2. 토큰 만료 시간 확인
// JwtModule 설정에서 expiresIn 값 확인

// 3. 토큰 갱신 엔드포인트 호출
POST /auth/refresh
{
  "refreshToken": "your_refresh_token"
}
```

### 문제: 암호화 오류

**증상**:
```
Error: Failed to decrypt - Unsupported state or unable to authenticate data
```

**해결책**:
```bash
# 1. ENCRYPTION_KEY 확인
echo $ENCRYPTION_KEY | wc -c  # 32 이상이어야 함

# 2. 암호화 키 재설정 (새 키로 변경하면 기존 데이터는 복호화 불가)
# .env 파일에서 ENCRYPTION_KEY 업데이트

# 3. 데이터 마이그레이션 필요시 도움말 참조
```

---

## 성능 최적화

### 데이터베이스 인덱스

```sql
-- payment_transactions 성능 최적화
CREATE INDEX idx_user_status ON payment_transactions(user_uuid, status);
CREATE INDEX idx_user_created ON payment_transactions(user_uuid, created_at);
CREATE INDEX idx_portone_payment ON payment_transactions(portone_payment_id);

-- payment_methods 성능 최적화
CREATE INDEX idx_user_uuid ON payment_methods(user_uuid);
CREATE INDEX idx_billing_key ON payment_methods(billing_key_id);

-- identity_verifications 성능 최적화
CREATE INDEX idx_user_identity ON identity_verifications(user_uuid);
CREATE INDEX idx_portone_id ON identity_verifications(portone_id);
```

### 쿼리 최적화

```typescript
// ✅ 좋은 예: select 필드 명시
const payments = await this.prisma.payment_transactions.findMany({
  where: { user_uuid: userId },
  select: {
    seq: true,
    uuid: true,
    amount: true,
    status: true,
    created_at: true,
  },
  take: 20,
});

// ❌ 나쁜 예: 전체 필드 로드
const payments = await this.prisma.payment_transactions.findMany({
  where: { user_uuid: userId },
  take: 20,
});
```

### 캐싱 전략

```typescript
// Redis 캐싱 예제
const cacheKey = `billing-keys:${userUuid}`;
const cachedResult = await this.redis.get(cacheKey);

if (cachedResult) {
  return JSON.parse(cachedResult);
}

const result = await this.prisma.payment_methods.findMany({
  where: { user_uuid: userUuid },
});

// 5분 캐시
await this.redis.setex(cacheKey, 300, JSON.stringify(result));

return result;
```

---

## 보안 고려사항

### 민감한 정보 보호

```typescript
// ✅ 카드 번호 마스킹
const maskCardNumber = (cardNumber: string) => {
  return cardNumber.replace(/\d(?=\d{4})/g, '*');
};

// ✅ 암호화된 저장
const encryptedNumber = encrypt(cardNumber, ENCRYPTION_KEY);
await this.prisma.payment_methods.create({
  data: {
    card_number_hash: encryptedNumber,
  },
});

// ✅ 응답에서 민감한 정보 제거
const responseData = {
  id: paymentMethod.seq,
  last4Nums: paymentMethod.last_4_nums,
  // card_number_hash 제외
  // cvv_hash 제외
};
```

### 요청 검증

```typescript
// DTO를 통한 입력 검증
class IssueBillingKeyDto {
  @IsString()
  @IsOptional()
  channelKey?: string;

  @IsString()
  @IsNotEmpty()
  billingKeyMethod: string;

  @IsString()
  @IsOptional()
  customData?: string;
}
```

### CORS 및 속도 제한

```typescript
// app.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,  // 1분
        limit: 10,   // 10 요청
      },
      {
        name: 'long',
        ttl: 300000, // 5분
        limit: 30,   // 30 요청
      },
    ]),
  ],
})
export class AppModule {}
```

---

## 참고 자료

### PortOne V2 REST API
- [공식 문서](https://developers.portone.io/docs)
- [Identity Verification API](https://developers.portone.io/api/identity-verification)
- [Billing Key API](https://developers.portone.io/api/billing-key)

### NestJS 리소스
- [NestJS 공식 문서](https://docs.nestjs.com)
- [Prisma ORM](https://www.prisma.io/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs)

### 관련 기술
- [JWT 이해하기](https://jwt.io/introduction)
- [REST API 설계](https://restfulapi.net)
- [데이터베이스 정규화](https://en.wikipedia.org/wiki/Database_normalization)

---

## FAQ (자주 묻는 질문)

### Q1: 본인인증 OTP 유효 시간은?
**A**: PortOne API에 따라 일반적으로 5분입니다. Identity Verification 응답에서 `expiresAt` 필드를 확인하세요.

### Q2: 빌링키로 여러 번 결제할 수 있나요?
**A**: 네, 빌링키는 정기 결제나 반복 결제에 사용됩니다. 빌링키 상태가 `ISSUED`이면 언제든 사용 가능합니다.

### Q3: 결제 이력은 얼마나 오래 보관되나요?
**A**: 데이터베이스 정책에 따라 다릅니다. 일반적으로 1년 이상 보관하는 것을 권장합니다.

### Q4: 암호화된 데이터를 어떻게 조회하나요?
**A**: `encryption.util.ts`의 `decrypt()` 함수를 사용하세요. 암호화된 필드는 자동으로 복호화됩니다.

### Q5: PortOne API 호출 실패 시 재시도 로직이 있나요?
**A**: 현재는 없습니다. 필요시 `try-catch` 블록에서 수동으로 구현할 수 있습니다.

### Q6: 여러 빌링키 중 기본값을 어떻게 설정하나요?
**A**: `PATCH /billing-keys/{id}/default` 엔드포인트를 호출하면 해당 빌링키가 기본값으로 설정되고 이전 기본값은 해제됩니다.

---

## 지원 및 연락처

### 문제 발생 시
1. 이 문서의 [트러블슈팅](#트러블슈팅) 섹션 참조
2. [PortOne 개발자 커뮤니티](https://community.portone.io) 방문
3. 기술 지원팀에 문의

### 버전 정보
- **구현 버전**: 1.0.0
- **마지막 업데이트**: 2025-01-13
- **호환 NestJS**: 11.x
- **호환 PortOne API**: V2

---

**문서 작성자**: GitHub Copilot  
**최종 검수**: 2025-01-13  
**라이선스**: MIT
