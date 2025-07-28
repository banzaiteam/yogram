import {
  ArgumentMetadata,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import fs from 'fs/promises';
import sharp from 'sharp';
import { pipeline } from 'node:stream/promises';

export class SharpPipe implements PipeTransform {
  async transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
    if (!files) return null;
    if (!Array.isArray(files)) {
      const file = files;
      files = [];
      files.push(file);
    }
    files = await Promise.all(
      files.map(async (file) => {
        try {
          const buffer = await sharp(file.path)
            .webp({ quality: 75 })
            .toBuffer();
          const blob = new Blob([buffer]);
          // stream from buffer
          const stream = blob.stream();
          const writable = await fs.open(file.path, 'w');
          const writableStream = writable.createWriteStream();
          file.size = blob.size;
          await pipeline(stream, writableStream);

          return file;
        } catch (error) {
          console.log('🚀 ~ SharpPipe ~ error:', error);
          throw new InternalServerErrorException('Sharp pipe error');
        }
      }),
    );
    return files;
  }
}
