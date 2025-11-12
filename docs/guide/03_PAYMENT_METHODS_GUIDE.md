# 결제 수단 모듈 (PAYMENT METHODS) - FE 연동 가이드

## 📌 개요

사용자의 결제 수단(카드, 통장 등)을 등록 및 관리하는 모듈입니다.

**책임**:
- 결제 수단 등록 및 조회
- 결제 수단 수정 및 삭제
- 기본 결제 수단 설정
- 결제 수단 통계

---

## 🔐 API 엔드포인트

### 1. 결제 수단 등록

```http
POST /payment-methods
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "type": "CARD",
  "card_number": "1234567890123456",
  "expiry_year": 2026,
  "expiry_month": 12,
  "cvv": "123",
  "alias": "내 신용카드",
  "is_primary": true
}

Response 201 Created:
{
  "message": "결제수단이 등록되었습니다.",
  "data": {
    "seq": 5,
    "user_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "type": "CARD",
    "last_4_nums": "3456",
    "expiry_year": 2026,
    "expiry_month": 12,
    "alias": "내 신용카드",
    "is_primary": true,
    "billing_key_id": "billing_key_abc123",
    "billing_key_status": "ISSUED",
    "created_at": "2025-01-13T14:30:00Z",
    "updated_at": "2025-01-13T14:30:00Z"
  }
}
```

**요청 파라미터**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| type | string | O | CARD, PAYPAL, KAKAOPAY 등 |
| card_number | string | O | 카드 번호 (암호화됨) |
| expiry_year | number | O | 만료 연도 (YYYY) |
| expiry_month | number | O | 만료 월 (1-12) |
| cvv | string | O | 카드 뒷자리 또는 CVV |
| alias | string | O | 결제 수단 별칭 |
| is_primary | boolean | X | 기본 결제 수단 여부 (기본값: false) |

---

### 2. 결제 수단 목록 조회

```http
GET /payment-methods
Authorization: Bearer {access_token}

Response 200 OK:
{
  "count": 2,
  "data": [
    {
      "seq": 5,
      "type": "CARD",
      "last_4_nums": "3456",
      "expiry_year": 2026,
      "expiry_month": 12,
      "alias": "내 신용카드",
      "is_primary": true,
      "billing_key_status": "ISSUED",
      "created_at": "2025-01-13T14:30:00Z"
    },
    {
      "seq": 4,
      "type": "CARD",
      "last_4_nums": "7890",
      "expiry_year": 2025,
      "expiry_month": 6,
      "alias": "회사 카드",
      "is_primary": false,
      "billing_key_status": "ISSUED",
      "created_at": "2025-01-12T10:00:00Z"
    }
  ]
}
```

---

### 3. 특정 결제 수단 조회

```http
GET /payment-methods/{id}
Authorization: Bearer {access_token}

Response 200 OK:
{
  "data": {
    "seq": 5,
    "type": "CARD",
    "last_4_nums": "3456",
    "expiry_year": 2026,
    "expiry_month": 12,
    "alias": "내 신용카드",
    "is_primary": true,
    "billing_key_id": "billing_key_abc123",
    "billing_key_status": "ISSUED",
    "created_at": "2025-01-13T14:30:00Z",
    "updated_at": "2025-01-13T14:30:00Z"
  }
}
```

---

### 4. 결제 수단 수정

```http
PATCH /payment-methods/{id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "alias": "새로운 별칭"
}

Response 200 OK:
{
  "message": "결제수단이 수정되었습니다.",
  "data": {
    "seq": 5,
    "alias": "새로운 별칭",
    "updated_at": "2025-01-13T15:00:00Z"
  }
}
```

**수정 가능 필드**:
| 필드 | 설명 |
|------|------|
| alias | 결제 수단 별칭 |

---

### 5. 기본 결제 수단 설정

```http
PATCH /payment-methods/{id}/set-primary
Authorization: Bearer {access_token}

Response 200 OK:
{
  "message": "주 결제수단으로 설정되었습니다.",
  "data": {
    "seq": 5,
    "is_primary": true,
    "updated_at": "2025-01-13T15:05:00Z"
  }
}
```

---

### 6. 결제 수단 삭제

