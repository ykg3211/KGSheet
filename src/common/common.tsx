import Rx, { concat, every, filter, from, mapTo, merge, Observable, of, reduce, map, Subject, switchMap, tap, zip, debounce, debounceTime, timer, mergeMap } from "rxjs";
import { Except, Finite } from 'type-fest'

type valueOf<T> = T[keyof T]
const color = {
  Red: 0,
  Green: 1
}

type Tcolor = keyof typeof color;
type TcolorValue = valueOf<typeof color>
const test: Tcolor = 'Red'
function runTest<T, K extends keyof T>(key: K, map: T): T[K] {
  return map[key];
}
export function main() {

  const sub = new Subject<number>();

  sub.pipe(
    switchMap((e) => {
      return e === 1 ? from([1, 2, 3]) : from([11, 22, 33])
    }),
    map((e) => {
      return e + 1;
    }),
    tap((e) => {
      console.log(e)
    })
  ).subscribe();
  sub.next(1)
  // sub.next(2)

}