# PortOne V2 연동 가이드 - FE 통합

## 📌 개요

PortOne REST API V2를 이용한 본인인증, 빌링키(카드 등록), 결제 이력 관리 기능입니다.

**책임**:
- 사용자 본인인증 (SMS/앱)
- 빌링키 발급 및 관리 (정기 결제용 카드)
- 결제 거래 조회 및 통계

---

## 🔐 본인인증 (Identity Verification)

### 1. 본인인증 시작

```http
POST /identity-verifications/{portoneId}/send
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "operator": "SKT",        // SKT, KT, LG, MVN
  "method": "SMS",          // SMS, APP
  "storeId": "store_123"    // 선택사항
}

Response 200 OK:
{
  "portoneId": "imp_12345",
  "status": "PENDING",
  "message": "본인인증이 시작되었습니다.",
  "expiresAt": "2025-01-13T12:10:00Z"
}
```

**파라미터**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| operator | string | O | SKT, KT, LG, MVN (통신사) |
| method | string | O | SMS 또는 APP |
| storeId | string | X | 가맹점 ID |

---

### 2. OTP 검증

```http
POST /identity-verifications/{portoneId}/confirm
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "otp": "123456",          // 6자리 OTP
  "storeId": "store_123"    // 선택사항
}

Response 200 OK:
{
  "portoneId": "imp_12345",
  "status": "VERIFIED",
  "userData": {
    "name": "홍길동",
    "phone": "010****5678",
    "birthDate": "1990-01-15",
    "gender": "M"
  },
  "message": "인증이 완료되었습니다."
}
```

---

### 3. 본인인증 재발송

```http
POST /identity-verifications/{portoneId}/resend
Authorization: Bearer {access_token}

Response 200 OK:
{
  "portoneId": "imp_12345",
  "status": "PENDING",
  "message": "본인인증이 재발송되었습니다.",
  "retryCount": 2
}
```

---

### 4. 본인인증 조회

```http
GET /identity-verifications/{portoneId}
Authorization: Bearer {access_token}

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

---

### 5. 본인인증 목록

```http
GET /identity-verifications?page=1&pageSize=20
Authorization: Bearer {access_token}

Response 200 OK:
{
  "data": [
    {
      "seq": 2,
      "portoneId": "imp_12346",
      "operator": "KT",
      "status": "VERIFIED",
      "createdAt": "2025-01-13T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

---

## 💳 빌링키 (결제 카드 등록)

### 1. 빌링키 발급

```http
POST /billing-keys
Authorization: Bearer {access_token}
Content-Type: application/json

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
```

---

### 2. 빌링키 목록

```http
GET /billing-keys?page=1&pageSize=10
Authorization: Bearer {access_token}

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
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1
  }
}
```

---

### 3. 기본 빌링키 설정

```http
PATCH /billing-keys/{id}/default
Authorization: Bearer {access_token}

Response 200 OK:
{
  "id": 5,
  "isPrimary": true,
  "message": "기본 결제 수단으로 설정되었습니다."
}
```

---

## 💻 프론트엔드 구현 예제

### 1. React - 본인인증 플로우

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

function IdentityVerification() {
  const [step, setStep] = useState<'init' | 'waiting' | 'confirm' | 'done'>('init');
  const [operator, setOperator] = useState('SKT');
  const [method, setMethod] = useState('SMS');
  const [portoneId, setPortoneId] = useState('');
  const [otp, setOtp] = useState('');
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: 본인인증 시작
  const handleStartVerification = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        `/identity-verifications/${portoneId}/send`,
        { operator, method }
      );
      console.log('본인인증 시작:', response.data);
      setStep('waiting');
    } catch (error) {
      alert('본인인증 시작 실패');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP 검증
  const handleConfirmOtp = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        `/identity-verifications/${portoneId}/confirm`,
        { otp }
      );
      setVerifiedData(response.data.userData);
      setStep('done');
      alert('본인인증 완료!');
    } catch (error) {
      alert('OTP 검증 실패');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'init') {
    return (
      <div className="identity-init">
        <h2>본인인증</h2>
        
        <div className="form-group">
          <label>통신사 선택:</label>
          <select value={operator} onChange={(e) => setOperator(e.target.value)}>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG">LG+</option>
            <option value="MVN">알뜰폰</option>
          </select>
        </div>

        <div className="form-group">
          <label>인증 방식:</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="SMS">SMS</option>
            <option value="APP">앱</option>
          </select>
        </div>

        <button 
          onClick={handleStartVerification}
          disabled={loading}
        >
          {loading ? '처리 중...' : '본인인증 시작'}
        </button>
      </div>
    );
  }

  if (step === 'waiting') {
    return (
      <div className="identity-waiting">
        <h2>OTP 입력</h2>
        <p>문자 또는 앱에서 받은 6자리 인증번호를 입력해주세요.</p>

        <div className="form-group">
          <label>인증번호:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength="6"
          />
        </div>

        <button 
          onClick={handleConfirmOtp}
          disabled={loading || otp.length !== 6}
        >
          {loading ? '검증 중...' : '확인'}
        </button>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="identity-done">
        <h2>✅ 본인인증 완료</h2>
        <p>이름: {verifiedData?.name}</p>
        <p>생년월일: {verifiedData?.birthDate}</p>
      </div>
    );
  }

  return null;
}

