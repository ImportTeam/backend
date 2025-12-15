import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class RecentSiteTransactionsQueryDto {
  @ApiPropertyOptional({ example: 1, description: '페이지 번호(1부터 시작)' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt({ message: 'page는 정수여야 합니다.' })
  @Min(1, { message: 'page는 1 이상이어야 합니다.' })
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: '페이지 크기(최대 50)' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt({ message: 'size는 정수여야 합니다.' })
  @Min(1, { message: 'size는 1 이상이어야 합니다.' })
  @Max(50, { message: 'size는 최대 50까지 가능합니다.' })
  size?: number = 10;
}
