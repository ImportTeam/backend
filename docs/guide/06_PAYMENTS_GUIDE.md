# 결제 기록 모듈 (PAYMENTS) - FE 연동 가이드

## 📌 개요

사용자의 결제 거래 내역을 기록하고 관리하는 모듈입니다. 각 결제마다 적용된 혜택을 함께 저장합니다.

**책임**:
- 결제 내역 기록
- 결제 거래 저장
- 혜택 정보 기록

---

## 🔐 API 엔드포인트

### 1. 결제 내역 기록

```http
POST /payments/record
Content-Type: application/json

{
  "userUuid": "550e8400-e29b-41d4-a716-446655440000",
  "merchant": "카페 아메리",
  "amount": 5000,
  "paymentMethodSeq": 5
}

Response 201 Created:
{
  "message": "결제가 기록되었습니다.",
  "transaction": {
    "seq": 123,
    "uuid": "660e8400-e29b-41d4-a716-446655440001",
    "merchant": "카페 아메리",
    "amount": 5000,
    "benefit_value": 500,
    "benefit_desc": "5% 할인",
    "status": "COMPLETED",
    "compared_at": "2025-01-13T14:35:00Z",
    "created_at": "2025-01-13T14:35:00Z"
  }
}
```

**요청 파라미터**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| userUuid | string | O | 사용자 UUID |
| merchant | string | O | 가맹점 이름 |
| amount | number | O | 결제 금액 (원) |
| paymentMethodSeq | number | X | 결제 수단 ID (선택사항) |

**응답 필드**:
| 필드 | 설명 |
|------|------|
| seq | 거래 ID (내부용) |
| uuid | 거래 고유 ID (외부용) |
| benefit_value | 받은 혜택 금액 (원) |
| benefit_desc | 혜택 설명 (예: 5% 할인) |
| status | COMPLETED, PENDING, FAILED |

---

## 💻 프론트엔드 구현 예제

### 1. React - 결제 기록 등록

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

interface RecordPaymentRequest {
  userUuid: string;
  merchant: string;
  amount: number;
  paymentMethodSeq?: number;
}

