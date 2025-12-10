import 'reflect-metadata';
import { vi } from 'vitest';

// Jest 호환 shim: 기존 스펙에서 사용하는 jest.fn, jest.mock 등을 vi로 연결
(globalThis as any).jest = {
  ...vi,
  fn: vi.fn,
  spyOn: vi.spyOn,
  mock: vi.mock,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
};
