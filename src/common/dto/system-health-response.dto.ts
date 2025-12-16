import { ApiProperty } from '@nestjs/swagger';

export class ProcessMemoryUsageDto {
  @ApiProperty({ example: 12345678 })
  rss: number;

  @ApiProperty({ example: 1234567 })
  heapTotal: number;

  @ApiProperty({ example: 987654 })
  heapUsed: number;

  @ApiProperty({ example: 12345 })
  external: number;
}

export class SystemHealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: '서버 정상 작동' })
  message: string;

  @ApiProperty({ example: '2025-12-03T12:34:56.789Z' })
  serverTime: string;

  @ApiProperty({ example: 12345 })
  uptimeSeconds: number;

  @ApiProperty({ example: 'v22.11.0' })
  nodeVersion: string;

  @ApiProperty({ example: 'win32' })
  platform: string;

  @ApiProperty({ example: 'x64' })
  arch: string;

  @ApiProperty({ example: 8 })
  cpuCount: number;

  @ApiProperty({ example: 17179869184 })
  totalMemBytes: number;

  @ApiProperty({ example: 8589934592 })
  freeMemBytes: number;

  @ApiProperty({ type: ProcessMemoryUsageDto })
  processMemory: ProcessMemoryUsageDto;

  @ApiProperty({ example: [0.1, 0.05, 0.0] })
  loadavg: number[];

  @ApiProperty({ example: 2.34 })
  responseTimeMs: number;
}
