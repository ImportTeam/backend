/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: 로그인
 *     description: 이메일과 비밀번호를 이용해 JWT 토큰을 발급받습니다.
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
 *     responses:
 *       200:
 *         description: 로그인 성공
 */

import { prisma } from '@/prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/utils/jwt';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = generateToken({ userId: user.seq.toString(), email: user.email });

    await prisma.user_sessions.create({
      data: {
        user_seq: user.seq,
        access_token: token,
        refresh_token: '',
        expires_at: new Date(Date.now() + 3600 * 1000),
      },
    });

    return Response.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
