export interface EventAction<T, R> {
  execute(data: T): Promise<R>;
}
