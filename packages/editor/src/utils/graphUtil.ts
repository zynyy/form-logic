import { Cell, Graph } from '@antv/x6';
import { EFFECT_HOOK_NODE, LOGIC_PROCESS_NODE, PAGE_DATA_NODE } from '@/utils/constant';
import { LogicItem } from '@/interface';

export const getLogicEffectHookCellData = (cell: Cell) => {
  switch (cell.shape) {
    case PAGE_DATA_NODE: {
      const { fieldCode, fieldType } = cell.data;
      return {
        fieldCode,
        fieldType,
      };
    }

    case EFFECT_HOOK_NODE: {
      const { effectHook } = cell.data;
      return {
        effectHook,
      };
    }

    case LOGIC_PROCESS_NODE: {
      const { logicCode } = cell.data;
      return {
        logicCode,
      };
    }

    default: {
      return {};
    }
  }
};

export const getLogicEffectHookRootNode = (graph: Graph) => {
  if (graph) {
    const nodes = graph.getNodes();
    return nodes.find((node) => graph.isRootNode(node));
  }

  return undefined;
};

export const getLogicEffectHookData = (graph: Graph, filterData: boolean = true): LogicItem[] => {
  const dataSource = [];

  if (graph) {
    const nodes = graph.getNodes();
    const rootNodes = nodes.filter((node) => graph.isRootNode(node));

    if (rootNodes.length) {
      rootNodes.forEach((rootNode) => {
        const firstNodes = graph.getNeighbors(rootNode, {
          outgoing: true,
        });

        firstNodes.forEach((item) => {
          const firstData = getLogicEffectHookCellData(item);

          const secondNodes = graph.getNeighbors(item, {
            outgoing: true,
          });

          if (secondNodes.length) {
            secondNodes.forEach((cur) => {
              const secondData = getLogicEffectHookCellData(cur);

              const thirdNodes = graph.getNeighbors(cur, {
                outgoing: true,
              });

              if (thirdNodes.length) {
                thirdNodes.forEach((cell) => {
                  const thirdData = getLogicEffectHookCellData(cell);
                  dataSource.push({
                    ...firstData,
                    ...secondData,
                    ...thirdData,
                  });
                });
              } else {
                dataSource.push({
                  ...firstData,
                  ...secondData,
                });
              }
            });
          } else {
            dataSource.push({
              ...firstData,
            });
          }
        });
      });
    }
  }

  return filterData
    ? dataSource.filter((item) => {
        const { fieldCode, fieldType, effectHook, logicCode } = item || {};

        return fieldType && fieldCode && effectHook && logicCode;
      })
    : dataSource;
};
