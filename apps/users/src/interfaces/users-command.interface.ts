export abstract class IUserRepository<C> {
  abstract create(createUserDto: C): Promise<void>;
}
