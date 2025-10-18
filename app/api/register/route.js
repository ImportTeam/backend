/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: 회원가입
 *     description: 이메일, 비밀번호, 이름을 이용해 새 사용자를 등록합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: "1234"
 *               name:
 *                 type: string
 *                 example: 홍길동
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *       400:
 *         description: 필수 입력 누락
 *       409:
 *         description: 이미 존재하는 이메일
 */

import { prisma } from '@/prisma/client';
// import { prisma } from '../../../prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 이메일 중복 확인
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ error: 'Email already exists' }, { status: 409 });
    }

    // 비밀번호 해싱
    const password_hash = await bcrypt.hash(password, 10);

    // 새 유저 생성
    const newUser = await prisma.users.create({
      data: {
        uuid: randomUUID(),
        email,
        password_hash,
        social_provider: 'NONE',
        name,
      },
    });

    return Response.json({ message: 'User registered', user: newUser });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
