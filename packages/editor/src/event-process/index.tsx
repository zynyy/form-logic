import { Graph, Cell, Node, Edge } from '@antv/x6';
import { useState, useEffect, useRef } from 'react';

import { Button, Card, message, Spin } from 'antd';

import dagre from 'dagre';
import { useEmitElementEvent, useEmitEventProcess, useEmitPageElement } from '@/hooks';
import { requestPost } from '@/utils/request';

Graph.registerEdge(
  'process-edge',
  {
    zIndex: -1,
    attrs: {
      line: {
        strokeWidth: 2,
        stroke: '#A2B1C3',
        sourceMarker: null,
        targetMarker: null,
      },
    },
  },
  true,
);

const EventProcessBind = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const graphRef = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [pageCode, setPageCode] = useState('');

  const updateGraph = (eventMap: any, code: string, name: string) => {
    const edges: Edge[] = [];

    const dataSource = Object.keys(eventMap).reduce((acc, key) => {
      return acc.concat(eventMap[key] || []);
    }, []);

    const pageElementNode = Array.from(
      new Set(
        dataSource.map((item: any) => {
          const { elementCode, elementTypeCode } = item || {};

          return elementCode && elementTypeCode ? `${elementCode}-${elementTypeCode}` : '';
        }),
      ),
    ).filter((val) => val);

    const nodes = pageElementNode.reduce(
      // @ts-ignore
      (acc, val: string) => {
        const data = dataSource.filter((item) => {
          const { elementCode, elementTypeCode } = item || {};
          return `${elementCode}-${elementTypeCode}` === val;
        });

        if (data.length) {
          const { elementCode, elementTypeCode } = data[0] || {};

          const pageElementNode = createPageElementNode(elementCode, elementTypeCode);

          edges.push(createEdge(acc[0], pageElementNode));

          const events = Array.from(
            new Set(
              data.map((item) => {
                const { eventName } = item;
                return eventName;
              }),
            ),
          ).filter((val) => val);

          const eventNodes = events.reduce((eventAcc, event) => {
            const eventNode = createElementEventNode(event);

            edges.push(createEdge(pageElementNode, eventNode));

            const processNodes = data
              .filter((item: any) => item.eventName === event)
              .map((item: any) => {
                const processNode = createEventProcessNode(item.imoveProcessCode);
                edges.push(createEdge(eventNode, processNode));

                return processNode;
              });
            // @ts-ignore
            return eventAcc.concat(eventNode).concat(processNodes);
          }, []);

          return acc.concat(pageElementNode).concat(eventNodes);
        }
      },
      [createModelPageNode(code, name)],
    );

    const graph = graphRef.current;
    graph.freeze();
    // @ts-ignore
    graph.resetCells(nodes.concat(edges));

    layout();
  };

  useEmitPageElement({
    pageCode,
    graphRef,
    updateGraph,
  });

  useEmitElementEvent(graphRef);

  useEmitEventProcess(graphRef);

  useEffect(() => {
    initTreeGraph();
  }, []);

  // 自动布局
  const layout = () => {
    const graph = graphRef.current;

    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    const g = new dagre.graphlib.Graph();

    g.setGraph({ rankdir: 'LR', nodesep: 16, ranksep: 16 });
    g.setDefaultEdgeLabel(() => ({}));

    const width = 260;
    const height = 90;
    nodes.forEach((node: Node) => {
      g.setNode(node.id, { width, height });
    });

    edges.forEach((edge: Edge) => {
      const source = edge.getSource();
      const target = edge.getTarget();
      // @ts-ignore
      g.setEdge(source?.cell, target?.cell);
    });

    dagre.layout(g);

    graph.freeze();

    g.nodes().forEach((id) => {
      const node = graph.getCell(id) as Node;
      if (node) {
        const pos = g.node(id);
        node.position(pos.x, pos.y);
      }
    });

    edges.forEach((edge: Edge) => {
      const source = edge.getSourceNode()!;
      const target = edge.getTargetNode()!;
      const sourceBBox = source.getBBox();
      const targetBBox = target.getBBox();

      if (sourceBBox.y !== targetBBox.y) {
        const gap = targetBBox.x - sourceBBox.x - sourceBBox.width;
        const fix = sourceBBox.width;
        const x = sourceBBox.x + fix + gap / 2;
        edge.setVertices([
          { x, y: sourceBBox.center.y },
          { x, y: targetBBox.center.y },
        ]);
      } else {
        edge.setVertices([]);
      }
    });

    graph.unfreeze();
  };

  const createEdge = (source: Cell, target: Cell) => {
    const graph = graphRef.current;
    return graph.createEdge({
      shape: 'process-edge',
      source: { cell: source.id },
      target: { cell: target.id },
    });
  };

  const createModelPageNode = (pageCode: string, pageName: string, disabled?: boolean) => {
    const graph = graphRef.current;
    return graph.createNode({
      width: 200,
      height: 80,
      shape: 'model-page-select-art-table',
      data: {
        pageCode,
        pageName,
        disabled,
      },
    });
  };

  const createPageElementNode = (elementCode?: string, elementTypeCode?: string) => {
    const graph = graphRef.current;
    return graph.createNode({
      width: 200,
      height: 80,
      shape: 'page-element-select',
      data: {
        elementCode,
        elementTypeCode,
      },
    });
  };

  const createElementEventNode = (eventName?: string) => {
    const graph = graphRef.current;
    return graph.createNode({
      width: 200,
      height: 80,
      shape: 'element-event-select',
      data: {
        eventName: eventName || 'onFieldChange',
      },
    });
  };

  const createEventProcessNode = (logicProcessCode?: string) => {
    const graph = graphRef.current;
    return graph.createNode({
      width: 200,
      height: 80,
      shape: 'event-process-select',
      data: { logicProcessCode },
    });
  };

  const setup = () => {
    const graph = graphRef.current;

    graph.on('modelPageChange', ({ value }: any) => {
      setPageCode(value);

      // graph.resetCells([createModelPageNode(value)]);
    });

    graph.on('node:addPageElement', ({ e, node }: any) => {
      e.stopPropagation();
      const member = createPageElementNode();
      graph.freeze();
      graph.addCell([member, createEdge(node, member)]);

      layout();
    });

    graph.on('node:addElementEvent', ({ e, node }: any) => {
      e.stopPropagation();
      const member = createElementEventNode();
      graph.freeze();
      graph.addCell([member, createEdge(node, member)]);

      layout();
    });

    graph.on('node:addEventProcess', ({ e, node }: any) => {
      e.stopPropagation();
      const member = createEventProcessNode();
      graph.freeze();
      graph.addCell([member, createEdge(node, member)]);

      layout();
    });

    graph.on('node:delete', ({ e, node }: any) => {
      e?.stopPropagation();
      graph.freeze();

      const leafNodes = graph.getNeighbors(node, {
        outgoing: true,
      });

      leafNodes.forEach((leafNode: Node) => {
        graph
          .getNeighbors(leafNode, {
            outgoing: true,
          })
          .forEach((cellNode: Node) => {
            graph.removeCell(cellNode);
          });

        graph.removeCell(leafNode);
      });

      graph.removeCell(node);
      layout();
    });
  };

  const initTreeGraph = () => {
    if (chartContainerRef.current) {
      const graph = new Graph({
        container: chartContainerRef.current,
        interacting: false,
        grid: true,
      });

      graphRef.current = graph;

      graph.resetCells([createModelPageNode('', '')]);
      layout();
      graph.zoomTo(0.8);
      graph.centerContent();
      setup();
    }
  };

  const handleSubmit = () => {
    const nodes = graphRef.current.getNodes();

    const rootNode = nodes.find((node: Node) => graphRef.current.isRootNode(node));

    if (rootNode) {
      const pageElementNodes = graphRef.current.getNeighbors(rootNode);

      const data = pageElementNodes.reduce((acc: any[], pageNode: Node) => {
        const { elementCode, elementTypeCode } = pageNode.getData();

        const elementEventNodes = graphRef.current.getNeighbors(pageNode, {
          outgoing: true,
        });

        return acc.concat(
          elementEventNodes.reduce((total: any[], eventNode: Node) => {
            const { eventName } = eventNode.getData();

            const processNodes = graphRef.current.getNeighbors(eventNode, {
              outgoing: true,
            });

            return total.concat(
              processNodes.map((node: Node) => {
                const { imoveProcessCode } = node.getData();

                return {
                  elementCode,
                  elementTypeCode,
                  eventName,
                  imoveProcessCode,
                };
              }),
            );
          }, []),
        );
      }, []);

      const { pageName, pageCode } = rootNode.getData();

      const params = {
        pageCode: '',
        bsPageCode: pageCode,
        bsPageCodeName: pageName,
        bsPageDatas: data.filter((item: any) => {
          const { elementCode, elementTypeCode, eventName, imoveProcessCode } = item;
          return elementCode && elementTypeCode && eventName && imoveProcessCode;
        }),
      };

      setLoading(true);
      requestPost('/', params)
        .then((res: any) => {
          if (res.success) {
            message.success('成功').then(() => void 0);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Spin spinning={loading}>
      <Card extra={<Button onClick={handleSubmit}>保存</Button>}>
        <div
          id="chartContainer"
          style={{ position: 'relative', height: 500 }}
          ref={chartContainerRef}
        />
      </Card>
    </Spin>
  );
};

export default EventProcessBind;
