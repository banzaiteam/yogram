import fs from 'node:fs/promises';

async function createFolderIfNotExists(folder: string): Promise<void> {
  await fs
    .access(folder)
    .then(() => undefined)
    .catch(async () => await fs.mkdir(folder, { recursive: true }));
}

export async function getUploadPath(userId: string): Promise<string> {
  const UPLOAD_DIR = 'apps/gate/src/posts/uploads';
  const uploadsPath = `${UPLOAD_DIR}/${userId}`;
  await this.createFolderIfNotExists(uploadsPath);
  return uploadsPath;
}
