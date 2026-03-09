// Mock Prisma before imports
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    report: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('../../src/services/upload.service', () => ({
  getPhotoUrl: (filename: string) => `/uploads/${filename}`,
  deletePhoto: jest.fn(),
}));

import { prisma } from '../../src/lib/prisma';
import { createReport, findNearbyDuplicates } from '../../src/services/report.service';
import { ReportStatus } from '@maengelmelder/shared-types';

const mockReport = prisma.report as unknown as Record<string, jest.Mock>;

describe('report.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReport', () => {
    it('creates a report with OPEN status', async () => {
      const fakeReport = {
        id: 'report-1',
        publicToken: 'token-123',
        status: ReportStatus.OPEN,
        createdAt: new Date(),
        photos: [],
      };
      mockReport.create.mockResolvedValue(fakeReport);

      const result = await createReport(
        { categoryId: 'cat-1', lat: 51.1, lng: 10.0 },
        []
      );

      expect(mockReport.create).toHaveBeenCalledTimes(1);
      expect(result.status).toBe(ReportStatus.OPEN);
    });
  });

  describe('findNearbyDuplicates', () => {
    it('filters reports to within 100m radius', async () => {
      const nearbyReport = {
        id: 'r1',
        lat: 51.1001, // ~11m away
        lng: 10.0,
        status: ReportStatus.OPEN,
        categoryId: 'cat-1',
        category: { id: 'cat-1', name: 'Straßenschaden', icon: '🚧' },
        photos: [],
      };
      const farReport = {
        id: 'r2',
        lat: 51.2,  // ~11km away
        lng: 10.0,
        status: ReportStatus.OPEN,
        categoryId: 'cat-1',
        category: { id: 'cat-1', name: 'Straßenschaden', icon: '🚧' },
        photos: [],
      };

      mockReport.findMany.mockResolvedValue([nearbyReport, farReport]);

      const results = await findNearbyDuplicates(51.1, 10.0, 'cat-1');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('r1');
    });
  });
});
