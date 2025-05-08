export interface IRepositoryAbstract<TModel, TEntity> {
  save(data: TModel): Promise<TModel>;
}
