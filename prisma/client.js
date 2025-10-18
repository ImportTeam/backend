import { PrismaClient } from '@prisma/client';
import { resetSequences } from './resetSeq.js'; // 추가

const globalForPrisma = global;
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

// 개발 중에만 시퀀스 자동 초기화 실행
if (process.env.NODE_ENV !== 'production') {
  resetSequences();
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
