import { Point } from './coordinate';
export declare const calcElementOuterWidth: (innerWidth: number, style: CSSStyleDeclaration) => number;
export declare const calcElementLayout: (element: HTMLElement | undefined) => "vertical" | "horizontal";
export declare const calcElementTranslate: (element: HTMLElement) => Point;
export declare const calcElementRotate: (element: HTMLElement) => number;
export declare const calcElementScale: (element: HTMLElement) => number;
