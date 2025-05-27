import { Profile } from 'apps/users/src/infrastructure/entity/Profile.entity';
import { Provider } from 'apps/users/src/infrastructure/entity/Provider.entity';
import { User } from 'apps/users/src/infrastructure/entity/User.entity';

export type UserCriteria = Partial<
  Pick<User & Profile & Provider, 'email' | 'id' | 'username' | 'providerId'>
>;

export class FindUserByCriteriaQuery {
  constructor(public readonly criteria: UserCriteria) {}
}
