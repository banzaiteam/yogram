import { UpdateUserDto } from './update-user.dto';
import { UpdateUserCriteria } from './update-user-criteria.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class UpdateUserWithCriteriaDto {
  @Type(() => UpdateUserCriteria)
  @ValidateNested()
  criteria: UpdateUserCriteria;
  @Type(() => UpdateUserDto)
  @ValidateNested()
  updateUserDto: UpdateUserDto;
}
