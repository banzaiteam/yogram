import { ResponseFileDto } from './response-file.dto';

export class ResponsePostDto {
  id: string;
  userId: string;
  isPublished: boolean;
  description?: string;
  files: ResponseFileDto[];
}

// todo! apps/libs/Posts/dto/output/post-paginated-reponse.dto does not visible in swagger
// make it just with dto without generic interface
