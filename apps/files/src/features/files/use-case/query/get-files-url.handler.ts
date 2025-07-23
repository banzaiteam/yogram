import { ConfigService } from '@nestjs/config';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FilesQueryService } from '../../../../files-query.service';
import { GetFilesUrlDto } from '../../../../../../libs/Files/dto/get-files.dto';

export class GetFilesUrlQuery {
  constructor(public readonly path: string) {}
}

@QueryHandler(GetFilesUrlQuery)
export class GetFilesUrlHandler implements IQueryHandler<GetFilesUrlQuery> {
  constructor(
    private readonly configService: ConfigService,
    private readonly filesQueryService: FilesQueryService,
  ) {}
  async execute({ path }: GetFilesUrlQuery): Promise<GetFilesUrlDto> {
    return await this.filesQueryService.getFilesUrl(
      path,
      this.configService.get('BUCKET'),
    );
  }
}
