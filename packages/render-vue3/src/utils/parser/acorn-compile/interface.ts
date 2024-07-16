import { AnyNode } from 'acorn';

export type EvaluateNode = (node: AnyNode | undefined | null) => any;
export type EvaluateArray = (common: any[]) => any;

export type isPromise = (val: any) => boolean;

export type when = (value: any, gotValue: (...args: any[]) => any) => any;

export type AcornCompileNode = (ast: any, utils: AcornCompileUtils) => any;

export interface AcornCompileUtils {
  evaluateNode: EvaluateNode;
  evaluateArray: EvaluateArray;
  isPromise: isPromise;
  when: when;
}
