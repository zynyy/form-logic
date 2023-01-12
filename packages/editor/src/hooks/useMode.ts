import { ChartPattern, ChartPatternType, CreateOptionsArgs, LogicItem } from '@/interface';
import { useMemo } from 'react';
import { Graph } from '@antv/x6';
import { useLogicCreateNode } from '@/hooks/useLogicCreateNode';
import { EFFECT_MODE, FIELD_MODE, GRID_MODE, LOGIC_MODE } from '@/utils/constant';
import { useChartLayoutContext } from '@/components/chart-layout/hook';

export const useMode = () => {
  const { pattern, mode } = useChartLayoutContext();

  const isEditable = useMemo(() => {
    return pattern ? pattern === ChartPattern.EDITABLE : true;
  }, [pattern]);

  const isDetail = useMemo(() => {
    return pattern ? pattern === ChartPattern.DETAIL : false;
  }, [pattern]);

  const isFieldMode = useMemo(() => {
    return mode === FIELD_MODE;
  }, [mode]);

  const isLogicMode = useMemo(() => {
    return mode === LOGIC_MODE;
  }, [mode]);

  const isEffectHookMode = useMemo(() => {
    return mode === EFFECT_MODE;
  }, [mode]);

  const isGridMode = useMemo(() => {
    return mode === GRID_MODE;
  }, [mode]);

  return {
    isEditable,
    isDetail,
    isFieldMode,
    isLogicMode,
    isEffectHookMode,
    isGridMode,
  };
};

