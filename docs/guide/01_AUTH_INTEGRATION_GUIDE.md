# 인증 모듈 (AUTH) - FE 연동 가이드

## 📌 개요

사용자 인증 및 세션 관리를 담당하는 모듈입니다. 이메일 기반 인증과 소셜 로그인(Google, Kakao, Naver)을 지원합니다.

**책임**:
- 사용자 회원가입 및 로그인
- 소셜 로그인 처리 (OAuth 2.0)
- JWT 토큰 생성 및 검증
- 세션 관리

---

## 🔐 기본 개념

### 인증 흐름

```
Frontend
   ↓ 이메일/비밀번호 또는 소셜 로그인
BackendAuthController
   ↓
AuthService
   ├─ 사용자 확인
   ├─ JWT 토큰 생성
   └─ 세션 저장
   ↓
Frontend (토큰 저장)
```

### 토큰 정보

```typescript
// JWT 토큰에 포함된 정보
{
  sub: "user_uuid",      // 사용자 UUID
  email: "user@email.com",
  name: "사용자 이름",
  iat: 1234567890,       // 발급 시간
  exp: 1234571490        // 만료 시간 (1시간 후)
}
```

---

## 📡 API 엔드포인트

### 1. 이메일 회원가입

```http
POST /auth/email/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "홍길동"
}

Response 201 Created:
{
  "message": "User registered",
  "user": {
    "seq": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "홍길동",
    "social_provider": "NONE",
    "created_at": "2025-01-13T10:00:00Z"
  }
}
```

**요청 파라미터**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | O | 이메일 주소 (유니크) |
| password | string | O | 비밀번호 (8자 이상, 특수문자 포함) |
| name | string | O | 사용자 이름 |

**에러 응답**:
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "ConflictException"
}
```

---

### 2. 이메일 로그인

```http
POST /auth/email/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response 200 OK:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "seq": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

**요청 파라미터**:
| 필드 | 타입 | 필수 |
|------|------|------|
| email | string | O |
| password | string | O |

**에러 응답**:
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "UnauthorizedException"
}
```

---

### 3. 소셜 로그인 - Google

#### Step 1: 로그인 페이지로 이동

```http
GET /auth/google/login

// 자동으로 Google OAuth 페이지로 리다이렉트됨
```

#### Step 2: 콜백 처리

```http
GET /auth/google/login/callback?code=...&state=...

Response (자동 리다이렉트):
http://frontend-domain/callback?token={access_token}&user={user_data}

// 또는 JSON 응답 (모바일 앱용)
POST /auth/google/login/callback
{
  "code": "..."
}

Response 200 OK:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "seq": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@gmail.com",
    "name": "Google User",
    "social_provider": "GOOGLE"
  }
}
```

---

### 4. 소셜 로그인 - Kakao

```http
GET /auth/kakao/login

// 자동으로 Kakao OAuth 페이지로 리다이렉트됨
```

**콜백 처리**:
```http
GET /auth/kakao/login/callback?code=...&state=...
POST /auth/kakao/login/callback
```

---

### 5. 소셜 로그인 - Naver

```http
GET /auth/naver/login

// 자동으로 Naver OAuth 페이지로 리다이렉트됨
```

**콜백 처리**:
```http
GET /auth/naver/login/callback?code=...&state=...
POST /auth/naver/login/callback
```

---

## 💻 프론트엔드 구현 예제

### 1. React - 이메일 회원가입

```typescript
import axios from 'axios';

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

async function signUp(data: SignUpData) {
  try {
    const response = await axios.post('/auth/email/register', {
      email: data.email,
      password: data.password,
      name: data.name,
    });
    
    console.log('회원가입 성공:', response.data.user);
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 409) {
      alert('이미 가입된 이메일입니다.');
    } else {
      alert('회원가입 실패');
    }
    throw error;
  }
}
```

### 2. React - 이메일 로그인

```typescript
async function login(email: string, password: string) {
  try {
    const response = await axios.post('/auth/email/login', {
      email,
      password,
    });
    
    // 토큰 저장
    localStorage.setItem('accessToken', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // API 기본 헤더 설정
    axios.defaults.headers.common['Authorization'] = 
      `Bearer ${response.data.access_token}`;
    
    return response.data.user;
  } catch (error) {
    alert('로그인 실패: ' + error.response?.data?.message);
    throw error;
  }
}
```

### 3. React - Google 로그인 (웹)

```typescript
// 1. Google 로그인 버튼 클릭
function handleGoogleLogin() {
  window.location.href = '/auth/google/login';
}

// 2. 콜백 페이지에서 토큰 처리
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const user = params.get('user');
  
  if (token) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', user);
    
    // 홈 페이지로 이동
    window.location.href = '/home';
  }
}, []);
```

### 4. React - 기본 설정 (모든 요청에 토큰 자동 포함)

```typescript
import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

