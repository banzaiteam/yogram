import { DeepPartial, EntityManager } from 'typeorm';

export abstract class IPostCommandRepository<C, U, R> {
  abstract create(
    createPostDto: DeepPartial<C>,
    entityManager?: EntityManager,
  ): Promise<R>;
}
