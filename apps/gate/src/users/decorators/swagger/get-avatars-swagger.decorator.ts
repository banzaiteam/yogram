import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetFilesUrlDto } from '../../../../../../apps/libs/Files/dto/get-files.dto';

export const GetAvatarsSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'Authorization with bearer token',
    }),
    ApiOperation({
      summary: 'Get all user`s avatars',
    }),
    ApiResponse({
      status: 200,
      type: GetFilesUrlDto,
      isArray: true,
    }),
    ApiResponse({
      status: 404,
      description: 'FilesQueryService error: files was not found',
    }),
  );
