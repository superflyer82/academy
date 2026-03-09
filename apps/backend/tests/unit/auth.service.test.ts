import * as bcrypt from 'bcryptjs';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    staffUser: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    citizen: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../../src/lib/jwt', () => ({
  signAccessToken: jest.fn(() => 'access-token'),
  signRefreshToken: jest.fn(() => 'refresh-token'),
}));

import { prisma } from '../../src/lib/prisma';
import { loginStaff } from '../../src/services/auth.service';
import { StaffRole } from '@maengelmelder/shared-types';

const mockPrismaStaff = prisma.staffUser as unknown as Record<string, jest.Mock>;

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginStaff', () => {
    it('throws when user not found', async () => {
      mockPrismaStaff.findUnique.mockResolvedValue(null);
      await expect(loginStaff('test@example.com', 'password')).rejects.toThrow('Invalid credentials');
    });

    it('throws on wrong password', async () => {
      const hash = await bcrypt.hash('correctpassword', 10);
      mockPrismaStaff.findUnique.mockResolvedValue({
        id: 'staff-1',
        email: 'admin@example.com',
        passwordHash: hash,
        name: 'Admin',
        role: StaffRole.ADMIN,
        isActive: true,
      });

      await expect(loginStaff('admin@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('returns tokens on valid credentials', async () => {
      const hash = await bcrypt.hash('correctpassword', 10);
      const mockStaff = {
        id: 'staff-1',
        email: 'admin@example.com',
        passwordHash: hash,
        name: 'Admin',
        role: StaffRole.ADMIN,
        isActive: true,
      };
      mockPrismaStaff.findUnique.mockResolvedValue(mockStaff);
      mockPrismaStaff.update.mockResolvedValue(mockStaff);

      const result = await loginStaff('admin@example.com', 'correctpassword');

      expect(result.accessToken).toBe('access-token');
      expect(result.user.email).toBe('admin@example.com');
    });
  });
});
