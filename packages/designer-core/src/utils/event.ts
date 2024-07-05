import { globalThisPolyfill } from './globalThisPolyfill';
import { ISubscriber, Subscribable } from './subscribable';
import { isArr, isWindow } from './types';

const ATTACHED_SYMBOL = Symbol('ATTACHED_SYMBOL');
const EVENTS_SYMBOL = Symbol('__EVENTS_SYMBOL__');
const EVENTS_ONCE_SYMBOL = Symbol('EVENTS_ONCE_SYMBOL');
const EVENTS_BATCH_SYMBOL = Symbol('EVENTS_BATCH_SYMBOL');
const DRIVER_INSTANCES_SYMBOL = Symbol('DRIVER_INSTANCES_SYMBOL');

export type EventOptions =
  | boolean
  | (AddEventListenerOptions &
      EventListenerOptions & {
        mode?: 'onlyOne' | 'onlyParent' | 'onlyChild';
      });

export type EventContainer = Window | HTMLElement | Document;

export type EventDriverContainer = HTMLElement | Document;

export interface IEventEffect<T> {
  (engine: T): void;
}

export interface IEventDriver {
  container: EventDriverContainer;
  contentWindow: Window;
  attach(container: EventDriverContainer): void;
  detach(container: EventDriverContainer): void;
  dispatch<T extends ICustomEvent<any> = any>(e: T): void | boolean;
  subscribe<T extends ICustomEvent<any> = any>(subscriber: ISubscriber<T>): void;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions,
  ): void;
  addEventListener(type: any, listener: any, options: any): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions,
  ): void;
  removeEventListener(type: any, listener: any, options?: any): void;
  batchAddEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions,
  ): void;
  batchAddEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions,
  ): void;
  batchAddEventListener(type: any, listener: any, options?: any): void;
  batchRemoveEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions,
  ): void;
  batchRemoveEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions,
  ): void;
  batchRemoveEventListener(type: any, listener: any, options: any): void;
}

export interface IEventDriverClass<T> {
  new (engine: T, context?: any): IEventDriver;
}

export interface ICustomEvent<EventData = any, EventContext = any> {
  type: string;
  data?: EventData;
  context?: EventContext;
}

export interface CustomEventClass {
  new (...args: any[]): any;
}

export interface IEventProps<T = Event> {
  drivers?: IEventDriverClass<T>[];
  effects?: IEventEffect<T>[];
}

const isOnlyMode = (mode: string) =>
  mode === 'onlyOne' || mode === 'onlyChild' || mode === 'onlyParent';
/**
 * 事件驱动器基类
 */
export class EventDriver<Engine extends Event = Event, Context = any> implements IEventDriver {
  engine: Engine;

  container: EventDriverContainer = document;

  contentWindow: Window = globalThisPolyfill;

  context: Context | undefined;

  constructor(engine: Engine, context?: Context) {
    this.engine = engine;
    this.context = context;
  }

  dispatch<T extends ICustomEvent<any> = any>(event: T) {
    return this.engine.dispatch(event, this.context);
  }

  subscribe<T extends ICustomEvent<any> = any>(subscriber: ISubscriber<T>) {
    return this.engine.subscribe(subscriber);
  }

  subscribeTo<T extends CustomEventClass>(type: T, subscriber: ISubscriber<InstanceType<T>>) {
    return this.engine.subscribeTo(type, subscriber);
  }

  subscribeWith<T extends ICustomEvent = ICustomEvent>(
    type: string | string[],
    subscriber: ISubscriber<T>,
  ) {
    return this.engine.subscribeWith(type, subscriber);
  }

  attach(container: EventDriverContainer) {
    console.error('attach must implement.');
  }

  detach(container: EventDriverContainer) {
    console.error('attach must implement.');
  }

