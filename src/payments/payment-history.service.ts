import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PaymentHistoryFilter {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentHistoryQuery {
  page?: {
    size: number;
    offset: number;
  };
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  filter?: PaymentHistoryFilter;
}

@Injectable()
export class PaymentHistoryService {
  private readonly logger = new Logger('PaymentHistoryService');

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 사용자의 결제 내역 조회
   */
  async getUserPaymentHistory(
    userUuid: string,
    query: PaymentHistoryQuery,
  ): Promise<any> {
    try {
      this.logger.log(`Fetching payment history for user: ${userUuid}`);

      const pageSize = query.page?.size || 20;
      const pageOffset = query.page?.offset || 0;

      // 필터 조건 구성
      const whereCondition: any = {
        user_uuid: userUuid,
      };

      if (query.filter?.status) {
        whereCondition.status = query.filter.status;
      }

      if (query.filter?.startDate) {
        whereCondition.created_at = {
          ...whereCondition.created_at,
          gte: query.filter.startDate,
        };
      }

      if (query.filter?.endDate) {
        whereCondition.created_at = {
          ...whereCondition.created_at,
          lte: query.filter.endDate,
        };
      }

      if (query.filter?.minAmount || query.filter?.maxAmount) {
        whereCondition.amount = {};
        if (query.filter.minAmount) {
          whereCondition.amount.gte = query.filter.minAmount;
        }
        if (query.filter.maxAmount) {
          whereCondition.amount.lte = query.filter.maxAmount;
        }
      }

      // 결제 내역 조회
      const transactions = await this.prisma.payment_transactions.findMany({
        where: whereCondition,
        orderBy: query.sort
          ? {
              [query.sort.field]: query.sort.order.toLowerCase(),
            }
          : { created_at: 'desc' },
        take: pageSize,
        skip: pageOffset,
        include: {
          user: {
            select: {
              uuid: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // 총 건수 조회
      const totalCount = await this.prisma.payment_transactions.count({
        where: whereCondition,
      });

      // 금액 통계
      const statistics = await this.prisma.payment_transactions.aggregate({
        where: whereCondition,
        _sum: {
          amount: true,
        },
        _avg: {
          amount: true,
        },
        _count: true,
      });

      return {
        items: transactions.map((tx) => ({
          id: tx.uuid,
          merchantName: tx.merchant_name,
          amount: tx.amount.toString(),
          currency: tx.currency,
          status: tx.status,
          benefitValue: tx.benefit_value?.toString() || '0',
          benefitDesc: tx.benefit_desc,
          comparedAt: tx.compared_at,
          createdAt: tx.created_at,
          updatedAt: tx.updated_at,
        })),
        pagination: {
          totalCount,
          pageSize,
          currentOffset: pageOffset,
          hasMore: pageOffset + pageSize < totalCount,
        },
        statistics: {
          totalAmount: statistics._sum.amount?.toString() || '0',
          averageAmount: statistics._avg.amount
            ? statistics._avg.amount.toFixed(2)
            : '0',
          totalTransactions: statistics._count,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching payment history:', error);
      throw error;
    }
  }

  /**
   * 결제 단건 조회
   */
  async getPaymentDetail(
    userUuid: string,
    paymentId: string,
  ): Promise<any> {
    try {
      this.logger.log(
        `Fetching payment detail: ${paymentId} for user: ${userUuid}`,
      );

      // DB에서 조회
      const transaction = await this.prisma.payment_transactions.findUnique({
        where: { uuid: paymentId },
        include: {
          user: {
            select: {
              uuid: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!transaction) {
        throw new NotFoundException('결제 내역을 찾을 수 없습니다.');
      }

      if (transaction.user_uuid !== userUuid) {
        throw new NotFoundException('본인의 결제 내역만 조회할 수 있습니다.');
      }

      return {
        id: transaction.uuid,
        merchantName: transaction.merchant_name,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
        status: transaction.status,
        benefitValue: transaction.benefit_value?.toString() || '0',
        benefitDesc: transaction.benefit_desc,
        comparedAt: transaction.compared_at,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      };
    } catch (error) {
      this.logger.error('Error fetching payment detail:', error);
      throw error;
    }
  }

  /**
   * 결제 상태별 집계
   */
  async getPaymentStatistics(
    userUuid: string,
  ): Promise<any> {
    try {
      this.logger.log(`Fetching payment statistics for user: ${userUuid}`);

      const byStatus = await this.prisma.payment_transactions.groupBy({
        by: ['status'],
        where: { user_uuid: userUuid },
        _count: {
          seq: true,
        },
        _sum: {
          amount: true,
        },
      });

      const byMerchant = await this.prisma.payment_transactions.groupBy({
        by: ['merchant_name'],
        where: { user_uuid: userUuid },
        _count: {
          seq: true,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: 'desc',
          },
        },
        take: 10,
      });

      const monthlyStats = await this.prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as count,
          SUM(amount) as total,
          AVG(amount) as average
        FROM payment_transactions
        WHERE user_uuid = ${userUuid}
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
        LIMIT 12
      `;

      return {
        byStatus: byStatus.map((s) => ({
          status: s.status,
          count: s._count.seq,
          total: s._sum.amount?.toString() || '0',
        })),
        topMerchants: byMerchant.map((m) => ({
          merchant: m.merchant_name,
          count: m._count.seq,
          total: m._sum.amount?.toString() || '0',
        })),
        monthlyTrend: monthlyStats,
      };
    } catch (error) {
      this.logger.error('Error fetching payment statistics:', error);
      throw error;
    }
  }
}
