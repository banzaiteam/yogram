import { User } from 'apps/users/src/infrastructure/entity/User.entity';

export type UserCriteria = Partial<Pick<User, 'email' | 'id'>>;

export class FindUserByProviderIdQuery {
  constructor(public readonly providerId: string) {}
}
