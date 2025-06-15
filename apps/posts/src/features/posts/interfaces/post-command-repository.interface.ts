import { UpdatePostCriteria } from 'apps/libs/Posts/dto/input/update-post-criteria.dto';
import { DeepPartial, EntityManager } from 'typeorm';

export abstract class IPostCommandRepository<C, U, R> {
  abstract create(
    createPostDto: DeepPartial<C>,
    entityManager?: EntityManager,
  ): Promise<R>;

  abstract update(
    criteria: UpdatePostCriteria,
    updateDto: U,
    entityManager?: EntityManager,
  ): Promise<any>;

  abstract delete(
    postId: string,
    entityManager?: EntityManager,
  ): Promise<number>;
}
