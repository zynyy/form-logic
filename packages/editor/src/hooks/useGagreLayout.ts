import dagre from 'dagre';
import { Edge, Graph, Node } from '@antv/x6';

export const useGagreLayout = (graph: Graph) => {
  // 自动布局
  const layout = () => {
    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    const g = new dagre.graphlib.Graph();

    g.setGraph({ rankdir: 'LR', nodesep: 16, ranksep: 16 });
    g.setDefaultEdgeLabel(() => ({}));

    const width = 360;
    const height = 100;
    nodes.forEach((node: Node) => {
      g.setNode(node.id, { width, height });
    });

    edges.forEach((edge: Edge) => {
      const source = edge.getSource();
      const target = edge.getTarget();

      if ('cell' in source && 'cell' in target) {
        g.setEdge(source.cell, target.cell);
      }
    });

    dagre.layout(g);

    g.nodes().forEach((id) => {
      const node = graph.getCellById(id) as Node;
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
  };

  return [layout]

};