```http
DELETE /payment-methods/{id}
Authorization: Bearer {access_token}

Response 200 OK:
{
  "message": "결제수단이 삭제되었습니다."
}

Response 400 Bad Request (기본 결제 수단):
{
  "statusCode": 400,
  "message": "기본 결제수단은 삭제할 수 없습니다. 먼저 다른 결제수단을 주 결제수단으로 설정하세요.",
  "error": "BadRequestException"
}
```

---

### 7. 결제 수단 통계

```http
GET /payment-methods/statistics
Authorization: Bearer {access_token}

Response 200 OK:
{
  "total_count": 2,
  "by_type": {
    "CARD": 2,
    "PAYPAL": 0,
    "KAKAOPAY": 0
  },
  "primary_method": {
    "seq": 5,
    "type": "CARD",
    "alias": "내 신용카드",
    "last_4_nums": "3456"
  }
}
```

---

## 💻 프론트엔드 구현 예제

### 1. React - 결제 수단 등록

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

interface PaymentMethodForm {
  type: string;
  card_number: string;
  expiry_year: number;
  expiry_month: number;
  cvv: string;
  alias: string;
  is_primary: boolean;
}

function RegisterPaymentMethod() {
  const [form, setForm] = useState<PaymentMethodForm>({
    type: 'CARD',
    card_number: '',
    expiry_year: new Date().getFullYear(),
    expiry_month: 1,
    cvv: '',
    alias: '',
    is_primary: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/payment-methods', {
        ...form,
        expiry_year: parseInt(form.expiry_year.toString()),
        expiry_month: parseInt(form.expiry_month.toString()),
      });

      alert('결제 수단이 등록되었습니다.');
      // 폼 리셋
      setForm({
        type: 'CARD',
        card_number: '',
        expiry_year: new Date().getFullYear(),
        expiry_month: 1,
        cvv: '',
        alias: '',
        is_primary: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || '등록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group">
        <label>카드 번호:</label>
        <input
          type="text"
          name="card_number"
          value={form.card_number}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>만료 연도:</label>
          <select name="expiry_year" value={form.expiry_year} onChange={handleChange}>
            {[...Array(10)].map((_, i) => {
              const year = new Date().getFullYear() + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <div className="form-group">
          <label>만료 월:</label>
          <select name="expiry_month" value={form.expiry_month} onChange={handleChange}>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>CVV:</label>
          <input
            type="text"
            name="cvv"
            value={form.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>별칭:</label>
        <input
          type="text"
          name="alias"
          value={form.alias}
          onChange={handleChange}
          placeholder="예: 내 신용카드"
          required
        />
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="is_primary"
          name="is_primary"
          checked={form.is_primary}
          onChange={handleChange}
        />
        <label htmlFor="is_primary">기본 결제 수단으로 설정</label>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? '등록 중...' : '등록'}
      </button>
    </form>
  );
}

export default RegisterPaymentMethod;
```

### 2. React - 결제 수단 목록

```typescript
import { useEffect, useState } from 'react';
import apiClient from './apiClient';

interface PaymentMethod {
  seq: number;
  type: string;
  last_4_nums: string;
  alias: string;
  is_primary: boolean;
  created_at: string;
}

function PaymentMethodsList() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const response = await apiClient.get('/payment-methods');
      setMethods(response.data.data);
    } catch (error) {
      console.error('결제 수단 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (seq: number) => {
    const confirmed = window.confirm('이 결제 수단을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await apiClient.delete(`/payment-methods/${seq}`);
      setMethods(methods.filter(m => m.seq !== seq));
      alert('삭제되었습니다.');
    } catch (err: any) {
      alert(err.response?.data?.message || '삭제 실패');
    }
  };

  const handleSetPrimary = async (seq: number) => {
    try {
      await apiClient.patch(`/payment-methods/${seq}/set-primary`);
      // UI 업데이트
      setMethods(methods.map(m => ({
        ...m,
        is_primary: m.seq === seq,
      })));
      alert('기본 결제 수단으로 설정되었습니다.');
    } catch (error) {
      alert('설정 실패');
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="payment-methods-list">
      {methods.map(method => (
        <div key={method.seq} className="payment-method-card">
          <div className="card-info">
            <h3>{method.alias}</h3>
            <p>****{method.last_4_nums}</p>
            {method.is_primary && <span className="badge">기본 결제 수단</span>}
          </div>

          <div className="actions">
            {!method.is_primary && (
              <button 
                onClick={() => handleSetPrimary(method.seq)}
                className="btn-secondary"
              >
                기본으로 설정
              </button>
            )}
            <button 
              onClick={() => handleDelete(method.seq)}
              className="btn-danger"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaymentMethodsList;
```

### 3. React - 결제 수단 선택 컴포넌트

```typescript
import { useEffect, useState } from 'react';
import apiClient from './apiClient';

interface PaymentMethod {
  seq: number;
  alias: string;
  last_4_nums: string;
}

function PaymentMethodSelector() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    apiClient.get('/payment-methods')
      .then(res => {
        setMethods(res.data.data);
        // 기본 결제 수단 선택
        const primary = res.data.data.find((m: any) => m.is_primary);
        setSelected(primary?.seq || null);
      });
  }, []);

  return (
    <div className="payment-method-selector">
      <label>결제 수단 선택:</label>
      <select 
        value={selected || ''} 
        onChange={(e) => setSelected(parseInt(e.target.value))}
      >
        {methods.map(method => (
          <option key={method.seq} value={method.seq}>
            {method.alias} (****{method.last_4_nums})
          </option>
        ))}
      </select>
    </div>
  );
}

export default PaymentMethodSelector;
```

---

## 📊 데이터 모델

### Payment Methods 테이블

```sql
CREATE TABLE payment_methods (
  seq BIGSERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) NOT NULL,
  type VARCHAR(20),                    -- CARD, PAYPAL, KAKAOPAY 등
  card_number_hash VARCHAR(255),       -- 암호화된 카드 번호
  last_4_nums CHAR(4),                 -- 카드 뒷자리 (표시용)
  expiry_year INT,                     -- 만료 연도
  expiry_month INT,                    -- 만료 월
  cvv_hash VARCHAR(255),               -- 암호화된 CVV
  alias VARCHAR(50),                   -- 사용자 지정 별칭
  is_primary BOOLEAN DEFAULT false,    -- 기본 결제 수단
  billing_key_id VARCHAR UNIQUE,       -- PortOne 빌링키 ID
  billing_key_status VARCHAR(50),      -- ISSUED, PENDING, DELETED
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_uuid) REFERENCES users(uuid)
);
```

---

## 🚀 구현 체크리스트

- [ ] 결제 수단 등록 폼
- [ ] 카드 번호 포맷팅 (예: 1234 5678 9012 3456)
- [ ] 만료일 유효성 검증
- [ ] 결제 수단 목록 표시
- [ ] 기본 결제 수단 표시
- [ ] 결제 수단 삭제 확인
- [ ] 결제 수단 선택 컴포넌트

---

## 💡 팁 & 트릭

### 1. 카드 번호 포맷팅

```typescript
const formatCardNumber = (value: string) => {
  return value
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();
};

// 사용 예
const formatted = formatCardNumber('1234567890123456');
// 결과: "1234 5678 9012 3456"
```

### 2. 카드 타입 감지

```typescript
const detectCardType = (cardNumber: string) => {
  const patterns: Record<string, RegExp> = {
    VISA: /^4/,
    MASTERCARD: /^5[1-5]/,
    AMEX: /^3[47]/,
    DINERS: /^3(?:0[0-5]|[68])/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber.replace(/\s/g, ''))) {
      return type;
    }
  }
  return 'UNKNOWN';
};
```

### 3. 만료일 검증

```typescript
const isCardExpired = (year: number, month: number) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return true;
  if (year === currentYear && month < currentMonth) return true;
  return false;
};
```

---

## ⚠️ 주의사항

1. **카드 정보 저장**: 완전한 카드 번호는 저장하지 않음 (PCI-DSS 준수)
2. **CVV 저장**: CVV는 암호화되어 저장됨
3. **HTTPS 필수**: 카드 정보는 HTTPS를 통해서만 전송
4. **기본 결제 수단**: 최소 1개 유지 필요

---

## 🔗 다음 단계

1. [혜택 비교 모듈](./04_BENEFITS_GUIDE.md) - 결제 혜택 분석
2. [결제 기록 모듈](./06_PAYMENTS_GUIDE.md) - 결제 내역 조회
3. [PortOne 연동 가이드](./05_PORTONE_INTEGRATION_GUIDE.md) - 본인인증 및 빌링키

---

**작성자**: GitHub Copilot  
**최종 업데이트**: 2025-01-13  
**버전**: 1.0.0
