import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger';

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? './uploads';
const BASE_URL = process.env.API_BASE_URL ?? '';

export function getPhotoUrl(filename: string): string {
  return `${BASE_URL}/uploads/${filename}`;
}

export function deletePhoto(filename: string): void {
  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    logger.error({ err, filename }, 'Failed to delete photo file');
  }
}

export function getFilenameFromUrl(url: string): string {
  return path.basename(url);
}
