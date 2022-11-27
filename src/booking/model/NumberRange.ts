import { Range } from "./Range";


  export const add = (r1: Range<number>, r2: Range<number>): Range<number>[] => {
    let [left, right] = r1.from < r2.from ? [r1, r2] : [r2, r1];

    if (left.to >= right.from) {
      const to = Math.max(left.to, right.to);
      return [{ from: left.from, to }];
    } else {
      return [left, right];
    }

  };

  /**
   * subtruct from a range
   * @param range the range to be subtracted from (positive)
   * @param sub the range to subtruct (negative)
   * @returns array of ranges
   */
  export const subtract = (range: Range<number>, sub: Range<number>): Range<number>[] => {

    if (range.from >= sub.to) {
      return [range];
    } else {
      const arr: Range<number>[] = [];
      if (sub.from > range.from) {
        arr.push({ from: range.from, to: sub.from });
      }
      if (sub.to < range.to) {
        arr.push({ from: sub.to, to: range.to });
      }
      return arr;
    }
  };



  export const addMany = (ranges: Range<number>[]) => {
    const [head, ...rest] = ranges;
    return rest.reduce((agg, range) => {
      const [r2] = agg.splice(-1);
      const c = add(range, r2);
      return [...agg, ...c];
    }, [head]);
  };

