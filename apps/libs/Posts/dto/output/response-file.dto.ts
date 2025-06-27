import { OmitType } from '@nestjs/swagger';
import { File } from '../../../../../apps/posts/src/features/posts/infrastracture/entity/file.entity';

export class ResponseFileDto extends OmitType(File, ['deletedAt', 'post']) {}
