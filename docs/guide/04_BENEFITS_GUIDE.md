# 혜택 비교 모듈 (BENEFITS) - FE 연동 가이드

## 📌 개요

사용자의 결제 수단과 가맹점 정보를 기반으로 최적의 결제 방법을 추천하는 모듈입니다. 할인율, 캐시백, 포인트 등을 비교 분석합니다.

**책임**:
- 결제 수단별 혜택 비교
- TOP 3 결제 수단 추천
- HTML 페이지에서 혜택 정보 추출
- 절약 금액 계산

---

## 🔐 API 엔드포인트

### 1. 결제 혜택 비교

```http
GET /benefits/compare?userUuid={uuid}&merchant={store_name}&amount={price}
Content-Type: application/json

Response 200 OK:
{
  "merchant": "카페 아메리",
  "amount": 5000,
  "user_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "comparison": [
    {
      "payment_method": {
        "seq": 5,
        "alias": "내 신용카드",
        "last_4_nums": "3456"
      },
      "benefit": {
        "type": "PERCENT",
        "value": 5,
        "description": "5% 할인"
      },
      "savings": 250
    },
    {
      "payment_method": {
        "seq": 4,
        "alias": "회사 카드",
        "last_4_nums": "7890"
      },
      "benefit": {
        "type": "FLAT",
        "value": 1000,
        "description": "1,000원 캐시백"
      },
      "savings": 1000
    }
  ]
}
```

**요청 파라미터**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| userUuid | string | O | 사용자 UUID |
| merchant | string | O | 가맹점 이름 (예: 카페 아메리) |
| amount | number | O | 결제 금액 (원) |

**응답 필드**:
| 필드 | 설명 |
|------|------|
| payment_method | 결제 수단 정보 |
| benefit | 혜택 정보 (type: PERCENT 또는 FLAT) |
| savings | 절약 금액 (원) |

---

### 2. TOP 3 결제 수단 추천

```http
GET /benefits/top3?userUuid={uuid}&merchant={store_name}&amount={price}
Content-Type: application/json

Response 200 OK:
{
  "merchant": "카페 아메리",
  "amount": 5000,
  "top3": [
    {
      "rank": 1,
      "payment_method": {
        "seq": 4,
        "alias": "회사 카드",
        "last_4_nums": "7890"
      },
      "benefit": {
        "type": "FLAT",
        "value": 1000,
        "description": "1,000원 캐시백"
      },
      "savings": 1000
    },
    {
      "rank": 2,
      "payment_method": {
        "seq": 5,
        "alias": "내 신용카드",
        "last_4_nums": "3456"
      },
      "benefit": {
        "type": "PERCENT",
        "value": 5,
        "description": "5% 할인"
      },
      "savings": 250
    },
    {
      "rank": 3,
      "payment_method": null,
      "benefit": {
        "type": "NONE",
        "value": 0,
        "description": "혜택 없음"
      },
      "savings": 0
    }
  ]
}
```

---

### 3. HTML에서 혜택 정보 추출

```http
GET /benefits/extract?sample={html_or_text}
Content-Type: application/json

Response 200 OK:
{
  "extracted_benefits": [
    {
      "type": "PERCENT",
      "value": 10,
      "description": "10% 할인"
    },
    {
      "type": "FLAT",
      "value": 5000,
      "description": "5,000원 캐시백"
    }
  ]
}
```

**요청 파라미터**:
| 파라미터 | 설명 |
|---------|------|
| sample | HTML 또는 텍스트 (URL 인코딩) |

---

### 4. HTML 페이지에서 TOP3 추천

