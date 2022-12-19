import { useRef, useState, useEffect, RefObject, useCallback } from 'react';

import { Graph, Node } from '@antv/x6';
import { getLogicDetail, getPageConfigDetail } from '@/service';
import { toArray } from '@/utils';

import { notification } from 'antd';

export const useOpen = (): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(() => {
    return false;
  });

  const show = () => {
    setOpen(true);
  };

  const hidden = () => {
    setOpen(false);
  };

  return [open, show, hidden];
};

const PAGE_ELEMENT = 'pageElement:data';
const GET_PAGE_ELEMENT = 'pageElement:getData';

const ELEMENT_EVENT = 'elementEvent:data';
const GET_ELEMENT_EVENT = 'elementEvent:getData';

const EVENT_PROCESS = 'eventProcess:data';
const GET_EVENT_PROCESS = 'eventProcess:getData';

interface EmitPageElementArgs {
  pageCode: string;
  graphRef: RefObject<Graph>;
  tip?: boolean;
  updateGraph: (logicProcess, code, name) => void;
}

export const useEmitPageElement = ({
  pageCode,
  graphRef,
  tip,
  updateGraph,
}: EmitPageElementArgs) => {
  const pageElementRef = useRef<any[]>([]);
  const [pageElement, setPageElement] = useState<any[]>([]);

  useEffect(() => {
    if (pageCode) {
      getPageConfigDetail({
        pageCode,
      }).then((res) => {
        const { result: currentDetail } = res as any;

        const { eventMap } = currentDetail;

        const nowPages = toArray(currentDetail.pageDatas).map((item) => {
          const { key, type, label } = item || {};

          return {
            ...item,
            code: `${key}-${type}`,
            name: `${type}: ${key}-${label}`,
          };
        });
        pageElementRef.current = nowPages;

        setPageElement(nowPages);

        if (Object.keys(eventMap).length) {
          updateGraph?.(eventMap, pageCode, '');

          if (tip) {
            notification.warning({
              message: `${pageCode}`,
              description: '已存在流程',
              duration: 10,
            });
          }
        }
      });
    }
  }, [pageCode]);

  useEffect(() => {
    const graph = graphRef.current;
    if (graph) {
      // @ts-ignore
      graph.emit(PAGE_ELEMENT, pageElement);

      graph.on(GET_PAGE_ELEMENT, () => {
        // @ts-ignore
        graph.emit(PAGE_ELEMENT, pageElementRef.current);
      });
    }
  }, [pageElement]);

  return [pageElement, pageElementRef];
};

export const useEmitElementEvent = (graphRef: RefObject<any>) => {
  const elementEventRef = useRef<any[]>([]);
  const [elementEvent] = useState<any[]>([]);

  useEffect(() => {}, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (graph) {
      graph.emit(ELEMENT_EVENT, elementEvent);

      graph.on(GET_ELEMENT_EVENT, () => {
        graph.emit(ELEMENT_EVENT, elementEventRef.current);
      });
    }
  }, [elementEvent]);

  return [elementEvent, elementEventRef];
};

export const useEmitEventProcess = (graphRef: RefObject<any>) => {
  const eventProcessRef = useRef<any[]>([]);
  const [eventProcess] = useState<any[]>([]);

  useEffect(() => {}, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (graph) {
      graph.emit(EVENT_PROCESS, eventProcess);

      graph.on(GET_EVENT_PROCESS, () => {
        graph.emit(EVENT_PROCESS, eventProcessRef.current);
      });
    }
  }, [eventProcess]);

  return [eventProcess, eventProcessRef];
};

const useRefreshData = (graph: any, emitName: string, onName: string): [any[], () => void] => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  const refreshData = useCallback(() => {
    graph.emit(emitName);
  }, []);

  useEffect(() => {
    window.requestIdleCallback(() => {
      graph.emit(emitName);
    });

    graph.on(onName, (data: any) => {
      setDataSource(data);
    });
  }, []);

  return [dataSource, refreshData];
};

export const useRefreshEventProcess = (graph: any) => {
  return useRefreshData(graph, GET_EVENT_PROCESS, EVENT_PROCESS);
};

export const useRefreshElementEvent = (graph: any) => {
  return useRefreshData(graph, GET_ELEMENT_EVENT, ELEMENT_EVENT);
};

export const useRefreshPageElement = (graph: any) => {
  return useRefreshData(graph, GET_PAGE_ELEMENT, PAGE_ELEMENT);
};

export const useCreateRightNode = (node: Node) => {
  const btnRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const rightNodes =
      node.model?.graph.getNeighbors(node, {
        outgoing: true,
      }) || [];

    if (!rightNodes.length && btnRef.current) {
      btnRef.current.click();
    }
  }, []);
  return btnRef;
};

export const useLogicDetail = (code, pageCode) => {
  const [loading, setLoading] = useState(false);
  const [flowJson, setFlowJson] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    getLogicDetail({ code, pageCode })
      .then((res) => {
        const { data } = res || {};

        setFlowJson(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code, pageCode]);

  return [loading, flowJson];
};
