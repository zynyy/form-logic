import { IEngineContext } from '@/interface';

import { isFn } from './types';

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL');

export type ISubscriber<Payload = any> = (e: Payload, context: IEngineContext) => void | boolean;

export class Subscribable<ExtendsType = any> {
  private subscribers: {
    index: number;
    [key: number]: ISubscriber;
  } = {
    index: 0,
  };

  dispatch<T extends ExtendsType = any>(event: T, context?: any) {
    let interrupted = false;
    for (const key in this.subscribers) {
      if (isFn(this.subscribers[key])) {
        if (this.subscribers[key](event, context) === false) {
          interrupted = true;
        }
      }
    }
    return !interrupted;
  }

  subscribe(subscriber: ISubscriber) {
    let id: number;
    if (isFn(subscriber)) {
      id = this.subscribers.index + 1;
      this.subscribers[id] = subscriber;
      this.subscribers.index = id;
    }

    const unsubscribe = () => {
      this.unsubscribe(id);
    };
    // @ts-ignore
    unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id;

    return unsubscribe;
  }

  unsubscribe = (id?: number | string | (() => void)) => {
    if (id === undefined || id === null) {
      for (const key in this.subscribers) {
        this.unsubscribe(key);
      }
      return;
    }
    if (!isFn(id)) {
      // @ts-ignore
      delete this.subscribers[id];
    } else {
      // @ts-ignore
      const index = id[UNSUBSCRIBE_ID_SYMBOL];
      delete this.subscribers[index];
    }
  };
}
