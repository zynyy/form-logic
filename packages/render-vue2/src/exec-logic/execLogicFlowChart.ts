import { LogicFlowChartCell, LogicFlowChartNode } from '@/exec-logic/interface';
import { ExecInfo } from '@/interface';
import Context, { LogicContextOptions, Payload } from './context';

export interface ExecLogicOptions {
  dsl: {
    code: string;
    cells: LogicFlowChartCell[];
  };
  nodeFns: any;
}

class ExecLogic {
  private options: ExecLogicOptions;

  private ctx: Context | undefined;

  private readonly payload: Payload;

  private readonly callback;

  constructor(options: ExecLogicOptions, payload: Payload, callback?: (val: any) => void) {
    this.options = options;
    this.payload = payload || ({} as Payload);
    this.callback = callback;
  }

  get dsl() {
    return this.options.dsl;
  }

  get dslCode() {
    return this.options.dsl.code;
  }

  get nodeFns() {
    return this.options.nodeFns;
  }

  get cells() {
    return this.dsl.cells;
  }

  get edges() {
    return this.cells.filter((cell: LogicFlowChartCell) => cell.shape === 'edge');
  }

  get nodes() {
    return this.cells.filter((cell: LogicFlowChartCell) => cell.shape !== 'edge');
  }

  get startNode() {
    return this.cells.find((cell: LogicFlowChartCell) => cell.id.startsWith('start-'));
  }

  get endNode() {
    return this.cells.find((cell: LogicFlowChartCell) => cell.id.startsWith('end-'));
  }

  createCtx = (opts: LogicContextOptions) => {
    return new Context(opts);
  };

  getNextNodes = (curNode: LogicFlowChartCell) => {
    const { id } = curNode || {};

    const nextCellId = this.cells
      .filter((item) => {
        const { source } = item || {};
        return source?.cell === id;
      })
      .map((item) => {
        return item.target?.cell;
      });

    return nextCellId
      .map((id) => {
        return this.cells.find((cur: any) => id && cur.id === id);
      })
      .filter((val: any) => val);
  };

  edgeTip = (edgeValue: string | number) => {
    console.error(
      `执行流程编码: ${this.dslCode} 无法找到边值为 ${edgeValue} 的下一个节点`,
      `有效边值是 ${Array.from(new Set(this.edges.map((item) => item.data?.configValues?.value)))
        .filter((val) => val)
        .join(' 、')}`,
    );
  };

  execNextNode = async (nextEdge?: string | number, prevNodeValue?: any) => {
    const isTrue = nextEdge && nextEdge !== 0;

    const edges = this.edges.filter((item) => {
      const { data } = item || {};

      const { configValues } = data || {};

      return isTrue && configValues ? configValues.value === nextEdge : true;
    });

    if (isTrue && !edges.length) {
      this.edgeTip(nextEdge);
    }

    for (const edge of edges) {
      const { target } = edge || {};

      const { cell } = target || {};

      const node = this.cells.find((item) => item.id === cell);

      if (node) {
        await this.execNode(node, prevNodeValue);
      }
    }
  };

  execNode = async (curNode: LogicFlowChartNode, prevResult?: any) => {
    try {
      const nextNodes = this.getNextNodes(curNode);

      if (this.ctx) {
        this.ctx.setLastResult(prevResult);
        this.ctx.setCurrentNode(curNode);
        this.ctx.setNextNode(nextNodes as LogicFlowChartCell[]);
      }

      const fn = this.nodeFns[curNode.id];
      const curResult = await fn(this.ctx?.funcCtx(), this.execNextNode);

      const { noExecNextNode, nextEdge } = curResult || {};

      if (nextNodes.length) {
        if (!noExecNextNode) {
          const nextEndNode = nextNodes.filter((cur) => cur && cur.id.startsWith('end'));

          const isTrue =
            nextEdge && nextEdge !== 0 && !(nextEndNode.length === 1 && nextNodes.length === 1);

          const execNextNodes = isTrue
            ? nextNodes.filter((node) => {
                if (node) {
                  return this.edges.find((item) => {
                    const { target, data } = item || {};
                    const { configValues } = data || {};
                    return target?.cell === node.id && configValues?.value === nextEdge;
                  });
                }

                return false;
              })
            : nextNodes;

          if (isTrue && !execNextNodes.length && nextNodes.length !== nextEndNode.length) {
            this.edgeTip(nextEdge);
          }

          for (const node of execNextNodes) {
            if (node) {
              await this.execNode(node, curResult);
            }
          }
        }
      } else {
        if (curNode.id === this.endNode?.id) {
          this.callback?.(curResult);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  run = async (execInfo: ExecInfo) => {
    const curNode = this.startNode;
    if (!curNode) {
      return Promise.reject(new Error(`执行失败无法找到开始节点`));
    }

    this.ctx = this.createCtx({ payload: this.payload, execInfo });

    await this.execNode(curNode);
  };
}

export default ExecLogic;
