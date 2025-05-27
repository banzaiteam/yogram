import { genRandomNumbersString } from 'apps/libs/common/utils/gen-random-numbers.util';
import { QueryRunner } from 'typeorm';

import { ResponseLoginDto } from 'apps/libs/Users/dto/user/response-login.dto';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { IUsersQueryRepository } from '../interfaces/query/user-query.interface';
import { UsersQueryService } from '../users-query.service';

export const genUserName = async (
  usernameOrEmail: string,
  queryRunner: QueryRunner,
  usersQueryService: UsersQueryService,
): Promise<string> => {
  const genString = await genRandomNumbersString(5);
  let newUsername = '';
  newUsername = usernameOrEmail.concat(genString);
  const user = await usersQueryService.findUserByCriteria({
    username: newUsername,
  });
  if (user) {
    newUsername = await genUserName(
      usernameOrEmail,
      queryRunner,
      usersQueryService,
    );
  }
  return newUsername;
};