// 요청 인터셉터: 모든 요청에 토큰 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 - 로그인 페이지로 이동
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 5. React - 로그아웃

```typescript
function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  
  // 인터셉터 헤더 제거
  delete axios.defaults.headers.common['Authorization'];
  
  // 로그인 페이지로 이동
  window.location.href = '/login';
}
```

---

## 🔍 요청 시 필수 사항

### 인증이 필요한 엔드포인트

모든 요청 헤더에 JWT 토큰 포함:

```http
Authorization: Bearer {access_token}

예시:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2NzM2MjAwMDAsImV4cCI6MTY3MzYyMzYwMH0...
```

### 에러 처리

| 상태 코드 | 상황 | 대응 |
|---------|------|------|
| 401 | 토큰 만료 또는 유효하지 않음 | 로그인 페이지로 리다이렉트 |
| 403 | 권한 없음 (다른 사용자 데이터 접근) | 접근 거부 메시지 표시 |
| 409 | 이미 존재하는 이메일 | 회원가입 실패 메시지 |

---

## 🚀 구현 체크리스트

### 회원가입 구현
- [ ] 이메일 검증 (이미 존재하는지 확인)
- [ ] 비밀번호 강도 검증 (프론트엔드에서도 검증)
- [ ] 회원가입 성공 후 자동 로그인 또는 로그인 페이지로 이동

### 로그인 구현
- [ ] 로그인 폼 구현
- [ ] 토큰 로컬스토리지에 저장
- [ ] API 요청 시 토큰 자동 포함 (인터셉터)
- [ ] 토큰 만료 처리 (401 에러)

### 소셜 로그인 구현
- [ ] Google OAuth 설정 완료
- [ ] Kakao OAuth 설정 완료
- [ ] Naver OAuth 설정 완료
- [ ] 콜백 URL 설정 완료

### 토큰 관리
- [ ] 토큰 저장 (localStorage 또는 sessionStorage)
- [ ] 토큰 만료 시간 확인
- [ ] 로그아웃 시 토큰 제거

---

## ⚠️ 주의사항

### 보안

1. **토큰 저장**: localStorage 사용 시 XSS 공격 취약
   - 대안: HttpOnly 쿠키 사용 (더 안전)

2. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 필수

3. **CORS 설정**: 프론트엔드 도메인을 명확히 설정

### 성능

1. **토큰 갱신**: 토큰 만료 전에 갱신 (구현 예정)
2. **캐싱**: 사용자 정보는 로컬에 캐싱하여 불필요한 요청 감소
3. **타임아웃**: 장시간 활동 없으면 자동 로그아웃

---

## 📚 관련 개념

### JWT (JSON Web Token)
- 자가 수용적 토큰 (서버에서 상태 저장 불필요)
- Header.Payload.Signature 구조
- 각 부분은 Base64로 인코딩됨

### OAuth 2.0
- 표준 권한 위임 프로토콜
- 사용자가 직접 비밀번호를 입력하지 않음
- Authorization Code 플로우 사용

### 세션 vs 토큰
| 항목 | 세션 | 토큰 |
|------|------|------|
| 저장소 | 서버 (메모리/DB) | 클라이언트 |
| 확장성 | 낮음 | 높음 |
| 보안 | 더 안전 | 토큰 탈취 위험 |

---

## 🔗 다음 단계

1. [사용자 정보 모듈](./02_USERS_INTEGRATION_GUIDE.md) - 사용자 프로필 관리
2. [결제 수단 모듈](./03_PAYMENT_METHODS_GUIDE.md) - 카드 등록 및 관리
3. [혜택 비교 모듈](./04_BENEFITS_GUIDE.md) - 결제 혜택 분석

---

**작성자**: GitHub Copilot  
**최종 업데이트**: 2025-01-13  
**버전**: 1.0.0
