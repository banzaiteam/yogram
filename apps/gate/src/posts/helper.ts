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
  entity: 'AVATAR' | 'POST',
  uploadDir: string,
  req: Request,
): Promise<string> {
  console.log('🚀 ~ entity:', entity);
  if (entity === 'POST') {
    const postid = req.headers.postid;
    const userId = req.headers.userid;
    const uploadsPath = `${uploadDir}/${userId}/${postid}`;
    req.body.postId = postid;
    await createFolderIfNotExists(uploadsPath);
    return uploadsPath;
  } else if (entity === 'AVATAR') {
    const userId = req.headers.userid;
    const uploadsPath = `${uploadDir}/${userId}`;
    await createFolderIfNotExists(uploadsPath);
    return uploadsPath;
  }
  // const postid = req.headers.postid;
  // const userId = req.headers.userid;
  // const uploadsPath = `${uploadDir}/${userId}/${postid}`;
  // req.body.postId = postid;
  // await createFolderIfNotExists(uploadsPath);
  // return uploadsPath;
}

export function genFileName(originalname: string) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const fileExtension = extname(originalname);
  return `${originalname.substring(0, originalname.indexOf('.'))}-${uniqueSuffix}${fileExtension}`;
}
