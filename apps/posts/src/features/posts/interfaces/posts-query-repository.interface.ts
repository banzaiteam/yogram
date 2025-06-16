export abstract class IPostQueryRepository<R> {
  abstract find(): Promise<R[]>;
}