export const useLogicEffectHookModeData = (
  graph: Graph,
  pageCode: string,
  createOptions: CreateOptionsArgs,
  pattern: ChartPatternType,
) => {
  const {
    createLogicProcessNode,
    createEffectHookNode,
    createPageDataNode,
    createEdge,
    createModelPageNode,
    createLaneNode,
  } = useLogicCreateNode(graph, createOptions?.defaultEffectHook);

  const uniqueData = (data: string[]) => {
    return Array.from(new Set(data)).filter((val) => val);
  };

  const transformField = (dataSource: LogicItem[]) => {
    const edges = [];

    const pageNode = createModelPageNode(pageCode);

    const pageFieldNode = uniqueData(
      dataSource.map((item) => {
        const { fieldCode, fieldType } = item || {};
        return fieldCode && fieldType ? `${fieldCode}-${fieldType}` : '';
      }),
    );

    const nodes = pageFieldNode.reduce(
      (acc, pageField: string) => {
        const data = dataSource.filter((item) => {
          const { fieldCode, fieldType } = item || {};
          return `${fieldCode}-${fieldType}` === pageField;
        });

        if (data.length) {
          const { fieldCode, fieldType } = data[0] || {};

          const pageFieldNode = createPageDataNode(fieldCode, fieldType);

          edges.push(createEdge(acc[0], pageFieldNode));

          const effectHooks: string[] = uniqueData(
            data.map((item) => {
              const { effectHook } = item;
              return effectHook;
            }),
          );

          const effectHookNodes = effectHooks.reduce((effectHookAcc, effectHook) => {
            const effectHookNode = createEffectHookNode(effectHook);

            edges.push(createEdge(pageFieldNode, effectHookNode));

            const logicNodes = data
              .filter((item) => item.effectHook === effectHook)
              .map((item) => {
                const logicNode = createLogicProcessNode(item.logicCode);
                edges.push(createEdge(effectHookNode, logicNode));
                return logicNode;
              });

            return effectHookAcc.concat(effectHookNode).concat(logicNodes);
          }, []);

          return acc.concat(pageFieldNode).concat(effectHookNodes);
        }
      },
      [pageNode],
    );

    return [].concat(nodes).concat(edges);
  };

  const transformEffectHook = (dataSource: LogicItem[]) => {
    const edges = [];
    const pageNode = createModelPageNode(pageCode);
    const effectHooks: string[] = uniqueData(
      dataSource.map((item) => {
        const { effectHook } = item;
        return effectHook;
      }),
    );

    const nodes = effectHooks.reduce(
      (acc, effectHook: string) => {
        const data = dataSource.filter((item) => {
          return item.effectHook === effectHook;
        });

        const effectHookNode = createEffectHookNode(effectHook);

        edges.push(createEdge(acc[0], effectHookNode));

        const logicProcess = uniqueData(
          data.filter((item) => item.effectHook === effectHook).map((item) => item.logicCode),
        );

        const pageFieldNodes = logicProcess.reduce((pageFieldsAcc, logicCode) => {
          const logicNode = createLogicProcessNode(logicCode);
          edges.push(createEdge(effectHookNode, logicNode));

          const pageFieldNodes = uniqueData(
            data
              .filter((item) => item.logicCode == logicCode)
              .map((item) => {
                const { fieldCode, fieldType } = item || {};
                return fieldCode && fieldType ? `${fieldCode}-${fieldType}` : '';
              }),
          ).map((pageField) => {
            const [fieldCode, fieldType] = pageField.split('-') || [];

            const pageFieldNode = createPageDataNode(fieldCode, fieldType);

            edges.push(createEdge(logicNode, pageFieldNode));

            return pageFieldNode;
          });

          return pageFieldsAcc.concat(logicNode).concat(pageFieldNodes);
        }, []);

        return acc.concat(effectHookNode).concat(pageFieldNodes);
      },
      [pageNode],
    );

    return [].concat(nodes).concat(edges);
  };

  const transformLogic = (dataSource: LogicItem[]) => {
    const edges = [];
    const pageNode = createModelPageNode(pageCode);
    const logicCodes: string[] = uniqueData(
      dataSource.map((item) => {
        const { logicCode } = item;
        return logicCode;
      }),
    );

    const nodes = logicCodes.reduce(
      (acc, logicCode) => {
        const data = dataSource.filter((item) => {
          return item.logicCode === logicCode;
        });

        const logicNode = createLogicProcessNode(logicCode);

        edges.push(createEdge(acc[0], logicNode));

        const pageFields = uniqueData(
          data.map((item) => {
            const { fieldCode, fieldType } = item || {};

            return `${fieldCode}-${fieldType}`;
          }),
        );

        const effectHookNodes = pageFields.reduce((effectHookAcc, pageField) => {
          const [filedCode, filedType] = pageField.split('-') || [];
          const pageFieldNode = createPageDataNode(filedCode, filedType);
          edges.push(createEdge(logicNode, pageFieldNode));

          const effectHooks: string[] = uniqueData(
            data
              .filter((item) => {
                const { fieldCode, fieldType } = item || {};
                return `${fieldCode}-${fieldType}` === pageField;
              })
              .map((item) => {
                const { effectHook } = item;
                return effectHook;
              }),
          );

          const effectHookNodes = effectHooks.map((effectHook) => {
            const effectHookNode = createEffectHookNode(effectHook);

            edges.push(createEdge(pageFieldNode, effectHookNode));

            return effectHookNode;
          });

          return effectHookAcc.concat(pageFieldNode).concat(effectHookNodes);
        }, []);

        return acc.concat(logicNode).concat(effectHookNodes);
      },
      [pageNode],
    );

    return [].concat(nodes).concat(edges);
  };

  const transformGrid = (dataSource: LogicItem[]) => {
    const nodeDataSource = dataSource.length
      ? dataSource
      : [
          {
            fieldType: '',
            fieldCode: '',
            logicCode: '',
            effectHook: '',
          },
        ];

    const height = 32;

    const y = height + 5;
    const totalHeight = y * nodeDataSource.length + 50;

    const startX = 60;
    const startY = 60;

    const fieldStartX = startX + 300;
    const effectStartX = fieldStartX + 300;
    const logicStartX = effectStartX + 300;

    const pageCodeParentNode = createLaneNode(
      {
        height: totalHeight,
        label: '页面编码',
        position: {
          x: startX,
          y: startY,
        },
      },
      'pageCodeParent',
    );

    const fieldParentNode = createLaneNode(
      {
        height: totalHeight,
        label: '页面字段',
        position: {
          x: fieldStartX,
          y: startY,
        },
      },
      'fieldParent',
    );

    const effectParentNode = createLaneNode(
      {
        height: totalHeight,
        label: '字段事件',
        position: {
          x: effectStartX,
          y: startY,
        },
      },
      'effectParent',
    );

    const logicParentNode = createLaneNode(
      {
        height: totalHeight,
        label: '逻辑流程',
        position: {
          x: logicStartX,
          y: startY,
        },
      },
      'logicParent',
    );

    const edges = [];

    const nodes = nodeDataSource.reduce((acc, item, index) => {
      const { fieldType, fieldCode, logicCode, effectHook } = item || {};

      const positionY = startY + index * y + 40;

      const pageNode = createModelPageNode(
        pageCode,
        {
          height,
          position: {
            x: startX,
            y: positionY,
          },
        },
        index,
      );

      const pageFieldNode = createPageDataNode(fieldCode, fieldType, {
        height,
        position: {
          x: fieldStartX,
          y: positionY,
        },
      });

      edges.push(createEdge(pageNode, pageFieldNode));

      const effectHookNode = createEffectHookNode(effectHook, {
        height,
        position: {
          x: effectStartX,
          y: positionY,
        },
      });

      edges.push(createEdge(pageFieldNode, effectHookNode));

      const logicNode = createLogicProcessNode(logicCode, {
        height,
        position: {
          x: logicStartX,
          y: positionY,
        },
      });

      edges.push(createEdge(effectHookNode, logicNode));

      return acc.concat([pageNode, pageFieldNode, effectHookNode, logicNode]);
    }, []);

    if (pattern === ChartPattern.DETAIL && !dataSource.length) {
      return []
        .concat([pageCodeParentNode, fieldParentNode, effectParentNode, logicParentNode])
        .concat(
          createModelPageNode(
            pageCode,
            {
              height,
              position: {
                x: startX,
                y: startY + 40,
              },
            },
            0,
          ),
        );
    }

    return []
      .concat([pageCodeParentNode, fieldParentNode, effectParentNode, logicParentNode])
      .concat(nodes)
      .concat(edges);
  };

  const transformModeData = (dataSource: LogicItem[], mode: string) => {
    switch (mode) {
      case FIELD_MODE: {
        return transformField(dataSource);
      }

      case LOGIC_MODE: {
        return transformLogic(dataSource);
      }
      case EFFECT_MODE: {
        return transformEffectHook(dataSource);
      }
      case GRID_MODE: {
        return transformGrid(dataSource);
      }
      default: {
        return [];
      }
    }
  };

  return {
    transformModeData,
  };
};
