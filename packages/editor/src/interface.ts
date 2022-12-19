export interface FlowChartEditorContextType {
  processConfig?: {
    name?: string;
    code?: string;
    pageCode?: string;
    detailApi?: string;
    updateApi?: string;
  };
  monacoEditorLoaderConfig?: {
    paths?: {
      vs?: string;
    };
  };
}
