import { UpdateUserCriteria } from 'apps/libs/Users/dto/user/update-user-criteria.dto';
import { UpdateUserDto } from 'apps/libs/Users/dto/user/update-user.dto';

export class UpdateUserByCriteriaCommand {
  constructor(
    public readonly criteria: UpdateUserCriteria,
    public readonly updateUserDto: UpdateUserDto,
    public readonly file?: Express.Multer.File,
  ) {}
}
