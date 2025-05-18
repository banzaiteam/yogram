import { Profile } from 'apps/users/src/infrastructure/entity/Profile.entity';
import { User } from 'apps/users/src/infrastructure/entity/User.entity';

export type UserProfileCriteria = Partial<
  Pick<User & Profile, 'email' | 'password' | 'username' | 'id'>
>;

export class FindUserByCriteriaQuery {
  constructor(public readonly criteria: UserProfileCriteria) {}
}