```http
POST /benefits/top3-from-html
Content-Type: application/json

{
  "userUuid": "550e8400-e29b-41d4-a716-446655440000",
  "merchant": "카페 아메리",
  "amount": 5000,
  "html": "<div>10% 할인</div>"
}

Response 200 OK:
{
  "merchant": "카페 아메리",
  "amount": 5000,
  "extracted_from_html": [
    {
      "type": "PERCENT",
      "value": 10,
      "description": "10% 할인"
    }
  ],
  "top3": [
    {
      "rank": 1,
      "source": "page_benefit",
      "benefit": {
        "type": "PERCENT",
        "value": 10,
        "description": "10% 할인"
      },
      "savings": 500
    },
    {
      "rank": 2,
      "source": "user_card",
      "payment_method": {
        "seq": 4,
        "alias": "회사 카드",
        "last_4_nums": "7890"
      },
      "benefit": {
        "type": "FLAT",
        "value": 1000,
        "description": "1,000원 캐시백"
      },
      "savings": 1000
    }
  ]
}
```

---

## 💻 프론트엔드 구현 예제

### 1. React - 혜택 비교

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

interface ComparisonResult {
  merchant: string;
  amount: number;
  comparison: Array<{
    payment_method: { seq: number; alias: string; last_4_nums: string };
    benefit: { type: string; value: number; description: string };
    savings: number;
  }>;
}

