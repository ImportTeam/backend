# FE 백엔드 통합 가이드 - 종합 문서

## 📚 문서 구조 (SRP 원칙 준수)

각 모듈은 단일 책임을 가지도록 분리되었습니다:

### 1. **인증 모듈** (`01_AUTH_INTEGRATION_GUIDE.md`)
책임: 사용자 인증 및 세션 관리
- 이메일 회원가입/로그인
- 소셜 로그인 (Google, Kakao, Naver)
- JWT 토큰 관리

### 2. **사용자 정보 모듈** (`02_USERS_INTEGRATION_GUIDE.md`)
책임: 사용자 프로필 관리
- 사용자 정보 조회
- 사용자 정보 수정
- 계정 삭제

### 3. **결제 수단 모듈** (`03_PAYMENT_METHODS_GUIDE.md`)
책임: 사용자 결제 수단 등록 및 관리
- 카드 등록
- 결제 수단 목록 조회
- 기본 결제 수단 설정
- 결제 수단 삭제

### 4. **혜택 비교 모듈** (`04_BENEFITS_GUIDE.md`)
책임: 최적의 결제 수단 추천
- 결제 수단별 혜택 비교
- TOP 3 추천
- HTML에서 혜택 정보 추출

### 5. **결제 기록 모듈** (`06_PAYMENTS_GUIDE.md`)
책임: 결제 거래 기록
- 결제 내역 기록
- 거래 정보 저장

---

## 🎯 일반적인 사용 흐름

### 플로우 1: 회원가입 및 로그인

```
1. 사용자가 이메일/비밀번호 입력
   ↓
2. POST /auth/email/register
   → 계정 생성
   ↓
3. 자동 로그인 또는 로그인 페이지로 이동
   ↓
4. POST /auth/email/login
   → JWT 토큰 받음
   ↓
5. localStorage에 토큰 저장
   ↓
6. 이후 모든 요청에 토큰 포함
```

**관련 문서**: [`01_AUTH_INTEGRATION_GUIDE.md`](./01_AUTH_INTEGRATION_GUIDE.md)

---

### 플로우 2: 결제 수단 등록

```
1. 사용자 정보 조회
  GET /users/current
   ↓
2. 결제 수단 등록
   POST /payment-methods
   ↓
3. 기본 결제 수단으로 설정 (선택사항)
   PATCH /payment-methods/{id}/set-primary
   ↓
4. 결제 수단 목록 조회
   GET /payment-methods
```

**관련 문서**: 
- [`02_USERS_INTEGRATION_GUIDE.md`](./02_USERS_INTEGRATION_GUIDE.md)
- [`03_PAYMENT_METHODS_GUIDE.md`](./03_PAYMENT_METHODS_GUIDE.md)

---

### 플로우 3: 혜택 분석 및 결제

```
1. 가맹점과 금액 입력
   ↓
2. 혜택 비교 조회
   GET /benefits/compare?userUuid=...&merchant=...&amount=...
   ↓
3. TOP 3 추천 받기
   GET /benefits/top3?userUuid=...&merchant=...&amount=...
   ↓
4. 최적 결제 수단 선택
   ↓
5. 결제 기록
   POST /payments/record
```

**관련 문서**:
- [`04_BENEFITS_GUIDE.md`](./04_BENEFITS_GUIDE.md)
- [`06_PAYMENTS_GUIDE.md`](./06_PAYMENTS_GUIDE.md)

---

## 🔑 API 기본 규칙

### 인증 (모든 보안 엔드포인트)

```http
Authorization: Bearer {access_token}
```

### 에러 응답 형식

```json
{
  "statusCode": 400,
  "message": "사용자 친화적 메시지",
  "error": "ExceptionType"
}
```

### 성공 응답 형식

```json
{
  "message": "작업 성공",
  "data": { /* 실제 데이터 */ }
}
```

또는

```json
{
  "count": 10,
  "data": [ /* 배열 데이터 */ ]
}
```

---

## 📱 프론트엔드 초기 설정

### 1. Axios 설정 (React)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 5000,
});

// 요청 인터셉터
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. 환경 변수 설정 (`.env`)

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_KAKAO_APP_KEY=your-kakao-app-key
REACT_APP_NAVER_CLIENT_ID=your-naver-client-id
```

### 3. Global State 관리 (Context API)

```typescript
import React, { createContext, useState, useContext } from 'react';

