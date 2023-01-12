import { Graph } from '@antv/x6';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import registerGraphNode from '@/register-graph-cell';
import createEdge from '@/register-graph-cell/edge';
import validateGraph from '@/utils/validateGraph';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Transform } from '@antv/x6-plugin-transform';
import { ChartPattern, ChartPatternType } from '@/interface';

export const useFlowChartGraph = (
  pattern: ChartPatternType,
  onGraphMount?: (graph: Graph) => void,
): [Graph, MutableRefObject<HTMLDivElement>] => {
  const graphDomRef = useRef<HTMLDivElement>(null);

  const [flowChart, setFlowChart] = useState<Graph>();

  const isEditable = pattern !== ChartPattern.DETAIL;

  useEffect(() => {
    if (graphDomRef.current) {
      registerGraphNode();

      const graph = new Graph({
        container: graphDomRef.current,
        autoResize: true,
        grid: true,
        interacting: isEditable,
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3,
        },
        connecting: {
          allowLoop: false,
          highlight: true,
          router: {
            name: 'manhattan',
            args: {
              padding: 1,
            },
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 8,
            },
          },
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 20,
          },
          createEdge: createEdge.create,
          validateMagnet: validateGraph.validateMagnet,
          validateConnection:
            pattern === ChartPattern.DETAIL
              ? () => {
                  return false;
                }
              : validateGraph.validateConnection,
          validateEdge: validateGraph.validateEdge,
        },

        highlighting: {
          magnetAvailable: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#5F95FF',
              },
            },
          },
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#5F95FF',
              },
            },
          },
        },
      });

      if (isEditable) {
        graph.use(
          new Transform({
            resizing: true,
            rotating: false,
          }),
        );
      }

      graph
        .use(
          new Scroller({
            enabled: true,
            autoResize: true,
          }),
        )
        .centerContent();

      setFlowChart(graph);
      onGraphMount?.(graph);
    }
  }, [pattern]);

  return [flowChart, graphDomRef];
};
