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
  private context = {};
  private payload = {};
  private lastResult;

  constructor(opts: LogicContextOptions) {
    this.init(opts);
  }

  init = (opts) => {
    const { payload } = opts;
    this.currentNode = null;
    this.context = {};
    this.payload = Object.freeze(payload);
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

  getContext = () => {
    return this.context;
  };

  setContext = (data) => {
    Object.keys(data || {}).forEach((key) => {
      this.context[key] = data[key];
    });
  };

  funcCtx = () => {
    return Object.freeze({
      lastResult: this.lastResult,
      payload: this.payload,
      currentNode: this.currentNode,
    });
  };
}

export default LogicContext;
