# 🔐 PASS 본인인증 (2차 인증) 구현 계획

## 📋 현재 상황 분석

### 1️⃣ 사용자가 원하는 것
- **NICE Pass 인증** (이미지의 UI)
- **휴대폰 앱 기반 인증** (사용자가 Pass/네이버/카카오 앱에서 인증)
- **2차 인증 시스템** (로그인 후 추가 인증)

### 2️⃣ 현재 구현 상태
❌ 내가 만든 것 = **OTP 기반 인증**
- 사용자가 이름, 생년월일, 휴대폰번호 입력
- 문자로 온 OTP 코드 입력
- 이것은 Pass 인증과 **다름**

✅ 좋은 소식 = **PortOne이 이미 지원함**
- PortOne은 NICE Pass 인증 지원
- API, SDK 모두 준비됨

---

## 🎯 Pass 인증 vs OTP 인증 비교

| 구분 | OTP 인증 (현재) | **Pass 인증 (원하는 것)** |
|------|-------------|-----------------|
| **방식** | SMS 기반 | 앱 기반 |
| **사용자 화면** | 입력폼 | Pass 팝업 |
| **지원 앱** | - | Pass, 네이버, 카카오, 토스 등 |
| **Flow** | Backend → SMS → OTP 입력 | Frontend → Pass 앱 선택 → 인증 |
| **데이터** | OTP 코드 | returnedIdentityId |

---

## 🔄 Pass 인증 플로우

### Frontend (React/Vue/Next.js)

```typescript
// 1. PortOne JS SDK 로드
<script src="https://cdn.portone.io/v2/browser.js"></script>

// 2. Pass 인증 요청
const handlePassAuthentication = async () => {
  const response = await PortOne.requestIdentity({
    storeId: "YOUR_STORE_ID",
    identityVerificationId: "unique_id_" + Date.now(),
    redirectUrl: `${window.location.origin}/auth/pass-callback`,
  });
  
  // 3. returnedIdentityId 획득
  if (response.code === "Success") {
    const returnedIdentityId = response.identityVerificationId;
    
    // 4. Backend로 전송
    await fetch("/api/identity-verifications/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        returnedIdentityId: returnedIdentityId,
      }),
    });
  }
};
```

### Backend (NestJS)

```typescript
// 1. Frontend에서 returnedIdentityId 수신
@Post('verify')
@UseGuards(JwtAuthGuard)
async verifyIdentity(
  @Body() dto: VerifyIdentityDto,
  @Request() req,
) {
  const userUuid = req.user.uuid;
  
  // 2. PortOne API로 검증
  const result = await this.portoneService.verifyIdentity({
    returnedIdentityId: dto.returnedIdentityId,
  });
  
  // 3. 결과 저장
  // - CI (Crypt Index): 개인 고유 식별자
  // - DI (Decrypt Index): 중복 가입 확인용
  // - name, phone, birthDate 등
  
  // 4. DB 저장 및 사용자 상태 업데이트
  await this.prisma.identity_verifications.create({
    data: {
      user_uuid: userUuid,
      returned_identity_id: dto.returnedIdentityId,
      ci: result.ci,
      di: result.di,
      name: result.name,
      phone: result.phone,
      birth_date: result.birthDate,
      status: 'VERIFIED',
      verified_at: new Date(),
    },
  });
  
  return { message: "인증 완료", status: "VERIFIED" };
}
```

---

## 📊 2차 인증 시스템 아키텍처

### 인증 단계

```
1️⃣ 회원가입 / 로그인
        ↓
2️⃣ JWT 토큰 발급
        ↓
3️⃣ Pass 인증 (2차)
        ↓
4️⃣ 권한 업그레이드
        ↓
5️⃣ 민감한 작업 허용 (결제, 개인정보 조회 등)
```

### 데이터베이스 스키마

