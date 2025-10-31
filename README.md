# PicSel Backend

## PicSel 인증 API

모든 엔드포인트는 기본 prefix `/api`가 붙습니다. 예: `/api/auth/...`

- Email
  - POST `/api/auth/email/login` — 이메일/비밀번호 로그인
  - POST `/api/auth/email/register` — 이메일 회원가입
  - POST `/api/auth/email/verify/:token` — 이메일 인증(2차) 토큰 검증
  - DELETE `/api/auth/email/delete/:userId` — 사용자 삭제 (uuid 또는 seq)
- Google
  - GET `/api/auth/google` — Google 로그인 시작 (리다이렉트)
  - GET `/api/auth/google/callback` — Google 콜백
  - POST `/api/auth/google/login` — 명세 호환용 POST 별칭
  - POST `/api/auth/google/login/callback` — 명세 호환용 POST 콜백 별칭
  - DELETE `/api/auth/google/delete/:userId` — 사용자 삭제
- Kakao
  - GET `/api/auth/kakao` — Kakao 로그인 시작 (리다이렉트)
  - GET `/api/auth/kakao/callback` — Kakao 콜백
  - POST `/api/auth/kakao/login` — 명세 호환용 POST 별칭
  - POST `/api/auth/kakao/login/callback` — 명세 호환용 POST 콜백 별칭
  - DELETE `/api/auth/kakao/delete/:userId` — 사용자 삭제

상세 스펙과 테스트는 Swagger UI(`/swagger`)에서 확인할 수 있습니다.

## Project setup

```bash
npm install
```

## Compile and run the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
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
