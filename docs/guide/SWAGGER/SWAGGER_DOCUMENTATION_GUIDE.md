# 🎨 Swagger 문서 개선 가이드

> **문제점**: "스웨거 문서 똑바로 작성안하지? 지금 뭘 요청해야하는지 이러한것이 아무것도 없잖아"
> 
> **해결책**: 모든 엔드포인트에 요청/응답 스키마 및 실제 예제 데이터 추가 완료 ✅

---

## 📋 최근 개선 사항

### 1. **응답 DTO 생성** (`src/common/dto/swagger-responses.dto.ts`)

모든 API의 요청/응답을 명확하게 정의하는 DTO 클래스 추가:

```typescript
✅ AuthUserDto - 사용자 기본 정보
✅ LoginResponseDto - 로그인 응답 (accessToken + user)
✅ RegisterResponseDto - 회원가입 응답
✅ PaymentMethodResponseDto - 결제수단 상세 정보
✅ PaymentMethodsListResponseDto - 결제수단 목록
✅ BenefitItemDto - 개별 혜택 정보
✅ CardBenefitDto - 카드별 혜택
✅ BenefitsCompareResponseDto - 혜택 비교 응답
✅ PaymentTransactionDto - 결제 거래 정보
✅ PaymentRecordResponseDto - 결제 기록 응답
✅ ErrorResponseDto - 에러 응답
✅ UnauthorizedErrorDto - 인증 실패 응답
```

### 2. **모든 컨트롤러 업데이트**

#### ✅ Auth Controller (`src/auth/auth.controller.ts`)
- 🔹 로그인: 요청 예제 + 응답 스키마 추가
- 🔹 회원가입: 요청 예제 + 응답 스키마 추가
- 🔹 이메일 인증: 경로 파라미터 설명
- 🔹 사용자 삭제: 모든 상태 코드 문서화
- 🔹 소셜 로그인 콜백: 응답 스키마 명시

#### ✅ Payment Methods Controller (`src/payment-methods/payment-methods.controller.ts`)
- 🔹 카드 등록: CreatePaymentMethodDto 예제 포함
- 🔹 카드 목록 조회: 응답 스키마 명시
- 🔹 카드 통계: 응답 구조 설명
- 🔹 카드 수정: 요청/응답 예제 포함
- 🔹 주 결제수단 설정: 상태 코드별 응답
- 🔹 카드 삭제: 에러 케이스 모두 문서화

#### ✅ Benefits Controller (`src/benefits/benefits.controller.ts`)
- 🔹 혜택 비교: 쿼리 파라미터 상세 설명
- 🔹 TOP3 추천: 예제 데이터 포함
- 🔹 HTML 추출: 샘플 텍스트 예제
- 🔹 HTML 반영 TOP3: 완전한 요청 본문 예제

#### ✅ Payments Controller (`src/payments/payments.controller.ts`)
- 🔹 결제 기록: 요청 예제 + 응답 스키마

#### ✅ Users Controller (`src/users/users.controller.ts`)
- 🔹 회원가입: 비밀번호 규칙 포함 예제

#### ✅ Main Swagger Setup (`src/main.ts`)
- 🔹 설명에 인증 방법 추가 (Bearer Token 사용법)
- 🔹 태그 설명 개선
- 🔹 모든 모듈 태그 추가

---

## 🚀 사용 방법

### **1. 로컬에서 테스트**

```bash
# 백엔드 시작
cd /Users/user/backend
pnpm start

# Swagger UI 접속
open http://localhost:3000/swagger
```

### **2. Swagger UI에서 요청 예제 확인**

각 엔드포인트마다 이제 다음이 모두 표시됩니다:

| 항목 | 예시 |
|------|------|
| **설명** | "이메일과 비밀번호로 JWT 토큰을 발급받습니다." |
| **요청 본문 예제** | `{ "email": "user@example.com", "password": "Password123!" }` |
| **응답 200** | `{ "message": "로그인 성공", "data": { "accessToken": "...", "user": {...} } }` |
| **응답 401** | `{ "statusCode": 401, "message": "유효하지 않은 토큰입니다", "error": "UnauthorizedException" }` |
| **쿼리/경로 파라미터** | `id` (결제수단 ID), `userUuid` (사용자 UUID) 등 모두 예제 포함 |

### **3. 구체적인 예제들**

#### 로그인 예제
```json
REQUEST POST /api/auth/email/login
{
  "email": "test@example.com",
  "password": "SecurePassword123!"
}

RESPONSE 200
{
  "message": "로그인 성공",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "email": "test@example.com",
      "name": "홍길동",
      "profileImage": null
    }
  }
}
```

#### 결제수단 등록 예제
```json
REQUEST POST /api/payment-methods
Authorization: Bearer YOUR_JWT_TOKEN

{
  "alias": "내 신용카드",
  "cardToken": "card_token_from_provider",
  "isPrimary": true
}

RESPONSE 201
{
  "message": "결제수단이 등록되었습니다.",
  "data": {
    "seq": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440001",
    "last4": "1111",
    "cardType": "VISA",
    "alias": "내 신용카드",
    "isPrimary": true,
    "createdAt": "2025-11-12T13:59:44.000Z"
  }
}
```

