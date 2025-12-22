import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ===== 홍길동 테스트 계정(대시보드/카드 화면 확인용) =====
  const hongEmail = 'hong@example.com';
  const hongPasswordPlain = 'test1234';
  const hongName = '홍길동';
  const hongUuid = '550e8400-e29b-41d4-a716-446655440001';

  const hongPasswordHash = await bcrypt.hash(hongPasswordPlain, 10);

  const hong = await prisma.users.upsert({
    where: { email: hongEmail },
    update: {
      name: hongName,
      password_hash: hongPasswordHash,
      social_provider: 'NONE',
    },
    create: {
      uuid: hongUuid,
      email: hongEmail,
      password_hash: hongPasswordHash,
      name: hongName,
      social_provider: 'NONE',
    },
  });

  await prisma.user_settings.upsert({
    where: { user_seq: hong.seq },
    update: {
      dark_mode: false,
      notification_enabled: true,
      compare_mode: 'AUTO',
      currency_preference: 'KRW',
    },
    create: {
      user_seq: hong.seq,
      dark_mode: false,
      notification_enabled: true,
      compare_mode: 'AUTO',
      currency_preference: 'KRW',
    },
  });

  // 재실행 시 중복 방지: 홍길동의 더미 데이터는 지우고 다시 생성
  await prisma.payment_transactions.deleteMany({ where: { user_uuid: hong.uuid } });
  await prisma.payment_methods.deleteMany({ where: { user_uuid: hong.uuid } });

  // 카드 이름은 아래 5개만 사용
  const paymentMethods = await Promise.all([
    prisma.payment_methods.create({
      data: {
        user_uuid: hong.uuid,
        type: 'CARD',
        provider_name: 'KB 국민카드',
        alias: 'KB 국민카드',
        last_4_nums: '1234',
        card_brand: 'VISA',
        expiry_month: '12',
        expiry_year: '2028',
        card_holder_name: hongName,
        card_number_hash: 'seed:kb-1234567812341234',
        cvv_hash: 'seed:kb-123',
        is_primary: true,
      },
    }),
    prisma.payment_methods.create({
      data: {
        user_uuid: hong.uuid,
        type: 'ETC',
        provider_name: '토스페이',
        alias: '토스페이',
        last_4_nums: '0000',
        is_primary: false,
      },
    }),
    prisma.payment_methods.create({
      data: {
        user_uuid: hong.uuid,
        type: 'KAKAOPAY',
        provider_name: '카카오페이',
        alias: '카카오페이',
        last_4_nums: '0000',
        is_primary: false,
      },
    }),
    prisma.payment_methods.create({
      data: {
        user_uuid: hong.uuid,
        type: 'CARD',
        provider_name: '삼성카드',
        alias: '삼성카드',
        last_4_nums: '5678',
        card_brand: 'MASTERCARD',
        expiry_month: '06',
        expiry_year: '2027',
        card_holder_name: hongName,
        card_number_hash: 'seed:samsung-5555444433335678',
        cvv_hash: 'seed:samsung-456',
        is_primary: false,
      },
    }),
    prisma.payment_methods.create({
      data: {
        user_uuid: hong.uuid,
        type: 'CARD',
        provider_name: '신한카드',
        alias: '신한카드',
        last_4_nums: '9999',
        card_brand: 'VISA',
        expiry_month: '11',
        expiry_year: '2029',
        card_holder_name: hongName,
        card_number_hash: 'seed:shinhan-9999888877779999',
        cvv_hash: 'seed:shinhan-789',
        is_primary: false,
      },
    }),
  ]);

  console.log('✅ Seed user:', hong.email, '(password:', hongPasswordPlain + ')');
  console.log(
    '✅ Created payment methods:',
    paymentMethods.map((m) => m.provider_name),
  );

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const mkDate = (y: number, m: number, d: number) => new Date(y, m, d, 12, 0, 0);

  // 대시보드에서 분류가 잘 되는 가맹점명을 충분히 섞어서 대량으로 넣습니다.
  // (쇼핑/식비/교통/구독/생활/여행/기타)
  const merchants = {
    shopping: ['쿠팡', '11번가', 'Gmarket', '무신사'],
    food: ['스타벅스', '맥도날드', '동네식당', '카페베네'],
    transport: ['지하철', '버스', '택시', 'Kakao T'],
    subscription: ['넷플릭스', '유튜브 프리미엄', 'Spotify'],
    living: ['GS25', 'CU', '이마트', '홈플러스'],
    travel: ['호텔', '항공권', '숙박'],
    other: ['병원', '학원', '서점'],
  };

  const pick = <T>(arr: T[], idx: number) => arr[idx % arr.length];

  // 결제수단별 사용 편차를 주기 위한 분포
  // - KB 국민카드(주카드): 가장 많이
  // - 삼성/신한: 그 다음
  // - 토스페이/카카오페이: 중간
  const methodByIdx = (i: number) => {
    if (i % 10 < 4) return paymentMethods[0]; // KB
    if (i % 10 < 6) return paymentMethods[3]; // 삼성
    if (i % 10 < 8) return paymentMethods[4]; // 신한
    if (i % 10 === 8) return paymentMethods[1]; // 토스
    return paymentMethods[2]; // 카카오
  };

  const toAmount = (base: number, i: number) => {
    // 약간의 변동성을 주되, 완전 랜덤은 피해서 재현 가능하게
    const wiggle = (i * 137) % 9000;
    return String(base + wiggle);
  };

  const toBenefit = (amount: number, i: number) => {
    // benefit_value는 0~약 8% 수준으로
    const rate = [0, 1, 2, 3, 5, 7, 8][i % 7];
    return String(Math.floor((amount * rate) / 100));
  };

  type TxSeed = {
    merchant_name: string;
    amount: string;
    benefit_value: string;
    payment_method_seq: bigint;
    created_at: Date;
  };

  const txSeed: TxSeed[] = [];
  const addTx = (created_at: Date, merchant_name: string, baseAmount: number, i: number) => {
    const method = methodByIdx(i);
    const amountStr = toAmount(baseAmount, i);
    const amountNum = Number(amountStr);
    txSeed.push({
      merchant_name,
      amount: amountStr,
      benefit_value: toBenefit(amountNum, i),
      payment_method_seq: method.seq,
      created_at,
    });
  };

  // 이번 달: 40건 (대시보드/최근내역 풍부)
  for (let i = 0; i < 40; i++) {
    const day = (i % 25) + 1;
    const createdAt = mkDate(thisYear, thisMonth, day);
    const group = i % 7;
    const merchant =
      group === 0
        ? pick(merchants.shopping, i)
        : group === 1
          ? pick(merchants.food, i)
          : group === 2
            ? pick(merchants.transport, i)
            : group === 3
              ? pick(merchants.subscription, i)
              : group === 4
                ? pick(merchants.living, i)
                : group === 5
                  ? pick(merchants.travel, i)
                  : pick(merchants.other, i);
    const base =
      group === 0
        ? 35000
        : group === 1
          ? 8000
          : group === 2
            ? 2500
            : group === 3
              ? 12000
              : group === 4
                ? 9000
                : group === 5
                  ? 90000
                  : 15000;
    addTx(createdAt, merchant, base, i);
  }

  // 최근 6개월: 월별로 25/18/14/10/8건
  const monthlyCounts = [25, 18, 14, 10, 8];
  for (let m = 1; m <= 5; m++) {
    const count = monthlyCounts[m - 1];
    for (let i = 0; i < count; i++) {
      const day = (i % 25) + 1;
      const createdAt = mkDate(thisYear, thisMonth - m, day);
      const group = (i + m) % 6;
      const merchant =
        group === 0
          ? pick(merchants.shopping, i + m)
          : group === 1
            ? pick(merchants.food, i + m)
            : group === 2
              ? pick(merchants.transport, i + m)
              : group === 3
                ? pick(merchants.subscription, i + m)
                : group === 4
                  ? pick(merchants.living, i + m)
                  : pick(merchants.other, i + m);
      const base =
        group === 0
          ? 42000
          : group === 1
            ? 11000
            : group === 2
              ? 3000
              : group === 3
                ? 13000
                : group === 4
                  ? 12000
                  : 20000;
      addTx(createdAt, merchant, base, 1000 + m * 100 + i);
    }
  }

  // 작년 동월: 12건 (절약 비교가 확실히 나오도록)
  for (let i = 0; i < 12; i++) {
    const day = (i % 25) + 1;
    const createdAt = mkDate(thisYear - 1, thisMonth, day);
    const merchant = i % 2 === 0 ? pick(merchants.shopping, i) : pick(merchants.food, i);
    const base = i % 2 === 0 ? 48000 : 9500;
    addTx(createdAt, merchant, base, 2000 + i);
  }

  await prisma.payment_transactions.createMany({
    data: txSeed.map((t) => ({
      uuid: randomUUID(),
      user_uuid: hong.uuid,
      payment_method_seq: t.payment_method_seq,
      merchant_name: t.merchant_name,
      amount: t.amount as any,
      currency: 'KRW',
      benefit_value: t.benefit_value as any,
      benefit_desc: 'seed: 임시 결제내역',
      status: 'COMPLETED',
      created_at: t.created_at,
      updated_at: t.created_at,
    })),
  });

  console.log(`✅ Created payment transactions: ${txSeed.length} rows`);

  // 추천 Top3에서 provider별 혜택 건수(가중치)가 보이도록 최소 더미 혜택도 시딩
  const offers = [
    { provider: 'KB 국민카드', hash: 'seed-offer-kb-1' },
    { provider: 'KB 국민카드', hash: 'seed-offer-kb-2' },
    { provider: '토스페이', hash: 'seed-offer-toss-1' },
    { provider: '카카오페이', hash: 'seed-offer-kakao-1' },
    { provider: '삼성카드', hash: 'seed-offer-samsung-1' },
    { provider: '신한카드', hash: 'seed-offer-shinhan-1' },
  ];
  for (const o of offers) {
    await prisma.benefit_offers.upsert({
      where: { hash: o.hash },
      update: { active: true, provider_name: o.provider },
      create: {
        provider_name: o.provider,
        payment_type: null,
        title: 'seed: 더미 혜택',
        description: 'seed: 대시보드 추천/표시용 임시 혜택 데이터',
        merchant_filter: '쿠팡',
        category_filter: '쇼핑',
        min_spend: '0' as any,
        discount_type: 'PERCENT',
        discount_value: '5' as any,
        max_discount: '5000' as any,
        start_date: new Date(thisYear, 0, 1),
        end_date: new Date(thisYear, 11, 31),
        active: true,
        source_url: 'seed://local',
        hash: o.hash,
      },
    });
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
