import { IdDto } from 'apps/libs/common/dto/id.dto';

export class FindUserByIdQuery {
  constructor(public readonly id: IdDto) {}
}
