# 사용자 정보 모듈 (USERS) - FE 연동 가이드

## 📌 개요

사용자 프로필 및 개인 정보 관리를 담당하는 모듈입니다.

**책임**:
- 사용자 프로필 조회 및 수정
- 사용자 정보 삭제
- 사용자 통계 및 메타데이터 관리

---

## 🔐 API 엔드포인트

### 1. 현재 사용자 정보 조회

```http
GET /users/me
Authorization: Bearer {access_token}

Response 200 OK:
{
  "seq": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "홍길동",
  "social_provider": "NONE",
  "social_id": null,
  "preferred_payment_seq": 5,
  "created_at": "2025-01-10T09:30:00Z",
  "updated_at": "2025-01-13T14:20:00Z"
}
```

**응답 필드**:
| 필드 | 타입 | 설명 |
|------|------|------|
| seq | number | 내부 ID (DB에서만 사용) |
| uuid | string | 사용자 고유 ID (외부에서 사용) |
| email | string | 이메일 주소 |
| name | string | 사용자 이름 |
| social_provider | string | 소셜 제공자 (NONE, GOOGLE, KAKAO, NAVER) |
| social_id | string | 소셜 제공자 ID |
| preferred_payment_seq | number | 기본 결제 수단 ID |
| created_at | ISO string | 계정 생성 시간 |
| updated_at | ISO string | 마지막 수정 시간 |

---

### 2. 사용자 정보 수정

```http
PATCH /users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "새로운 이름",
  "email": "newemail@example.com"
}

Response 200 OK:
{
  "message": "사용자 정보가 수정되었습니다.",
  "user": {
    "seq": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newemail@example.com",
    "name": "새로운 이름",
    "updated_at": "2025-01-13T14:25:00Z"
  }
}
```

**요청 파라미터**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | X | 새로운 이름 (1-100자) |
| email | string | X | 새로운 이메일 (유니크 검증) |

**에러 응답**:
```json
{
  "statusCode": 409,
  "message": "이미 사용 중인 이메일입니다.",
  "error": "ConflictException"
}
```

---

### 3. 사용자 계정 삭제

```http
DELETE /users/me
Authorization: Bearer {access_token}

Response 200 OK:
{
  "message": "계정이 삭제되었습니다."
}
```

⚠️ **주의**: 이 작업은 돌이킬 수 없습니다.

---

## 💻 프론트엔드 구현 예제

### 1. React - 사용자 정보 조회

```typescript
import { useEffect, useState } from 'react';
import apiClient from './apiClient'; // 이전에 설정한 axios 인스턴스

interface User {
  seq: number;
  uuid: string;
  email: string;
  name: string;
  social_provider: string;
  created_at: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await apiClient.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>이메일: {user.email}</p>
      <p>가입 방식: {user.social_provider}</p>
      <p>가입일: {new Date(user.created_at).toLocaleDateString('ko-KR')}</p>
    </div>
  );
}

export default UserProfile;
```

### 2. React - 사용자 정보 수정

```typescript
import { useState } from 'react';
import apiClient from './apiClient';

interface EditForm {
  name: string;
  email: string;
}

function EditProfile() {
  const [form, setForm] = useState<EditForm>({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch('/users/me', {
        name: form.name || undefined,
        email: form.email || undefined,
      });

      alert('정보가 수정되었습니다.');
      console.log('수정된 사용자:', response.data.user);

      // 로컬 상태 업데이트
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, ...response.data.user })
      );
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('이미 사용 중인 이메일입니다.');
      } else {
        setError('정보 수정에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label htmlFor="name">이름:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="새로운 이름"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">이메일:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="새로운 이메일"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </button>
    </form>
  );
}

export default EditProfile;
```

### 3. React - 계정 삭제

```typescript
function DeleteAccount() {
  const handleDelete = async () => {
    // 사용자 확인
    const confirmed = window.confirm(
      '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    );

    if (!confirmed) return;

    try {
      await apiClient.delete('/users/me');

      alert('계정이 삭제되었습니다.');

      // 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // 로그인 페이지로 이동
      window.location.href = '/login';
    } catch (error) {
      alert('계정 삭제에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="danger-zone">
      <h3>위험 영역</h3>
      <button 
        onClick={handleDelete} 
        className="delete-button"
        style={{ backgroundColor: '#dc3545', color: 'white' }}
      >
        계정 삭제
      </button>
    </div>
  );
}

export default DeleteAccount;
```

