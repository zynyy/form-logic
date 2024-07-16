import { Field, Form } from '@formlogic/render-core-vue2';

import { LogicFlowChartNode } from '@/exec-logic/interface';

export interface Payload {
  form: Form;
  field: Field;
}

export interface LogicContextOptions {
  payload: Payload;
  execInfo?: Record<string, any>;
}

class LogicContext {
  private currentNode: LogicFlowChartNode | null = null;
  private prevNode: LogicFlowChartNode | null = null;
  private nextNodes: LogicFlowChartNode[] = [];
  private payload = {};
  private execInfo = {};
  private lastResult: any;

  constructor(opts: LogicContextOptions) {
    this.init(opts);
  }

  init = (opts: LogicContextOptions) => {
    const { payload, execInfo } = opts;
    this.currentNode = null;
    this.payload = Object.freeze(payload);
    this.execInfo = Object.freeze(execInfo ?? {});
  };

  setLastResult = (lastResult: any) => {
    this.lastResult = lastResult;
  };

  setCurrentNode = (node: LogicFlowChartNode) => {
    this.currentNode = node;
  };

  setNextNode = (nextNodes: LogicFlowChartNode[]) => {
    this.nextNodes = nextNodes;
  };

  get getNodeData() {
    return this.currentNode?.data;
  }

  getConfigValues = () => {
    return this.getNodeData?.configValues || {};
  };

  getPayload = () => {
    return this.payload;
  };

  getPrevNode = () => {
    return this.prevNode;
  };

  getNextNode = () => {
    return this.nextNodes;
  };

  funcCtx = () => {
    return Object.freeze({
      currentNode: this.currentNode,
      lastResult: this.lastResult,
      payload: this.payload,
      execInfo: this.execInfo,
    });
  };
}

export default LogicContext;
