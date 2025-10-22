import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID, randomBytes, createCipheriv } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 테스트 사용자 생성
  const hashedPassword = await bcrypt.hash('test1234', 10);
  
  const user = await prisma.users.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      uuid: randomUUID(),
      email: 'test@example.com',
      password_hash: hashedPassword,
      name: '테스트 사용자',
      social_provider: 'NONE',
    },
  });

  console.log('✅ Created test user:', user.email);

  // 테스트 결제수단 생성
  // 암호화 함수
  const encrypt = (text: string): string => {
    const algorithm = 'aes-256-cbc';
    const key = randomBytes(32);
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  };

  const paymentMethod1 = await prisma.payment_methods.create({
    data: {
      user_uuid: user.uuid,
      type: 'CARD',
      card_number_hash: encrypt('1234567812341234'),
      last_4_nums: '1234',
      card_holder_name: '테스트 사용자',
      provider_name: '신한카드',
      card_brand: 'VISA',
      expiry_month: '12',
      expiry_year: '2028',
      cvv_hash: encrypt('123'),
      billing_address: '서울시 강남구 테헤란로 123',
      billing_zip: '06234',
      alias: '주카드',
      is_primary: true,
    },
  });

  const paymentMethod2 = await prisma.payment_methods.create({
    data: {
      user_uuid: user.uuid,
      type: 'CARD',
      card_number_hash: encrypt('5555444433335678'),
      last_4_nums: '5678',
      card_holder_name: '테스트 사용자',
      provider_name: '삼성카드',
      card_brand: 'MASTERCARD',
      expiry_month: '06',
      expiry_year: '2027',
      cvv_hash: encrypt('456'),
      billing_address: '서울시 서초구 강남대로 456',
      billing_zip: '06789',
      alias: '개인카드',
      is_primary: false,
    },
  });

  const paymentMethod3 = await prisma.payment_methods.create({
    data: {
      user_uuid: user.uuid,
      type: 'KAKAOPAY',
      provider_name: '카카오페이',
      last_4_nums: '0000',
      alias: '간편결제',
      is_primary: false,
    },
  });

  console.log('✅ Created payment methods:', [
    paymentMethod1.alias,
    paymentMethod2.alias,
    paymentMethod3.alias,
  ]);

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