function BenefitComparison() {
  const [userUuid, setUserUuid] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!userUuid || !merchant || !amount) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get('/benefits/compare', {
        params: {
          userUuid,
          merchant,
          amount: parseInt(amount),
        },
      });
      setResult(response.data);
    } catch (error) {
      alert('혜택 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="benefit-comparison">
      <div className="input-section">
        <input
          type="text"
          placeholder="사용자 UUID"
          value={userUuid}
          onChange={(e) => setUserUuid(e.target.value)}
        />
        <input
          type="text"
          placeholder="가맹점 (예: 카페 아메리)"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />
        <input
          type="number"
          placeholder="금액"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleCompare} disabled={loading}>
          {loading ? '조회 중...' : '혜택 비교'}
        </button>
      </div>

      {result && (
        <div className="results">
          <h3>{result.merchant} - {result.amount.toLocaleString()}원</h3>
          <table>
            <thead>
              <tr>
                <th>결제 수단</th>
                <th>혜택</th>
                <th>절약 금액</th>
              </tr>
            </thead>
            <tbody>
              {result.comparison.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{item.payment_method.alias}</strong>
                    <br />
                    <small>****{item.payment_method.last_4_nums}</small>
                  </td>
                  <td>{item.benefit.description}</td>
                  <td className="savings">
                    <strong>-{item.savings.toLocaleString()}원</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BenefitComparison;
```

### 2. React - TOP 3 추천

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

function BenefitTop3() {
  const [userUuid, setUserUuid] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [top3, setTop3] = useState<any[]>([]);

  const handleGetTop3 = async () => {
    if (!userUuid || !merchant || !amount) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await apiClient.get('/benefits/top3', {
        params: {
          userUuid,
          merchant,
          amount: parseInt(amount),
        },
      });
      setTop3(response.data.top3);
    } catch (error) {
      alert('추천 조회 실패');
    }
  };

  return (
    <div className="benefit-top3">
      <div className="input-section">
        <input
          type="text"
          placeholder="사용자 UUID"
          value={userUuid}
          onChange={(e) => setUserUuid(e.target.value)}
        />
        <input
          type="text"
          placeholder="가맹점"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />
        <input
          type="number"
          placeholder="금액"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleGetTop3}>TOP 3 추천</button>
      </div>

      {top3.length > 0 && (
        <div className="top3-results">
          {top3.map((item, idx) => (
            <div key={idx} className={`rank-${item.rank}`}>
              <div className="rank-badge">#{item.rank}</div>
              <div className="card-info">
                {item.payment_method ? (
                  <>
                    <h3>{item.payment_method.alias}</h3>
                    <p>****{item.payment_method.last_4_nums}</p>
                  </>
                ) : (
                  <h3>혜택 없음</h3>
                )}
              </div>
              <div className="benefit-info">
                <p className="description">{item.benefit.description}</p>
                <p className="savings">
                  절약: <strong>{item.savings.toLocaleString()}원</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BenefitTop3;
```

### 3. React - 웹 페이지 혜택 추출 (Chrome Extension)

```typescript
// 확장 프로그램에서 실행될 코드

async function extractAndRecommend(merchant: string, amount: number, userUuid: string) {
  // 현재 페이지의 HTML 가져오기
  const pageHTML = document.documentElement.innerHTML;

  try {
    const response = await fetch('http://localhost:3000/benefits/top3-from-html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userUuid,
        merchant,
        amount,
        html: pageHTML,
      }),
    });

    const result = await response.json();
    console.log('추천 결과:', result.top3);

    // UI에 결과 표시
    displayRecommendation(result.top3);
  } catch (error) {
    console.error('추천 조회 실패:', error);
  }
}

function displayRecommendation(top3: any[]) {
  const div = document.createElement('div');
  div.id = 'benefit-recommendation';
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 2px solid #007bff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 10000;
    max-width: 300px;
  `;

  div.innerHTML = `
    <h3 style="margin: 0 0 12px 0;">최고 할인</h3>
    ${top3[0]?.payment_method ? `
      <p><strong>${top3[0].payment_method.alias}</strong></p>
      <p>절약: <strong style="color: #28a745;">${top3[0].savings.toLocaleString()}원</strong></p>
    ` : '<p>혜택 없음</p>'}
  `;

  document.body.appendChild(div);
}
```

---

## 📊 혜택 데이터 구조

### Benefit 객체

```typescript
interface Benefit {
  type: 'PERCENT' | 'FLAT' | 'NONE';  // 할인 타입
  value: number;                      // 할인율(%) 또는 금액(원)
  description: string;                // 사용자 표시용 텍스트
}
```

### 계산 로직

```typescript
// PERCENT 타입: 절약 금액 = 결제 금액 × (할인율 / 100)
const savingsPercent = amount * (benefit.value / 100);

// FLAT 타입: 절약 금액 = 할인 금액 (최대 결제 금액)
const savingsFlat = Math.min(benefit.value, amount);
```

---

## 🚀 구현 체크리스트

- [ ] 혜택 비교 API 통합
- [ ] TOP 3 추천 API 통합
- [ ] 절약 금액 계산 및 표시
- [ ] 가맹점 입력 필드
- [ ] 금액 입력 필드
- [ ] 추천 결과 UI 구성
- [ ] 웹 페이지 혜택 추출 (선택사항)

---

## 💡 팁 & 트릭

### 1. 절약 금액 포맷팅

```typescript
const formatSavings = (savings: number) => {
  if (savings === 0) return '혜택 없음';
  return `${savings.toLocaleString()}원 절약`;
};
```

### 2. 추천 카드 강조

```typescript
const getRecommendationStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return { borderColor: '#FFD700', backgroundColor: '#FFFACD' }; // 금색
    case 2:
      return { borderColor: '#C0C0C0', backgroundColor: '#F5F5F5' }; // 은색
    case 3:
      return { borderColor: '#CD7F32', backgroundColor: '#FFF8DC' }; // 동색
    default:
      return {};
  }
};
```

### 3. 혜택 아이콘 표시

```typescript
const getBenefitIcon = (type: string) => {
  const icons: Record<string, string> = {
    PERCENT: '📊',
    FLAT: '💰',
    NONE: '❌',
  };
  return icons[type] || '❓';
};
```

---

## ⚠️ 주의사항

1. **혜택 정보 정확성**: 가맹점 정보와 혜택 정보는 주기적으로 업데이트 필요
2. **중복 혜택**: 여러 혜택이 있을 경우 최대 절약 금액만 선택
3. **실시간 업데이트**: 혜택 정보는 변할 수 있으므로 최신 데이터 확인 필수

---

## 🔗 다음 단계

1. [결제 기록 모듈](./06_PAYMENTS_GUIDE.md) - 결제 내역 조회
2. [PortOne 연동 가이드](./05_PORTONE_INTEGRATION_GUIDE.md) - 본인인증 및 빌링키

---

**작성자**: GitHub Copilot  
**최종 업데이트**: 2025-01-13  
**버전**: 1.0.0
