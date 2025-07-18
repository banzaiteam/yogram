import { genRandomNumbersString } from '../../../../apps/libs/common/utils/gen-random-numbers.util';
import { UsersQueryService } from '../users-query.service';

export const genUserName = async (
  usernameOrEmail: string,
  usersQueryService: UsersQueryService,
): Promise<string> => {
  const genString = await genRandomNumbersString(5);
  let newUsername = '';
  newUsername = usernameOrEmail.concat(genString);
  const user = await usersQueryService.findUserByCriteria({
    username: newUsername,
  });
  if (user) {
    newUsername = await genUserName(usernameOrEmail, usersQueryService);
  }
  return newUsername;
};
