export interface ICommandRepository<TModel, TEntity> {
  save(data: TModel): Promise<TModel>;
}