#### 혜택 비교 예제
```
GET /api/benefits/compare?userUuid=550e8400-e29b-41d4-a716-446655440000&merchant=GS편의점&amount=50000

RESPONSE 200
{
  "data": [
    {
      "cardUuid": "550e8400-e29b-41d4-a716-446655440001",
      "cardName": "BC 신용카드",
      "last4": "1111",
      "benefits": [
        {
          "type": "PERCENT",
          "value": 2,
          "description": "편의점 2% 할인"
        }
      ],
      "totalBenefit": 1000
    }
  ]
}
```

---

## 📊 상태 코드별 응답

모든 엔드포인트에서 다음 상태 코드를 문서화했습니다:

| 코드 | 의미 | 예시 |
|------|------|------|
| **200** | 성공 | 조회, 수정, 삭제 성공 |
| **201** | 생성됨 | 카드 등록, 결제 기록 생성 |
| **400** | 잘못된 요청 | 유효하지 않은 파라미터 |
| **401** | 인증 실패 | 잘못된 토큰, 만료된 토큰 |
| **403** | 권한 없음 | 다른 사용자의 리소스 접근 |
| **404** | 찾을 수 없음 | 존재하지 않는 카드 |
| **409** | 충돌 | 중복된 이메일, 주 카드 삭제 불가 |

---

## 🔐 인증 (Bearer Token)

모든 `@ApiBearerAuth()` 데코레이터가 적용된 엔드포인트는:

1. Swagger UI의 **Authorize** 버튼에 입력할 수 있습니다
2. 요청 헤더에 자동으로 추가됩니다: `Authorization: Bearer YOUR_TOKEN`

**Swagger에서 테스트하기**:
```
1. 우상단 "Authorize" 버튼 클릭
2. JWT 토큰 입력 (Bearer 앞 단어 제외)
3. Authorize 클릭
4. 이후 모든 요청에 토큰 자동 포함
```

---

## 📝 예제 데이터 표준

모든 예제 데이터는 다음과 같이 표준화했습니다:

```typescript
// 사용자
uuid: "550e8400-e29b-41d4-a716-446655440000"
email: "test@example.com" / "user@example.com" / "newuser@example.com"
name: "홍길동"

// 결제수단
last4: "1111" / "1234"
cardType: "VISA" / "MASTERCARD"
alias: "내 신용카드" / "업데이트된 카드명"

// 결제
merchant: "GS편의점" / "편의점"
amount: 50000 (원)
currency: "KRW"

// 혜택
type: "PERCENT" (%) / "FLAT" (원)
value: 2 (수치)
```

---

## ✅ 완료 체크리스트

- ✅ 모든 응답 DTO 생성
- ✅ Auth 컨트롤러 모든 엔드포인트 문서화
- ✅ Payment Methods 컨트롤러 모든 엔드포인트 문서화
- ✅ Benefits 컨트롤러 모든 엔드포인트 문서화
- ✅ Payments 컨트롤러 문서화
- ✅ Users 컨트롤러 문서화
- ✅ 모든 상태 코드 명시
- ✅ 요청 본문 예제 추가
- ✅ 쿼리/경로 파라미터 설명 추가
- ✅ Bearer Token 인증 설명 추가
- ✅ Codacy 분석 통과 (0 에러)

---

## 🔍 확인 방법

### **Swagger UI에서 직접 확인**

1. 로컬 서버 시작: `pnpm start`
2. Swagger 접속: `http://localhost:3000/swagger`
3. 각 엔드포인트 확장: 요청/응답 스키마 및 예제 확인
4. **"Try it out" 클릭**: 실제로 요청 테스트

### **cURL로 확인**

```bash
# 로그인 (예제 요청 자동 생성)
curl -X POST http://localhost:3000/api/auth/email/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePassword123!"}'

# 결제수단 조회 (인증 필요)
curl -X GET http://localhost:3000/api/payment-methods \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 요약

**이제 Swagger 문서는**:
- ✅ **명확한 설명**: 각 엔드포인트가 뭘 하는지 분명함
- ✅ **요청 예제**: "뭘 요청해야 하는지" 한눈에 보임
- ✅ **응답 스키마**: "뭘 받을 수 있는지" 모두 문서화
- ✅ **에러 처리**: 각 상황별 응답을 명확히 함
- ✅ **실행 가능**: Swagger UI에서 바로 테스트 가능

**사용자는 이제**:
1. Swagger UI에서 요청 형식 확인 → "아, 이렇게 요청하는 구나"
2. "Try it out" 버튼으로 실제 테스트
3. 응답 예제로 파싱 방법 이해
4. 에러 시 어떤 상태 코드가 올지 미리 알 수 있음

---

## 📚 관련 파일

- `src/common/dto/swagger-responses.dto.ts` - 모든 응답 DTO
- `src/auth/auth.controller.ts` - Auth 엔드포인트
- `src/payment-methods/payment-methods.controller.ts` - Payment Methods 엔드포인트
- `src/benefits/benefits.controller.ts` - Benefits 엔드포인트
- `src/payments/payments.controller.ts` - Payments 엔드포인트
- `src/users/users.controller.ts` - Users 엔드포인트
- `src/main.ts` - Swagger 초기화 및 설정

---

**마지막 업데이트**: 2025-11-12
**상태**: ✅ 완료 (Codacy 분석 통과, 0 에러)
