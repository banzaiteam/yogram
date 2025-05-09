type Newable = { new (...args: readonly unknown[]): unknown };
type AnyFn = (...args: unknown[]) => unknown;

// returns only class properties without methods
export type ClassProperties<C extends Newable> = {
  [K in keyof InstanceType<C> as InstanceType<C>[K] extends AnyFn
    ? never
    : K]: InstanceType<C>[K];
};