```sql
-- 기존 테이블에 추가할 컬럼
ALTER TABLE identity_verifications ADD COLUMN (
  returned_identity_id VARCHAR(255),      -- PortOne 검증 ID
  ci VARCHAR(255),                         -- 개인 고유 식별자
  di VARCHAR(255),                         -- 중복가입 확인용
  verified_at TIMESTAMP,                   -- 인증 완료 시간
  phone_verified BOOLEAN DEFAULT FALSE     -- 휴대폰 인증 여부
);

-- 사용자 테이블에 추가할 컬럼
ALTER TABLE users ADD COLUMN (
  is_verified BOOLEAN DEFAULT FALSE,       -- Pass 인증 완료 여부
  verified_phone VARCHAR(20),              -- 인증된 휴대폰 번호
  ci VARCHAR(255) UNIQUE                   -- 중복 가입 방지
);
```

---

## 🔧 구현 체크리스트

### Phase 1: Backend 준비 (1-2시간)
- [ ] PortOne .env 설정 확인
  - `PORTONE_API_KEY`
  - `PORTONE_API_SECRET`
  - `PORTONE_STORE_ID`
  
- [ ] 새로운 엔드포인트 추가
  ```
  POST /identity-verifications/verify
  GET  /identity-verifications/my-verified
  DELETE /identity-verifications/{id}
  ```

- [ ] DTO 업데이트
  - `VerifyIdentityDto` - returnedIdentityId 필수
  - `IdentityVerificationResponseDto` - CI/DI/verified_at 추가

- [ ] PortOne Service 업데이트
  ```typescript
  async verifyIdentity(returnedIdentityId: string)
  ```

### Phase 2: Frontend 연동 가이드 (1시간)
- [ ] PortOne SDK 설치 문서
- [ ] Pass 인증 버튼 UI 예시
- [ ] 응답 처리 예시 코드

### Phase 3: 테스트 및 배포 (1-2시간)
- [ ] Postman 테스트 시나리오
- [ ] Swagger 문서 업데이트
- [ ] 에러 케이스 처리

---

## 📌 필수 정보

### PortOne API 키 확인 (현재 .env에서)
```
PORTONE_API_KEY=store-71e1de45-a1d4-4146-81b9-a7681bcc06b4
PORTONE_API_SECRET=store-71e1de45-a1d4-4146-81b9-a7681bcc06b4
PORTONE_STORE_ID=??? (필요시 추가)
```

### PortOne 관련 링크
- 📖 PortOne 개발자 센터: https://developers.portone.io/
- 📖 본인인증 연동: https://developers.portone.io/opi/ko/extra/identity-verification
- 📖 Identity Verification API: https://developers.portone.io/api/rest-v2/identity-verification

---

## 💡 예상 질문

### Q1. Pass 인증 vs OTP 중 뭐가 더 안전해?
**A:** Pass가 더 안전합니다.
- Pass는 사용자가 직접 휴대폰에서 인증
- OTP는 문자로 전송되므로 문자 탈취 위험
- Pass는 생체인증(지문, 얼굴) 지원

### Q2. Pass 인증 비용이 얼마나?
**A:** PortOne을 통해 진행하면 거래당 청구 (보통 200~500원)

### Q3. 기존 OTP 구현은 버릴거야?
**A:** 옵션1) 완전히 교체 / 옵션2) 두 가지 다 지원 (선택사항)

### Q4. Frontend 작업은 누가 하나?
**A:** 나(Backend)는 API 제공만 / Frontend는 PortOne SDK 연동

---

## 🚀 다음 단계

1. **PortOne 문서 검토** - returnedIdentityId 검증 방법 확인
2. **Backend API 설계** - 새로운 엔드포인트 정의
3. **Frontend 연동 가이드** - JavaScript/TypeScript 예시 코드 작성
4. **테스트** - PortOne Sandbox 환경에서 테스트

이게 맞는 방향일까요? 시작할 준비가 되셨나요? 🚀
