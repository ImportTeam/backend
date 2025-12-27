import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // NOTE:
    // Nest(+decorator metadata) 기반 Jest 스펙(src/**/*.spec.ts)은 Vitest(Vite/esbuild)로 실행 시
    // DI 메타데이터가 보존되지 않아 주입이 깨질 수 있습니다.
    // 따라서 Vitest는 전용 파일 패턴만 대상으로 합니다.
    include: ['src/**/*.vitest.{ts,tsx}', 'src/**/*.vitest.spec.{ts,tsx}', 'test/**/*.vitest.{ts,tsx}', 'test/**/*.vitest.spec.{ts,tsx}'],
    setupFiles: ['test/setup-vitest.ts'],
    coverage: {
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
});
