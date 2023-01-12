import { Graph } from '@antv/x6';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Scroller } from '@antv/x6-plugin-scroller';

export const useLogicEffectHookProcessChartGraph = (
  onGraphMount: (graph: Graph) => void,
): [Graph, MutableRefObject<HTMLDivElement>] => {
  const graphDomRef = useRef<HTMLDivElement>(null);

  const [graph, setGraph] = useState<Graph>();

  useEffect(() => {
    if (graphDomRef.current) {
      const newGraph = new Graph({
        container: graphDomRef.current,
        interacting: false,
        grid: true,

      });

      newGraph.use(
        new Scroller({
          enabled: true,
          autoResize: true,
        }),
      );

      setGraph(newGraph);
      onGraphMount?.(newGraph);
    }
  }, []);

  return [graph, graphDomRef];
};
