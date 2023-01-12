import { Field, Form } from '@formily/core';

interface LogicContextOptions {
  payload: {
    form: Form;
    field: Field;
  };
}

class LogicContext {
  private currentNode = null;
  private prevNode = null;
  private nextNodes = [];
  private payload = {};
  private execInfo = {};
  private lastResult;

  constructor(opts: LogicContextOptions) {
    this.init(opts);
  }

  init = (opts) => {
    const { payload, execInfo } = opts;
    this.currentNode = null;
    this.payload = Object.freeze(payload);
    this.execInfo = Object.freeze(execInfo);
  };

  setLastResult = (lastResult) => {
    this.lastResult = lastResult;
  };

  setCurrentNode = (node) => {
    this.currentNode = node;
  };

  setNextNode = (nextNodes) => {
    this.nextNodes = nextNodes;
  };

  get getNodeData() {
    return this.currentNode.data;
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
