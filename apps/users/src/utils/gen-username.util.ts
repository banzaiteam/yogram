import { genRandomNumbersString } from 'apps/libs/common/utils/gen-random-numbers.util';
import { QueryRunner } from 'typeorm';

import { ResponseLoginDto } from 'apps/libs/Users/dto/user/response-login.dto';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { IUsersQueryRepository } from '../interfaces/query/user-query.interface';

export const genUserName = async (
  usernameOrEmail: string,
  queryRunner: QueryRunner,
  userQueryRepository: IUsersQueryRepository<ResponseLoginDto, ResponseUserDto>,
): Promise<string> => {
  const genString = await genRandomNumbersString(5);
  let newUsername = '';
  newUsername = usernameOrEmail.concat(genString);
  const user = await userQueryRepository.findUserByUsername(
    newUsername,
    queryRunner.manager,
  );
  if (user) {
    newUsername = await genUserName(
      usernameOrEmail,
      queryRunner,
      userQueryRepository,
    );
  }
  return newUsername;
};