function RecordPayment() {
  const [userUuid, setUserUuid] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethodSeq, setPaymentMethodSeq] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/payments/record', {
        userUuid,
        merchant,
        amount: parseInt(amount),
        paymentMethodSeq: paymentMethodSeq ? parseInt(paymentMethodSeq.toString()) : undefined,
      } as RecordPaymentRequest);

      setResult(response.data.transaction);
      alert('결제가 기록되었습니다.');

      // 폼 리셋
      setMerchant('');
      setAmount('');
      setPaymentMethodSeq(undefined);
    } catch (error: any) {
      alert(error.response?.data?.message || '결제 기록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="record-payment">
      <h2>결제 기록</h2>

      <form onSubmit={handleRecordPayment} className="payment-form">
        <div className="form-group">
          <label>사용자 UUID:</label>
          <input
            type="text"
            value={userUuid}
            onChange={(e) => setUserUuid(e.target.value)}
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            required
          />
        </div>

        <div className="form-group">
          <label>가맹점:</label>
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="예: 카페 아메리"
            required
          />
        </div>

        <div className="form-group">
          <label>결제 금액:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            required
          />
          <span className="currency">원</span>
        </div>

        <div className="form-group">
          <label>결제 수단 ID (선택):</label>
          <input
            type="number"
            value={paymentMethodSeq || ''}
            onChange={(e) => setPaymentMethodSeq(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="결제 수단이 없으면 비워두세요"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '기록 중...' : '결제 기록'}
        </button>
      </form>

      {result && (
        <div className="result-card">
          <h3>✅ 결제 기록 완료</h3>
          <p>가맹점: <strong>{result.merchant}</strong></p>
          <p>금액: <strong>{result.amount.toLocaleString()}원</strong></p>
          <p>혜택: <strong>{result.benefit_desc || '없음'}</strong></p>
          <p>혜택금액: <strong>{result.benefit_value?.toLocaleString() || 0}원</strong></p>
          <p style={{ fontSize: '0.8em', color: '#666' }}>
            거래 ID: {result.uuid}
          </p>
        </div>
      )}
    </div>
  );
}

export default RecordPayment;
```

### 2. React - 카드 결제 통합

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

interface PaymentFlow {
  selectedMethod: number | null;
  merchant: string;
  amount: number;
  recordedTransaction: any;
}

function CheckoutFlow() {
  const [flow, setFlow] = useState<PaymentFlow>({
    selectedMethod: null,
    merchant: '',
    amount: 0,
    recordedTransaction: null,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'cart' | 'payment' | 'confirm'>('cart');

  const handleProceedToPayment = (merchant: string, amount: number) => {
    setFlow(prev => ({ ...prev, merchant, amount }));
    setStep('payment');
  };

  const handleCompletePayment = async () => {
    if (!flow.selectedMethod || !flow.merchant || !flow.amount) {
      alert('결제 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 1. 결제 기록
      const response = await apiClient.post('/payments/record', {
        userUuid: (JSON.parse(localStorage.getItem('user') || '{}')).uuid,
        merchant: flow.merchant,
        amount: flow.amount,
        paymentMethodSeq: flow.selectedMethod,
      });

      setFlow(prev => ({
        ...prev,
        recordedTransaction: response.data.transaction,
      }));
      setStep('confirm');
    } catch (error) {
      alert('결제 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'cart') {
    return (
      <div className="cart-step">
        <h2>장바구니</h2>
        <button onClick={() => handleProceedToPayment('카페 아메리', 5000)}>
          결제하기 (5,000원)
        </button>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="payment-step">
        <h2>결제 수단 선택</h2>
        <p>가맹점: {flow.merchant}</p>
        <p>금액: {flow.amount.toLocaleString()}원</p>

        {/* 결제 수단 선택 UI */}
        <PaymentMethodSelector
          onSelect={(methodSeq) =>
            setFlow(prev => ({ ...prev, selectedMethod: methodSeq }))
          }
        />

        <button
          onClick={handleCompletePayment}
          disabled={loading || !flow.selectedMethod}
        >
          {loading ? '처리 중...' : '결제'}
        </button>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="confirm-step">
        <h2>✅ 결제 완료</h2>
        <div className="receipt">
          <p>가맹점: {flow.recordedTransaction?.merchant}</p>
          <p>금액: {flow.recordedTransaction?.amount.toLocaleString()}원</p>
          <p>혜택: {flow.recordedTransaction?.benefit_desc || '없음'}</p>
          <p>절약: {flow.recordedTransaction?.benefit_value?.toLocaleString() || 0}원</p>
        </div>
      </div>
    );
  }

  return null;
}

// 결제 수단 선택 컴포넌트
function PaymentMethodSelector({ onSelect }: { onSelect: (seq: number) => void }) {
  const [methods, setMethods] = useState<any[]>([]);

  const loadMethods = async () => {
    try {
      const response = await apiClient.get('/payment-methods');
      setMethods(response.data.data);
    } catch (error) {
      console.error('결제 수단 로드 실패:', error);
    }
  };

  // useEffect에서 로드
  // useEffect(() => { loadMethods(); }, []);

  return (
    <div className="method-selector">
      {methods.map(method => (
        <div
          key={method.seq}
          className="method-option"
          onClick={() => onSelect(method.seq)}
        >
          <div className="method-info">
            <p className="alias">{method.alias}</p>
            <p className="card-number">****{method.last_4_nums}</p>
          </div>
          {method.is_primary && <span className="badge">기본</span>}
        </div>
      ))}
    </div>
  );
}

export default CheckoutFlow;
```

### 3. React Hook - 결제 기록 Custom Hook

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

interface UseRecordPaymentReturn {
  recordPayment: (data: RecordPaymentRequest) => Promise<any>;
  loading: boolean;
  error: string | null;
  transaction: any;
}

interface RecordPaymentRequest {
  userUuid: string;
  merchant: string;
  amount: number;
  paymentMethodSeq?: number;
}

function useRecordPayment(): UseRecordPaymentReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState(null);

  const recordPayment = async (data: RecordPaymentRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/payments/record', data);
      setTransaction(response.data.transaction);
      return response.data.transaction;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '결제 기록 실패';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { recordPayment, loading, error, transaction };
}

// 사용 예시
function PaymentComponent() {
  const { recordPayment, loading, error, transaction } = useRecordPayment();

  const handlePayment = async () => {
    try {
      await recordPayment({
        userUuid: 'user-uuid',
        merchant: '카페',
        amount: 5000,
        paymentMethodSeq: 1,
      });
    } catch (err) {
      console.error('결제 실패:', err);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? '처리 중...' : '결제'}
      </button>
      {error && <div className="error">{error}</div>}
      {transaction && <div className="success">결제 완료!</div>}
    </div>
  );
}

export default useRecordPayment;
```

---

## 📊 데이터 모델

### Payment Transactions 테이블

```sql
CREATE TABLE payment_transactions (
  seq BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL,           -- 거래 고유 ID
  user_uuid VARCHAR(36) NOT NULL,      -- 사용자 ID
  payment_method_seq BIGINT,           -- 결제 수단 ID
  merchant_name VARCHAR(100),          -- 가맹점 이름
  amount DECIMAL(12,2),                -- 결제 금액
  benefit_value DECIMAL(12,2),         -- 적용된 혜택금액
  benefit_desc VARCHAR(255),           -- 혜택 설명
  compared_at TIMESTAMP,               -- 비교 시간
  provider_payment_id VARCHAR UNIQUE,  -- 외부 결제 제공자 결제 ID
  provider_transaction_id VARCHAR,     -- 외부 결제 제공자 거래 ID
  status VARCHAR(50) DEFAULT 'PENDING',-- PENDING, COMPLETED, FAILED
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (user_uuid) REFERENCES users(uuid),
  FOREIGN KEY (payment_method_seq) REFERENCES payment_methods(seq),
  
  INDEX idx_user_status (user_uuid, status),
  INDEX idx_user_created (user_uuid, created_at),
  INDEX idx_provider_payment (provider_payment_id)
);
```

---

## 🚀 구현 체크리스트

- [ ] 결제 기록 API 통합
- [ ] 결제 폼 구현
- [ ] 가맹점 입력
- [ ] 금액 입력
- [ ] 결제 수단 선택
- [ ] 결제 완료 피드백
- [ ] 에러 처리
- [ ] 로딩 상태 관리

---

## 💡 팁 & 트릭

### 1. 결제 금액 자동 계산

```typescript
const calculatePaymentAmount = (baseAmount: number, discount: number) => {
  return baseAmount - discount;
};

// 사용 예
const baseAmount = 5000;
const estimatedBenefit = 500;
const finalAmount = calculatePaymentAmount(baseAmount, estimatedBenefit);
// 결과: 4500원
```

### 2. 거래 ID 복사

```typescript
function copyTransactionId(uuid: string) {
  navigator.clipboard.writeText(uuid);
  alert('거래 ID가 복사되었습니다.');
}
```

### 3. 결제 영수증 생성

```typescript
function generateReceipt(transaction: any) {
  return `
    ========== 영수증 ==========
    가맹점: ${transaction.merchant}
    금액: ${transaction.amount.toLocaleString()}원
    혜택: ${transaction.benefit_desc}
    절약: ${transaction.benefit_value.toLocaleString()}원
    ─────────────────────────
    최종: ${(transaction.amount - transaction.benefit_value).toLocaleString()}원
    거래ID: ${transaction.uuid}
    시간: ${new Date(transaction.created_at).toLocaleString('ko-KR')}
    ============================
  `;
}
```

---

## ⚠️ 주의사항

1. **중복 기록 방지**: 같은 거래가 여러 번 기록되지 않도록 주의
2. **금액 검증**: 입력된 금액이 유효한지 확인
3. **사용자 확인**: userUuid가 현재 로그인 사용자와 일치하는지 확인
4. **결제 수단**: 유효한 결제 수단만 사용

---

## 🔗 다음 단계

1. [혜택 비교 모듈](./04_BENEFITS_GUIDE.md) - 결제 시 최적 수단 추천

---

**작성자**: GitHub Copilot  
**최종 업데이트**: 2025-01-13  
**버전**: 1.0.0