export default IdentityVerification;
```

### 2. React - 빌링키 발급

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

function IssueBillingKey() {
  const [loading, setLoading] = useState(false);
  const [billingKey, setBillingKey] = useState<any>(null);

  const handleIssueBillingKey = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/billing-keys', {
        billingKeyMethod: 'CARD',
        customData: 'regular_payment',
      });

      setBillingKey(response.data);
      alert('빌링키 발급 완료!');
    } catch (error) {
      alert('빌링키 발급 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="billing-key-issue">
      <h2>정기 결제용 카드 등록</h2>
      
      {!billingKey ? (
        <button 
          onClick={handleIssueBillingKey}
          disabled={loading}
        >
          {loading ? '등록 중...' : '카드 등록'}
        </button>
      ) : (
        <div className="success">
          <p>✅ 카드 등록 완료!</p>
          <p>빌링키: {billingKey.billingKeyId}</p>
          <p>상태: {billingKey.status}</p>
        </div>
      )}
    </div>
  );
}

export default IssueBillingKey;
```

---

## 📊 결제 이력 (Payment History)

### 1. 결제 이력 조회

```http
GET /payments/history?page=1&pageSize=20&status=COMPLETED
Authorization: Bearer {access_token}

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
      "createdAt": "2025-01-13T11:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

---

### 2. 결제 상세 정보

```http
GET /payments/history/{id}
Authorization: Bearer {access_token}

Response 200 OK:
{
  "id": 3,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "portonePaymentId": "payment_123456",
  "merchant": "카페 아메리",
  "amount": 5000,
  "benefit": {
    "value": 500,
    "description": "5% 캐시백"
  },
  "status": "COMPLETED",
  "createdAt": "2025-01-13T11:30:00Z"
}
```

---

### 3. 결제 통계

```http
GET /payments/statistics/overview
Authorization: Bearer {access_token}

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

## 💻 프론트엔드 예제 - 결제 이력

### React - 결제 이력 조회

```typescript
import { useEffect, useState } from 'react';
import apiClient from './apiClient';

function PaymentHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('COMPLETED');

  useEffect(() => {
    fetchHistory();
  }, [status]);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get('/payments/history', {
        params: { status, page: 1, pageSize: 20 },
      });
      setTransactions(response.data.data);
    } catch (error) {
      console.error('결제 이력 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="payment-history">
      <h2>결제 이력</h2>

      <div className="filter">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="COMPLETED">완료</option>
          <option value="PENDING">대기</option>
          <option value="FAILED">실패</option>
        </select>
      </div>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>가맹점</th>
            <th>금액</th>
            <th>혜택</th>
            <th>상태</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.merchant}</td>
              <td>{tx.amount.toLocaleString()}원</td>
              <td>{tx.benefit.description}</td>
              <td>{tx.status}</td>
              <td>{new Date(tx.createdAt).toLocaleDateString('ko-KR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistory;
```

---

## 🚀 구현 체크리스트

### 본인인증
- [ ] 통신사 선택 UI
- [ ] 인증 방식 선택 (SMS/APP)
- [ ] 본인인증 시작 API 호출
- [ ] OTP 입력 폼
- [ ] OTP 검증 API 호출
- [ ] 인증 완료 상태 관리

### 빌링키
- [ ] 빌링키 발급 버튼
- [ ] 빌링키 목록 표시
- [ ] 기본 빌링키 설정
- [ ] 빌링키 삭제 (선택사항)

### 결제 이력
- [ ] 결제 이력 목록 조회
- [ ] 상태별 필터링 (완료, 대기, 실패)
- [ ] 결제 상세 정보
- [ ] 통계 대시보드

---

## 💡 팁 & 트릭

### 1. OTP 자동 입력 (SMS 기반)

```typescript
// 사용자가 SMS 받으면 자동으로 입력 필드에 포커스
const otpInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  otpInputRef.current?.focus();
}, [step]);

// 블립페이스트처럼 OTP 자동 채우기
const handlePaste = async (e: React.ClipboardEvent) => {
  const text = await e.clipboardData.getData('text');
  if (/^\d{6}$/.test(text)) {
    setOtp(text);
    e.preventDefault();
  }
};
```

### 2. 타임아웃 카운터

```typescript
const [timeLeft, setTimeLeft] = useState(300); // 5분

useEffect(() => {
  if (step !== 'waiting') return;

  const interval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        setStep('init');
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [step]);

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};
```

### 3. 재시도 횟수 제한

```typescript
const [retryCount, setRetryCount] = useState(0);
const MAX_RETRIES = 3;

const handleRetry = async () => {
  if (retryCount >= MAX_RETRIES) {
    alert('재시도 횟수를 초과했습니다.');
    setStep('init');
    return;
  }

  setRetryCount(prev => prev + 1);
  // 재발송 로직
};
```

---

## ⚠️ 주의사항

1. **개인정보 보호**: 본인인증 정보는 안전하게 처리
2. **타임아웃**: OTP는 제한된 시간 동안만 유효
3. **재시도 제한**: 무분별한 재시도 방지
4. **HTTPS 필수**: 민감한 정보 전송 시 반드시 필요

---

## 🔗 참고

- [PortOne 공식 문서](https://developers.portone.io)
- [이전 가이드: 인증 모듈](./01_AUTH_INTEGRATION_GUIDE.md)
- [이전 가이드: 결제 수단](./03_PAYMENT_METHODS_GUIDE.md)

---

**작성자**: GitHub Copilot  
**최종 업데이트**: 2025-01-13  
**버전**: 1.0.0