interface AppContextType {
  user: any;
  isAuthenticated: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  const [isAuthenticated, !!localStorage.getItem('accessToken')];

  const login = (userData: any, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
```

---

## 🗺️ 엔드포인트 맵

| 모듈 | HTTP 메서드 | 경로 | 인증 | 설명 |
|------|-----------|------|------|------|
| **AUTH** | POST | /auth/email/register | X | 이메일 회원가입 |
| | POST | /auth/email/login | X | 이메일 로그인 |
| | GET | /auth/google/login | X | Google 로그인 |
| | GET | /auth/kakao/login | X | Kakao 로그인 |
| | GET | /auth/naver/login | X | Naver 로그인 |
| **USERS** | GET | /users/current | O | 사용자 정보 조회 |
| | PATCH | /users/current | O | 사용자 정보 수정 |
| | DELETE | /users/current | O | 계정 삭제 |
| **PAYMENT METHODS** | POST | /payment-methods | O | 결제 수단 등록 |
| | GET | /payment-methods | O | 결제 수단 목록 |
| | GET | /payment-methods/{id} | O | 결제 수단 조회 |
| | PATCH | /payment-methods/{id} | O | 결제 수단 수정 |
| | PATCH | /payment-methods/{id}/set-primary | O | 기본 결제 수단 설정 |
| | DELETE | /payment-methods/{id} | O | 결제 수단 삭제 |
| | GET | /payment-methods/statistics | O | 결제 수단 통계 |
| **BENEFITS** | GET | /benefits/compare | X | 혜택 비교 |
| | GET | /benefits/top3 | X | TOP 3 추천 |
| | GET | /benefits/extract | X | HTML 혜택 추출 |
| | POST | /benefits/top3-from-html | X | HTML 기반 TOP3 |
| **PAYMENTS** | POST | /payments/record | X | 결제 기록 |
| **PAYMENT HISTORY** | GET | /payments/history | O | 결제 이력 조회 |
| | GET | /payments/history/{id} | O | 결제 상세 조회 |
| | GET | /payments/statistics/overview | O | 결제 통계 |

---

## 🛠️ 개발 팁

### 1. API 테스트 (cURL)

```bash
# 회원가입
curl -X POST http://localhost:3000/auth/email/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "테스트 사용자"
  }'

# 로그인
curl -X POST http://localhost:3000/auth/email/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'

# 사용자 정보 조회
curl -X GET http://localhost:3000/users/current \
  -H "Authorization: Bearer {access_token}"
```

### 2. Postman 컬렉션 활용

[포스트맨 컬렉션 내보내기 예시]

모든 엔드포인트를 Postman에서 테스트하려면:
1. Postman > Import > Raw Text
2. 각 모듈 가이드의 cURL 요청 복사
3. 변수 설정 ({{baseUrl}}, {{token}})

### 3. 로깅 및 디버깅

```typescript
// API 호출 디버깅
apiClient.interceptors.request.use((config) => {
  console.log('📤 Request:', {
    method: config.method,
    url: config.url,
    data: config.data,
  });
  return config;
});

apiClient.interceptors.response.use((response) => {
  console.log('📥 Response:', {
    status: response.status,
    data: response.data,
  });
  return response;
});
```

---

## 📊 데이터 플로우 다이어그램

```
┌─────────────────────────────────────────────────┐
│            Frontend (React/Vue/Next.js)          │
│                                                   │
│  ┌───────────────────────────────────────────┐  │
│  │         Auth Module (01)                  │  │
│  │ - 회원가입, 로그인                        │  │
│  │ - 소셜 로그인                             │  │
│  │ - JWT 토큰 관리                           │  │
│  └───────────────────────────────────────────┘  │
│                      ↓                           │
│  ┌───────────────────────────────────────────┐  │
│  │         Users Module (02)                 │  │
│  │ - 프로필 관리                             │  │
│  │ - 사용자 정보 수정                        │  │
│  └───────────────────────────────────────────┘  │
│           ↙              ↓              ↘        │
│  ┌─────────────┐  ┌──────────┐                  │
│  │  Payment    │  │ Benefits │                  │
│  │  Methods    │  │ Comparison│                 │
│  │  Module (03)│  │ Module(04)│                 │
│  └─────────────┘  └──────────┘                  │
│           ↓              ↓                       │
│  ┌───────────────────────────────────────────┐  │
│  │         Payments Module (05)              │  │
│  │ - 결제 기록                               │  │
│  │ - 결제 내역                               │  │
│  └───────────────────────────────────────────┘  │
└──────────────────────┬────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │    Backend (NestJS)          │
        │                              │
        │  - Auth Service              │
        │  - Users Service             │
        │  - Payment Methods Service   │
        │  - Benefits Service          │
        │  - Payments Service          │
        │                              │
        └──────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │    Database (PostgreSQL)     │
        │                              │
        │  - users                     │
        │  - payment_methods           │
        │  - payment_transactions      │
        │                              │
        └──────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │    External Services         │
        │                              │
        │  - Google OAuth              │
        │  - Kakao OAuth               │
        │  - Naver OAuth               │
        │                              │
        └──────────────────────────────┘
```

---

## ✅ 프로젝트 시작 체크리스트

### 백엔드
- [ ] 모든 모듈 구현 완료
- [ ] API 테스트 완료
- [ ] 에러 처리 구현
- [ ] CORS 설정 완료

### 프론트엔드 
- [ ] Axios 설정
- [ ] 인증 Context 구현
- [ ] 각 모듈별 컴포넌트 작성
- [ ] 라우팅 설정
- [ ] 에러 핸들링

### 통합
- [ ] E2E 테스트
- [ ] 성능 최적화
- [ ] 보안 감수
- [ ] 배포 준비

---

## 🆘 일반적인 문제 해결

### 401 Unauthorized

**원인**: 토큰이 없거나 만료됨

**해결책**:
```typescript
// 토큰 확인
const token = localStorage.getItem('accessToken');
console.log('Token exists:', !!token);

// 토큰 갱신 필요
// - 로그아웃 후 재로그인
// - 또는 refresh token으로 갱신 (향후 구현)
```

### 409 Conflict

**원인**: 이미 존재하는 이메일 또는 중복 데이터

**해결책**:
```typescript
if (error.response?.status === 409) {
  alert('이미 사용 중인 정보입니다.');
  // 다른 값으로 재시도
}
```

### CORS 에러

**원인**: 프론트엔드 도메인이 허용되지 않음

**해결책**:
- 백엔드에서 CORS 설정 확인
- 프론트엔드 도메인 추가

```typescript
// 백엔드 (main.ts)
app.enableCors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
});
```

---

## 📞 지원

문제가 발생하면:
1. 해당 모듈 가이드 확인
2. API 레퍼런스 확인
3. Postman으로 API 테스트
4. 브라우저 개발자 도구 (Network 탭) 확인
5. 백엔드 로그 확인

---

## 🔄 버전 관리

| 버전 | 날짜 | 변경사항 |
|------|------|---------|
| 1.0.0 | 2025-01-13 | 초기 문서 작성 |

---

## 📚 추가 자료

- [NestJS 공식 문서](https://docs.nestjs.com)
- [React 공식 문서](https://react.dev)
- [Prisma ORM](https://www.prisma.io/docs)

---

**작성자**: GitHub Copilot  
**최종 업데이트**: 2025-01-13  
**라이선스**: MIT

---

## 문서 인덱스

| 문서 | 링크 | 책임 |
|------|------|------|
| 인증 모듈 | [`01_AUTH_INTEGRATION_GUIDE.md`](./01_AUTH_INTEGRATION_GUIDE.md) | 사용자 인증 |
| 사용자 정보 | [`02_USERS_INTEGRATION_GUIDE.md`](./02_USERS_INTEGRATION_GUIDE.md) | 프로필 관리 |
| 결제 수단 | [`03_PAYMENT_METHODS_GUIDE.md`](./03_PAYMENT_METHODS_GUIDE.md) | 카드 관리 |
| 혜택 비교 | [`04_BENEFITS_GUIDE.md`](./04_BENEFITS_GUIDE.md) | 혜택 분석 |
| 결제 기록 | [`06_PAYMENTS_GUIDE.md`](./06_PAYMENTS_GUIDE.md) | 거래 기록 |

---

**다음은 각 모듈별 가이드를 읽으시고 구현을 시작하세요!**
