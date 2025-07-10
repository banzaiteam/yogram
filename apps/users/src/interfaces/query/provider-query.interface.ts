export abstract class IProviderQueryRepository<R> {
  abstract findProviderByProviderId(providerId: string): Promise<R>;
}
