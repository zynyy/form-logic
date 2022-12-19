import {Cell, CellView, Edge} from "@antv/x6";

import {Dom} from "@antv/x6-common";
import {Options} from "@antv/x6/lib/graph/options";
import ValidateConnectionArgs = Options.ValidateConnectionArgs;

interface ValidateMagnetArgs {
  cell: Cell;
  view: CellView;
  magnet: Element;
  e: Dom.MouseDownEvent | Dom.MouseEnterEvent;
}

interface ValidateEdgeArgs {
  edge: Edge;
  type: Edge.TerminalType;
  previous: Edge.TerminalData;
}

type validateConnection = (args: ValidateConnectionArgs) => boolean;

type ValidateMagnet = (args: ValidateMagnetArgs) => boolean;

type ValidateEdge = (args: ValidateEdgeArgs) => boolean;

const connectionInOut = (args: ValidateConnectionArgs) => {
  const { sourceMagnet, targetMagnet } = args || {};

  // 只能从输出链接桩创建连接
  if (
    !sourceMagnet ||
    sourceMagnet.getAttribute("port-group")?.endsWith("In")
  ) {
    return false;
  }

  // 只能连接到输入链接桩
  if (
    !targetMagnet ||
    targetMagnet.getAttribute("port-group")?.endsWith("Out")
  ) {
    return false;
  }

  return true;
};

const magnetInOut = (args: ValidateMagnetArgs) => {
  const { magnet } = args || {};

  if (magnet.getAttribute("port-group")?.endsWith("Out")) {
    return true;
  }

  return false;
};

class ValidateGraph {
  private connectionRules: Map<string, validateConnection> = new Map();
  private magnetRules: Map<string, ValidateMagnet> = new Map();
  private edgeRules: Map<string, ValidateEdge> = new Map();

  constructor() {
    this.useConnectionRule("inOut", connectionInOut);
    this.useMagnetRule("inOut", magnetInOut);
  }

  useConnectionRule(rule: string, validate: validateConnection) {
    if (!this.connectionRules.has(rule)) {
      this.connectionRules.set(rule, validate);
    }
    return this;
  }

  useMagnetRule(rule: string, validate: ValidateMagnet) {
    if (!this.magnetRules.has(rule)) {
      this.magnetRules.set(rule, validate);
    }
    return this;
  }

  useEdgeRule(rule: string, validate: ValidateEdge) {
    if (!this.edgeRules.has(rule)) {
      this.edgeRules.set(rule, validate);
    }
    return this;
  }

  private getConnectionRule(rule: string) {
    return this.connectionRules.get(rule);
  }

  private getMagnetRule(rule: string) {
    return this.magnetRules.get(rule);
  }

  private getEdgeRule(rule: string) {
    return this.edgeRules.get(rule);
  }

  validateConnection = (args: ValidateConnectionArgs) => {
    const { targetCell } = args || {};

    const { validateRules } = targetCell?.getData()|| {};

    const fail = Object.keys(validateRules).filter((key) => {
      const rule = this.getConnectionRule(key);
      if (rule) {
        return !rule(args);
      }

      console.warn(`connection规则:${key}未实现`);

      return false;
    });

    return !fail.length;
  };

  validateMagnet = (args: ValidateMagnetArgs) => {
    const { cell } = args || {};

    const { validateRules } = cell?.getData() || {};

    const fail = Object.keys(validateRules).filter((key) => {
      const rule = this.getMagnetRule(key);
      if (rule) {
        return !rule(args);
      }
      console.warn(`magnet规则:${key}未实现`);

      return false;
    });

    return !fail.length;
  };

  validateEdge = (args: ValidateEdgeArgs) => {
    const { validateEdges } = args.edge?.getData() || {};

    const fail = Object.keys(validateEdges || {}).filter((key) => {
      const rule = this.getEdgeRule(key);
      if (rule) {
        return !rule(args);
      }
      console.warn(`edge规则:${key}未实现`);

      return false;
    });

    return !fail.length;
  };
}

const validateGraph = new ValidateGraph();

export default validateGraph;
