# 결제수단 관리 API 테스트 가이드

## 📝 테스트 계정 정보
- **Email**: `test@example.com`
- **Password**: `test1234`

## 🔐 1. 로그인하여 토큰 받기

```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test1234"
}
```

**응답에서 `access_token`을 복사하세요!**

---

## 💳 2. 결제수단 API 테스트

### 2.1 내 결제수단 목록 조회
```bash
GET http://localhost:3000/payment-methods
Authorization: Bearer {access_token}
```

### 2.2 결제수단 등록
```bash
POST http://localhost:3000/payment-methods
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "type": "CARD",
  "provider_name": "국민카드",
  "last_4_nums": "3456",
  "alias": "회사카드",
  "is_primary": false
}
```

**type 옵션**: `CARD`, `PAYPAL`, `APPLEPAY`, `KAKAOPAY`, `NAVERPAY`, `ETC`

### 2.3 특정 결제수단 조회
```bash
GET http://localhost:3000/payment-methods/1
Authorization: Bearer {access_token}
```

### 2.4 결제수단 수정 (별칭 변경)
```bash
PATCH http://localhost:3000/payment-methods/2
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "alias": "개인카드"
}
```

### 2.5 주 결제수단으로 설정
```bash
PATCH http://localhost:3000/payment-methods/2/set-primary
Authorization: Bearer {access_token}
```

### 2.6 결제수단 통계 조회
```bash
GET http://localhost:3000/payment-methods/statistics
Authorization: Bearer {access_token}
```

### 2.7 결제수단 삭제
```bash
DELETE http://localhost:3000/payment-methods/3
Authorization: Bearer {access_token}
```

⚠️ **주의**: 주 결제수단인 경우 다른 결제수단을 먼저 주 결제수단으로 설정해야 삭제 가능합니다.

---

## 🌐 Swagger UI로 테스트하기

1. 브라우저에서 접속: `http://localhost:3000/swagger`
2. **Auth** 섹션에서 로그인하여 토큰 받기
3. 우측 상단 **Authorize** 버튼 클릭
4. `Bearer {access_token}` 입력
5. **Payment Methods** 섹션에서 API 테스트

---

## ✅ 시드 데이터

이미 생성된 테스트 데이터:
- 사용자: `test@example.com` / `test1234`
- 결제수단 1: 신한카드 *1234 (주카드) - 주 결제수단
- 결제수단 2: 카카오페이 *5678 (간편결제)
- 결제수단 3: 삼성카드 *9012

---

## 🔄 데이터 초기화

데이터를 다시 생성하려면:
```bash
npm run prisma:seed
```

---

## 📊 응답 예시

### 결제수단 목록 조회 응답
```json
{
  "count": 3,
  "data": [
    {
      "seq": "1",
      "user_seq": "1",
      "type": "CARD",
      "provider_name": "신한카드",
      "last_4_nums": "1234",
      "alias": "주카드",
      "is_primary": true,
      "created_at": "2025-10-22T07:40:00.000Z"
    }
  ]
}
```

### 통계 조회 응답
```json
{
  "total": 3,
  "byType": {
    "CARD": 2,
    "KAKAOPAY": 1
  },
  "primary": {
    "seq": "1",
    "type": "CARD",
    "provider_name": "신한카드",
    "last_4_nums": "1234",
    "alias": "주카드"
  }
}
```
