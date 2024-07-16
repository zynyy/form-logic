export interface EdgeCell {
  cell: string;
  port: string;
}

export interface CellData {
  configValues?: {
    value: any;
  };
}
export interface LogicFlowChartNode {
  shape: string;
  id: string;
  data?: CellData;
}

export interface LogicFlowChartCell extends LogicFlowChartNode {
  source?: EdgeCell;
  target?: EdgeCell;
}
