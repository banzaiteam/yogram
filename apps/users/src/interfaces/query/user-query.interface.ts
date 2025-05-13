export abstract class IUsersQueryRepository<R> {
  abstract findOne(id: string): Promise<R>;
}
