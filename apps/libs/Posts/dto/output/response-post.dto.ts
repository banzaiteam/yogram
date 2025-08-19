import { ResponseFileDto } from './response-file.dto';

export class ResponsePostDto {
  id: string;
  userId: string;
  isPublished: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  files: ResponseFileDto[];
  comments: any;
  url?: string;
}
