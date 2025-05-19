export interface EventCondition<T> {
  checkCondition(data: T): Promise<boolean>;
}
