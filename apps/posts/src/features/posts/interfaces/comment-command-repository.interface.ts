import { DeepPartial, EntityManager } from 'typeorm';

export abstract class ICommentCommandRepository<
  Create,
  Criteria,
  Update,
  Response,
> {
  abstract create(
    createPostDto: DeepPartial<Create>,
    entityManager?: EntityManager,
  ): Promise<Response>;

  abstract update(
    criteria: Criteria,
    updateDto: Update,
    entityManager?: EntityManager,
  ): Promise<any>;

  abstract delete(
    postId: string,
    entityManager?: EntityManager,
  ): Promise<number>;
}
