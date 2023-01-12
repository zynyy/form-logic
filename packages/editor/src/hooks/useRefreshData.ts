import { Graph } from '@antv/x6';
import { useCallback, useEffect, useState } from 'react';
import { EffectHookDataItem, LogicProcessItem, PageDataSourceItem } from '@/interface';
import { modelLogicList } from '@/service';

const PAGE_DATA = 'pageData:data';
const GET_PAGE_DATA = 'pageData:getData';

const EFFECT_HOOK = 'effectHook:data';
const GET_EFFECT_HOOK = 'effectHook:getData';

const LOGIC_PROCESS = 'LogicProcess:data';
const GET_LOGIC_PROCESS = 'LogicProcess:getData';

const useRefreshData = <T = any>(
  graph: Graph,
  triggerEvent: string,
  onEvent: string,
): [T[], () => void] => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  const refreshData = useCallback(() => {
    graph.trigger(triggerEvent);
  }, []);

  useEffect(() => {
    window.requestIdleCallback(() => {
      graph.trigger(triggerEvent);
    });

    graph.on(onEvent, (data: any) => {
      setDataSource(data);
    });
  }, []);

  return [dataSource, refreshData];
};

export const useRefreshLogicProcess = (graph: any) => {
  return useRefreshData<LogicProcessItem>(graph, GET_LOGIC_PROCESS, LOGIC_PROCESS);
};

export const useRefreshEffectHook = (graph: any) => {
  return useRefreshData<EffectHookDataItem>(graph, GET_EFFECT_HOOK, EFFECT_HOOK);
};

export const useRefreshPageData = (graph: any) => {
  return useRefreshData<PageDataSourceItem>(graph, GET_PAGE_DATA, PAGE_DATA);
};

export const useEmitPageData = (graph: Graph, pageDataSource: PageDataSourceItem[]) => {
  useEffect(() => {
    if (graph) {
      graph.trigger(PAGE_DATA, pageDataSource);

      graph.on(GET_PAGE_DATA, () => {
        graph.trigger(PAGE_DATA, pageDataSource);
      });
    }
    return () => {
      graph?.off(GET_PAGE_DATA);
    };
  }, [graph, pageDataSource]);
};


export const useEmitEffectHook = (graph: Graph, effectHook: EffectHookDataItem[]) => {
  useEffect(() => {
    if (graph) {
      graph.trigger(EFFECT_HOOK, effectHook);

      graph.on(GET_EFFECT_HOOK, () => {
        graph.trigger(EFFECT_HOOK, effectHook);
      });
    }
    return () => {
      graph?.off(GET_EFFECT_HOOK);
    };
  }, [graph, effectHook]);
};


export const useEmitLogicProcess = (graph: Graph, modelCode: string) => {
  const [logicList, setLogicList] = useState([]);

  useEffect(() => {
    if (modelCode) {
      modelLogicList({ model: modelCode }).then((res) => {
        const { data } = res;
        setLogicList(data);
      });
    }
  }, []);

  useEffect(() => {
    if (graph) {
      graph.trigger(LOGIC_PROCESS, logicList);

      graph.on(GET_LOGIC_PROCESS, () => {
        graph.trigger(LOGIC_PROCESS, logicList);
      });
    }
    return () => {
      graph?.off(GET_LOGIC_PROCESS);
    };
  }, [graph, logicList]);
};
