export type Range<T> = {
  from: T;
  to: T;
};

export const Range = <T>(from: T, to: T): Range<T> => ({ from, to })
