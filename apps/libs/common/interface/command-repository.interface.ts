export interface ICommandRepository<TEntity> {
  save(data: any): Promise<TEntity[]>;
}
