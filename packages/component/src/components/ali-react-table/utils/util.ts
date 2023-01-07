import { asyncScheduler, defer, fromEvent, BehaviorSubject, Subscription } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';

// 使用 defer 避免过早引用 window，导致在 SSR 场景下报错
export const throttledWindowResize$ = defer(() =>
  fromEvent(window, 'resize', { passive: true }).pipe(
    throttleTime(150, asyncScheduler, { leading: true, trailing: true }),
  ),
);

/** 获取默认的滚动条大小 */
const getScrollbarSizeImpl = () => {
  const scrollDiv = document.createElement('div');

  scrollDiv.style.position = 'absolute';
  scrollDiv.style.width = '100px';
  scrollDiv.style.height = '100px';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.top = '-9999px';

  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  const scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;
  document.body.removeChild(scrollDiv);

  return { width: scrollbarWidth, height: scrollbarHeight };
};

let scrollBarSize$: BehaviorSubject<{ width: number; height: number }>;

export function getScrollbarSize() {
  if (scrollBarSize$ == null) {
    scrollBarSize$ = new BehaviorSubject(getScrollbarSizeImpl());
    throttledWindowResize$.pipe(map(() => getScrollbarSizeImpl())).subscribe(scrollBarSize$);
  }

  return scrollBarSize$.value;
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export const shallowEqual = <T>(objA: T, objB: T): boolean => {
  const hasOwnProperty = Object.prototype.hasOwnProperty;

  if (Object.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is((objA as any)[keysA[i]], (objB as any)[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
};

/** 同步多个元素之间的 scrollLeft, 每当 scrollLeft 发生变化时 callback 会被调用 */
export const syncScrollLeft = (
  elements: HTMLElement[],
  callback: (scrollLeft: number) => void,
): Subscription => {
  const bypassSet: Set<HTMLElement> = new Set();

  function publishScrollLeft(origin: HTMLElement, scrollLeft: number) {
    bypassSet.clear();
    for (const elem of elements) {
      if (elem === origin) {
        continue;
      }
      elem.scrollLeft = scrollLeft;
      bypassSet.add(elem);
    }
  }

  const subscription = new Subscription();

  for (const ele of elements) {
    const listener = () => {
      if (bypassSet.has(ele)) {
        bypassSet.delete(ele);
        return;
      }
      const scrollLeft = ele.scrollLeft;
      publishScrollLeft(ele, scrollLeft);
      callback(scrollLeft);
    };
    ele.addEventListener('scroll', listener, { passive: true });
    subscription.add(() => ele.removeEventListener('scroll', listener));
  }

  return subscription;
};