### 4. React Context를 이용한 사용자 상태 관리

```typescript
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from './apiClient';

interface User {
  seq: number;
  uuid: string;
  email: string;
  name: string;
  social_provider: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드: 저장된 사용자 정보 복구
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('사용자 정보 복구 실패:', error);
      }
    }
    setLoading(false);
  }, []);

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await apiClient.patch('/users/me', data);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
```

### 5. TypeScript 타입 정의

```typescript
// types/user.ts

export interface User {
  seq: number;
  uuid: string;
  email: string;
  name: string;
  social_provider: 'NONE' | 'GOOGLE' | 'KAKAO' | 'NAVER';
  social_id: string | null;
  preferred_payment_seq: number | null;
  created_at: string;
  updated_at: string;
}

export interface EditUserRequest {
  name?: string;
  email?: string;
}

export interface UserResponse {
  message: string;
  user: User;
}

export interface DeleteResponse {
  message: string;
}
```

---

## 🔍 요청 시 필수 사항

### 인증

모든 엔드포인트는 JWT 토큰 필요:

```http
Authorization: Bearer {access_token}
```

### 에러 처리

| 상태 코드 | 상황 | 대응 |
|---------|------|------|
| 401 | 토큰 만료 | 로그인 페이지로 이동 |
| 404 | 사용자를 찾을 수 없음 | 오류 메시지 표시 |
| 409 | 이메일 중복 | 다른 이메일 사용 요청 |

---

## 📊 데이터 모델

### User 테이블

```sql
CREATE TABLE users (
  seq BIGSERIAL PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,           -- 외부 ID
  email VARCHAR(100) UNIQUE,                  -- 이메일 기반 로그인
  password_hash VARCHAR(255),                 -- 암호화된 비밀번호
  social_provider VARCHAR(20) DEFAULT 'NONE', -- GOOGLE, KAKAO, NAVER
  social_id VARCHAR(100),                     -- 소셜 제공자 ID
  name VARCHAR(100),                          -- 사용자 이름
  preferred_payment_seq BIGINT,               -- 기본 결제 수단
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 구현 체크리스트

- [ ] 사용자 정보 조회 API 통합
- [ ] 정보 수정 폼 구현
- [ ] Context 또는 Redux를 이용한 상태 관리
- [ ] 에러 처리 및 사용자 피드백
- [ ] 계정 삭제 확인 다이얼로그
- [ ] 로컬스토리지에 사용자 정보 캐싱

---

## 💡 팁 & 트릭

### 1. 사용자 정보 캐싱

```typescript
// 초기 로드 시 저장된 정보 사용
const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
setUser(cachedUser);

// 백그라운드에서 서버에서 최신 정보 fetch
apiClient.get('/users/me').then(res => {
  localStorage.setItem('user', JSON.stringify(res.data));
  setUser(res.data);
});
```

### 2. 프로필 사진 (향후 추가 예정)

```typescript
// 추후 구현 예정
interface User {
  // ... 기존 필드
  profile_image_url?: string;
}
```

### 3. 소셜 제공자 표시

```typescript
const getSocialProviderLabel = (provider: string) => {
  const labels: Record<string, string> = {
    'NONE': '이메일',
    'GOOGLE': 'Google',
    'KAKAO': 'Kakao',
    'NAVER': 'Naver',
  };
  return labels[provider] || '알 수 없음';
};
```

---

## ⚠️ 주의사항

1. **이메일 변경**: 새 이메일은 검증 필요 (향후 추가 예정)
2. **비밀번호 변경**: 현재 구현되지 않음 (향후 추가)
3. **계정 삭제**: 모든 관련 데이터 삭제됨 (복구 불가)

---

## 🔗 다음 단계

1. [결제 수단 모듈](./03_PAYMENT_METHODS_GUIDE.md) - 카드 등록 및 관리
2. [혜택 비교 모듈](./04_BENEFITS_GUIDE.md) - 결제 혜택 분석
3. [PortOne 연동 가이드](./05_PORTONE_INTEGRATION_GUIDE.md) - 본인인증 및 빌링키

---

**작성자**: GitHub Copilot  
**최종 업데이트**: 2025-01-13  
**버전**: 1.0.0
