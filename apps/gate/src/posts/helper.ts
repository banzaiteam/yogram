import { FileTypes } from '../../../../apps/libs/Files/constants/file-type.enum';
import { Request } from 'express';
import fs from 'node:fs/promises';
import { extname } from 'node:path';

async function createFolderIfNotExists(folder: string): Promise<void> {
  await fs
    .access(folder)
    .then(() => undefined)
    .catch(async () => await fs.mkdir(folder, { recursive: true }));
}

export async function getUploadPath(
  entity: FileTypes,
  uploadDir: string,
  req: Request,
): Promise<string> {
  if (entity === FileTypes.Posts) {
    const postid = req.headers.postid;
    const userId = req.headers.userid;
    const uploadsPath = [uploadDir, userId, postid].join('/');
    req.body.postId = postid;
    await createFolderIfNotExists(uploadsPath);
    return uploadsPath;
  } else if (entity === FileTypes.Avatars) {
    const userId = req.headers.id;
    const uploadsPath = [uploadDir, userId].join('/');
    await createFolderIfNotExists(uploadsPath);
    return uploadsPath;
  }
}

export function genFileName(originalname: string) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const fileExtension = extname(originalname);
  return `${originalname.substring(0, originalname.indexOf('.'))}-${uniqueSuffix}${fileExtension}`;
}
