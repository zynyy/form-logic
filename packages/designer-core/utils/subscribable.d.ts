import { IEngineContext } from '@/interface';
declare const UNSUBSCRIBE_ID_SYMBOL: unique symbol;
export type ISubscriber<Payload = any> = (e: Payload, context: IEngineContext) => void | boolean;
export declare class Subscribable<ExtendsType = any> {
    private subscribers;
    dispatch<T extends ExtendsType = any>(event: T, context?: any): boolean;
    subscribe(subscriber: ISubscriber): {
        (): void;
        [UNSUBSCRIBE_ID_SYMBOL]: number;
    };
    unsubscribe: (id?: number | string | (() => void)) => void;
}
export {};
