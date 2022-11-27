import { CompareFn } from "./CompareFn";
import { Range } from "./Range";

export type BetweenFn<T> = (value: T, range: Partial<Range<T>>) => boolean;


export const Between = <T>(compare: CompareFn<T>): BetweenFn<T> => {

  const gtEq = (t1: T, t2: T) => compare(t1, t2) >= 0
  const ltEq = (t1: T, t2: T) => compare(t1, t2) <= 0

  return (value: T, { from, to }: Partial<Range<T>>) => {
    return (!from || gtEq(value, from)) && (!to || ltEq(value, to))
  }

};