  eventTarget(type: string) {
    if (type === 'resize' || type === 'scroll') {
      if (this.container === this.contentWindow?.document) {
        return this.contentWindow;
      }
    }
    return this.container;
  }

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions,
  ): void;
  addEventListener(type: any, listener: any, options: any) {
    const target = this.eventTarget(type);
    if (isOnlyMode(options?.mode)) {
      // @ts-ignore
      target[EVENTS_ONCE_SYMBOL] = target[EVENTS_ONCE_SYMBOL] || {};
      const constructor = this['constructor'];
      // @ts-ignore
      constructor[EVENTS_ONCE_SYMBOL] = constructor[EVENTS_ONCE_SYMBOL] || {};
      // @ts-ignore
      const handler = target[EVENTS_ONCE_SYMBOL][type];
      // @ts-ignore
      const container = constructor[EVENTS_ONCE_SYMBOL][type];
      if (!handler) {
        if (container) {
          if (options.mode === 'onlyChild') {
            if (container.contains(target)) {
              container.removeEventListener(type, container[EVENTS_ONCE_SYMBOL][type], options);
              delete container[EVENTS_ONCE_SYMBOL][type];
            }
          } else if (options.mode === 'onlyParent') {
            if (container.contains(target)) return;
          }
        }
        target.addEventListener(type, listener, options);
        // @ts-ignore
        target[EVENTS_ONCE_SYMBOL][type] = listener;
        // @ts-ignore
        constructor[EVENTS_ONCE_SYMBOL][type] = target;
      }
    } else {
      // @ts-ignore
      target[EVENTS_SYMBOL] = target[EVENTS_SYMBOL] || {};
      // @ts-ignore
      target[EVENTS_SYMBOL][type] = target[EVENTS_SYMBOL][type] || new Map();
      // @ts-ignore
      if (!target[EVENTS_SYMBOL][type]?.get?.(listener)) {
        target.addEventListener(type, listener, options);
        // @ts-ignore
        target[EVENTS_SYMBOL][type]?.set?.(listener, true);
      }
    }
  }

  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions,
  ): void;
  removeEventListener(type: any, listener: any, options?: any) {
    const target = this.eventTarget(type);
    if (isOnlyMode(options?.mode)) {
      const constructor = this['constructor'];
      // @ts-ignore
      constructor[EVENTS_ONCE_SYMBOL] = constructor[EVENTS_ONCE_SYMBOL] || {};
      // @ts-ignore
      target[EVENTS_ONCE_SYMBOL] = target[EVENTS_ONCE_SYMBOL] || {};
      // @ts-ignore
      delete constructor[EVENTS_ONCE_SYMBOL][type];
      // @ts-ignore
      delete target[EVENTS_ONCE_SYMBOL][type];
      target.removeEventListener(type, listener, options);
    } else {
      // @ts-ignore
      target[EVENTS_SYMBOL] = target[EVENTS_SYMBOL] || {};
      // @ts-ignore
      target[EVENTS_SYMBOL][type] = target[EVENTS_SYMBOL][type] || new Map();
      // @ts-ignore
      target[EVENTS_SYMBOL][type]?.delete?.(listener);
      target.removeEventListener(type, listener, options);
    }
  }

  batchAddEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions,
  ): void;
  batchAddEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions,
  ): void;
  batchAddEventListener(type: any, listener: any, options?: any) {
    // @ts-ignore
    this.engine[DRIVER_INSTANCES_SYMBOL] = this.engine[DRIVER_INSTANCES_SYMBOL] || [];
    // @ts-ignore
    if (!this.engine[DRIVER_INSTANCES_SYMBOL].includes(this)) {
      // @ts-ignore
      this.engine[DRIVER_INSTANCES_SYMBOL].push(this);
    }
    // @ts-ignore
    this.engine[DRIVER_INSTANCES_SYMBOL].forEach((driver) => {
      const target = driver.eventTarget(type);
      target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {};
      if (!target[EVENTS_BATCH_SYMBOL][type]) {
        target.addEventListener(type, listener, options);
        target[EVENTS_BATCH_SYMBOL][type] = listener;
      }
    });
  }

  batchRemoveEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions,
  ): void;
  batchRemoveEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions,
  ): void;
  batchRemoveEventListener(type: any, listener: any, options: any) {
    // @ts-ignore
    this.engine[DRIVER_INSTANCES_SYMBOL] = this.engine[DRIVER_INSTANCES_SYMBOL] || [];
    // @ts-ignore
    this.engine[DRIVER_INSTANCES_SYMBOL].forEach((driver) => {
      const target = driver.eventTarget(type);
      target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {};
      target.removeEventListener(type, listener, options);
      delete target[EVENTS_BATCH_SYMBOL][type];
    });
  }
}
/**
 * 事件引擎
 */
