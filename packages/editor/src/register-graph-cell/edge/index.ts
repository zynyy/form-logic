import {Edge, Shape} from "@antv/x6";
import {Cell} from "@antv/x6/lib/model";
import {CellView} from "@antv/x6/lib/view";
import {getGraphId} from "@/utils";

interface CreateEdgeArgs {
  sourceCell: Cell;
  sourceView: CellView;
  sourceMagnet: Element;
}

type GenerateEdge = (args: CreateEdgeArgs) => Edge;

const createNoEdge = () => {
  return new Shape.Edge({
    id: getGraphId("noEdge"),
    attrs: {
      line: {
        stroke: "#A2B1C3",
        strokeWidth: 2,
        targetMarker: {
          name: "block",
          width: 12,
          height: 8,
        },
      },
    },
    zIndex: 0,
    label: "否",
    data: {
      configValues: {
        label: "否",
        value: "NO",
      },
    },
  });
};

const createYesEdge = (args: CreateEdgeArgs) => {
  return new Shape.Edge({
    id: getGraphId("yesEdge"),
    attrs: {
      line: {
        stroke: "#A2B1C3",
        strokeWidth: 2,
        targetMarker: {
          name: "block",
          width: 12,
          height: 8,
        },
      },
    },
    zIndex: 0,
    label: "是",
    data: {
      configValues: {
        label: "是",
        value: "YES",
      },
    },
  });
};

class CreateEdge {
  private portEdges: Map<string, GenerateEdge> = new Map();

  constructor() {
    this.use("createNoEdge", createNoEdge).use("createYesEdge", createYesEdge);
  }

  use(portEdge: string, createPortEdge: GenerateEdge) {
    if (!this.portEdges.has(portEdge)) {
      this.portEdges.set(portEdge, createPortEdge);
    }
    return this;
  }

  defaultCreateEdge() {
    return new Shape.Edge({
      id: getGraphId("edge"),
      attrs: {
        line: {
          stroke: "#A2B1C3",
          strokeWidth: 2,
          targetMarker: {
            name: "block",
            width: 12,
            height: 8,
          },
        },
      },
      zIndex: 0,
      data: {
        settingConfig: "edge-config",
        configValues: {},
      },
    });
  }

  getPortEdge(portEdge: string) {
    if (!portEdge) {
      return this.defaultCreateEdge;
    }

    return this.portEdges.get(portEdge) || this.defaultCreateEdge;
  }

  create = (args: CreateEdgeArgs) => {
    const { sourceMagnet, sourceCell } = args || {};

    const portGroup = sourceMagnet.getAttribute("port-group") || "";
    const { createEdgeConfig } = sourceCell.getData();

    if (createEdgeConfig && portGroup) {
      const { portEdge } = createEdgeConfig[portGroup] || {};

      return this.getPortEdge(portEdge)(args);
    }

    return this.defaultCreateEdge();
  };
}

const createEdge = new CreateEdge();

export default createEdge;
