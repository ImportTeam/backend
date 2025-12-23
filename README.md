\# PicSel Backend

PicSel 결제 추천 서비스 백엔드 (NestJS + Prisma).

## 빠른 링크

- API Prefix: `/api` (예: `/api/health`)
- Swagger UI: `/swagger`
- Health Check: `GET /api/health`

## 기술 스택

- Node.js + TypeScript
- NestJS
- Prisma (MySQL)
- Swagger (OpenAPI)
- Jest / Vitest

## 로컬 실행 (Quick Start)

### 1) 의존성 설치

```bash
pnpm install
```

### 2) 환경변수 설정

루트에 `.env` 파일을 생성하고 아래 변수를 설정합니다. 이 프로젝트는 [src/config/env.validation.ts](src/config/env.validation.ts)에서 환경변수를 강하게 검증합니다.

필수(누락 시 부팅 실패):

```bash
NODE_ENV=development

DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"

JWT_SECRET="your-jwt-secret"
ENCRYPTION_KEY="your-encryption-key"

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
KAKAO_CLIENT_ID="..."
KAKAO_CLIENT_SECRET="..."
NAVER_CLIENT_ID="..."
NAVER_CLIENT_SECRET="..."

GEMINI_API_KEY="..."
GEMINI_MODEL="" # optional
```

선택(환경/배포에 따라 유용):

```bash
PORT=3000

# OAuth Redirect (옵션)
GOOGLE_REDIRECT_DEV_URI=""
GOOGLE_REDIRECT_PROD_URI=""
KAKAO_REDIRECT_DEV_URI=""
KAKAO_REDIRECT_PROD_URI=""
NAVER_REDIRECT_DEV_URI=""
NAVER_REDIRECT_PROD_URI=""

# CORS
CORS_ORIGINS="https://example.com,http://localhost:5173"
FRONTEND_URL="https://example.com" # CORS_ORIGINS 미설정 시 대체
CORS_ALLOW_LOCALHOST=false
CORS_ALLOW_PICSEL_SUBDOMAINS=true

# Logging
LOG_LEVEL=info

# 개발 환경 자동 시드(옵션)
AUTO_DB_SEED=true
REQUIRE_DB_SEED=false
AUTO_DB_SEED_RETRIES=5
AUTO_DB_SEED_RETRY_DELAY_MS=1500
```

### 3) DB 준비 (Prisma)

MySQL을 준비한 뒤 아래 중 하나를 사용합니다.

```bash
# 마이그레이션 적용(개발용)
pnpm db:migrate

# 클라이언트 생성
pnpm db:generate

# 시드 실행
pnpm db:seed
```

### 4) 서버 실행

```bash
# 개발(Watch)
pnpm dev

# 빌드
pnpm build

# 프로덕션 실행(빌드 산출물 기준)
pnpm start
```

실행 후:

- Swagger: `http://localhost:3000/swagger`
- Health: `http://localhost:3000/api/health`

## 주요 명령어

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check

pnpm test
pnpm test:e2e
pnpm test:cov

pnpm test:vitest
pnpm test:vitest:watch
pnpm test:vitest:cov
```

## API 확인 방법

엔드포인트 상세 스펙/요청·응답 예제는 Swagger UI(`/swagger`)를 기준으로 확인합니다.

- 인증/사용자: [docs/guide/01_AUTH_INTEGRATION_GUIDE.md](docs/guide/01_AUTH_INTEGRATION_GUIDE.md), [docs/guide/02_USERS_INTEGRATION_GUIDE.md](docs/guide/02_USERS_INTEGRATION_GUIDE.md)
- 결제수단: [docs/guide/03_PAYMENT_METHODS_GUIDE.md](docs/guide/03_PAYMENT_METHODS_GUIDE.md)
- 혜택 비교: [docs/guide/04_BENEFITS_GUIDE.md](docs/guide/04_BENEFITS_GUIDE.md)
- 결제 내역: [docs/guide/06_PAYMENTS_GUIDE.md](docs/guide/06_PAYMENTS_GUIDE.md)
- Swagger 사용 가이드: [docs/guide/SWAGGER/SWAGGER_DOCUMENTATION_GUIDE.md](docs/guide/SWAGGER/SWAGGER_DOCUMENTATION_GUIDE.md)

## 배포 (AWS EC2, no Docker)

이 레포는 GitHub Actions에서 EC2에 SSH 접속 후 서버에서 `run.sh`를 실행하는 방식의 무도커 배포를 사용합니다.

- Workflow: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- Deploy script: [run.sh](run.sh)

필수 GitHub Secrets (워크플로 기준):

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_PASSWORD`

EC2 준비 사항(예시):

- 코드 위치: `/home/ec2-user/app/picsel-backend`
- `pnpm` 설치
- `pm2` 설치 및 권한 설정
- 런타임 환경변수 `.env` 배치(서버 내에서 관리, Git 커밋 금지)

## Docker

Dockerfile이 포함되어 있습니다.

```bash
docker build -t picsel-backend .
docker run --rm -p 3000:3000 --env-file .env picsel-backend
```

## 디렉토리 구조

```text
src/
  auth/                 인증/소셜 로그인
  users/                사용자/마이페이지
  payment-methods/      결제수단
  payments/             결제/기록
  benefits/             혜택 비교/추출
  dashboard/            대시보드 통계
  analytics/            소비 분석
  admin/                관리자/디버그용 API
  crawler/              외부 데이터 수집/크롤러
  external/             외부 연동(예: AI 추천, Popbill 등)
  common/               공통 유틸/가드/필터/로거/Swagger DTO
  prisma/               Prisma 연동 서비스
prisma/
  schema.prisma         DB 스키마(MySQL)
  migrations/           마이그레이션
  seed.ts               시드 스크립트
docs/
  guide/                FE 연동/Swagger 가이드
  db-migration/         DB 마이그레이션 문서
test/                   e2e 및 테스트 설정
```

<!-- ## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
npm install -g @nestjs/mau
mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE). -->
<!-- markdownlint-enable -->