export class Event extends Subscribable<ICustomEvent<any>> {
  private drivers: IEventDriverClass<any>[] = [];
  private containers: EventContainer[] = [];
  constructor(props?: IEventProps) {
    super();

    if (props) {
      if (isArr(props?.effects)) {
        props.effects.forEach((plugin) => {
          plugin(this);
        });
      }
      if (isArr(props?.drivers)) {
        this.drivers = props.drivers;
      }
    }
  }

  subscribeTo<T extends CustomEventClass>(type: T, subscriber: ISubscriber<InstanceType<T>>) {
    return this.subscribe((event, context) => {
      if (type && event instanceof type) {
        return subscriber(event, context);
      }
    });
  }

  subscribeWith<T extends ICustomEvent = ICustomEvent>(
    type: string | string[],
    subscriber: ISubscriber<T>,
  ) {
    return this.subscribe((event, context) => {
      if (isArr(type)) {
        if (type.includes(event?.type)) {
          return subscriber(event, context);
        }
      } else {
        if (type && event?.type === type) {
          return subscriber(event, context);
        }
      }
    });
  }

  attachEvents(
    container: EventContainer,
    contentWindow: Window = globalThisPolyfill,
    context?: any,
  ): void {
    if (!container) return;

    if (isWindow(container)) {
      return this.attachEvents(container.document, container, context);
    }

    // @ts-ignore
    if (container[ATTACHED_SYMBOL]) {
      return;
    }

    // @ts-ignore
    container[ATTACHED_SYMBOL] = this.drivers.map((EventDriver) => {
      const driver = new EventDriver(this, context);
      driver.contentWindow = contentWindow;
      driver.container = container;
      driver.attach(container);
      return driver;
    });

    if (!this.containers.includes(container)) {
      this.containers.push(container);
    }
  }

  detachEvents(container?: EventContainer): void {
    if (!container) {
      this.containers.forEach((container) => {
        this.detachEvents(container);
      });
      return;
    }
    if (isWindow(container)) {
      return this.detachEvents(container.document);
    }
    // @ts-ignore
    if (!container[ATTACHED_SYMBOL]) {
      return;
    }
    // @ts-ignore
    container[ATTACHED_SYMBOL].forEach((driver) => {
      driver.detach(container);
    });
    // @ts-ignore
    this[DRIVER_INSTANCES_SYMBOL] = this[DRIVER_INSTANCES_SYMBOL] || [];
    // @ts-ignore
    this[DRIVER_INSTANCES_SYMBOL] = this[DRIVER_INSTANCES_SYMBOL].reduce((drivers, driver) => {
      if (driver.container === container) {
        driver.detach(container);
        return drivers;
      }
      return drivers.concat(driver);
    }, []);
    this.containers = this.containers.filter((item) => item !== container);
    // @ts-ignore
    delete container[ATTACHED_SYMBOL];
    // @ts-ignore
    delete container[EVENTS_SYMBOL];
    // @ts-ignore
    delete container[EVENTS_ONCE_SYMBOL];
    // @ts-ignore
    delete container[EVENTS_BATCH_SYMBOL];
  }
}
