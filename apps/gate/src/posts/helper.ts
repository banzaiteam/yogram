import fs from 'node:fs/promises';
import { extname } from 'node:path';

async function createFolderIfNotExists(folder: string): Promise<void> {
  await fs
    .access(folder)
    .then(() => undefined)
    .catch(async () => await fs.mkdir(folder, { recursive: true }));
}

export async function getUploadPath(userId: string): Promise<string> {
  const UPLOAD_DIR = 'apps/gate/src/posts/uploads';
  const uploadsPath = `${UPLOAD_DIR}/${userId}`;
  await createFolderIfNotExists(uploadsPath);
  return uploadsPath;
}

export function genFileName(originalname: string) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const fileExtension = extname(originalname);
  return `${originalname}-${uniqueSuffix}${fileExtension}`;
}
