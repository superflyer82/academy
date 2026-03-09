import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken } from '../lib/jwt';

export async function loginStaff(email: string, password: string) {
  const user = await prisma.staffUser.findUnique({ where: { email } });
  if (!user || !user.isActive) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  await prisma.staffUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const payload = { sub: user.id, email: user.email, role: user.role, type: 'staff' as const };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ sub: user.id, type: 'staff' }),
    user: { id: user.id, email: user.email, name: user.name, role: user.role, department: user.department },
  };
}

export async function loginCitizen(email: string, password: string) {
  const user = await prisma.citizen.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const payload = { sub: user.id, email: user.email, role: 'citizen', type: 'citizen' as const };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ sub: user.id, type: 'citizen' }),
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export async function registerCitizen(email: string, password: string, name: string) {
  const existing = await prisma.citizen.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.citizen.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true },
  });
}

export async function createStaffUser(
  email: string, name: string, role: 'STAFF' | 'ADMIN', department?: string
) {
  const existing = await prisma.staffUser.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const tempPassword = Math.random().toString(36).slice(-10);
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.staffUser.create({
    data: { email, passwordHash, name, role, department },
    select: { id: true, email: true, name: true, role: true, department: true },
  });

  return { user, tempPassword };
}
