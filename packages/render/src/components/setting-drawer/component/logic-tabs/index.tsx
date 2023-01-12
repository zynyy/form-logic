import { TransformsSchemaOptions } from '@/transforms';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Empty, Radio, RadioChangeEvent, Space, Tabs, message } from 'antd';

import { isEqual } from '@formily/shared';

import {
  LogicEffectHookProcess,
  ChartPatternType,
  LOGIC_PROCESS_PATTERN,
  LogicEffectHookProcessProps,
  getLogicEffectHookData,
} from '@formlogic/editor';

import { EFFECT_HOOK_GROUP } from '@/utils/constant';

import { toArray } from '@/utils';
import { getModelPageBatchDetail, updateModelPageLogic } from '@/service';
import { MetaSchema } from '@/interface';

import { DiffMonacoEditor, confirmModal, infoModal } from '@formlogic/component';

export interface LogicTabsProps {
  options: TransformsSchemaOptions;
  onPatternChange?: (pattern?: ChartPatternType) => void;
}

export interface LogicTabsRef {
  updateLogic: (cb?: () => void) => void;
}

interface LogicEffectHooks
  extends Pick<
    LogicEffectHookProcessProps,
    'modelCode' | 'pageCode' | 'logics' | 'pageDataSource'
  > {}

const LogicTabs = forwardRef<LogicTabsRef, LogicTabsProps>(({ options, onPatternChange }, ref) => {
  const [logicEffectHooks, setLogicEffectHooks] = useState<LogicEffectHooks[]>([]);

  const [activeKey, setActiveKey] = useState('');

  const [pattern, setPattern] = useState<ChartPatternType>('DETAIL');

  const [loading, setLoading] = useState(false);

  const [effectHookSource] = useState(() => {
    return [].concat(EFFECT_HOOK_GROUP);
  });

  const [graph, setGraph] = useState();

  const updateLogic = (cb?: () => void) => {
    const logics = getLogicEffectHookData(graph);

    setLoading(true);

    updateModelPageLogic({
      pageCode: activeKey,
      logics,
    })
      .then((res) => {
        message.success(`${activeKey} 更新成功`).then(() => void 0);
        setLoading(false);
        initLogicEffectHooks(options);
        cb?.();
      })
      .catch(() => {
        setLoading(false);
        message.error(`${activeKey} 更新失败`).then(() => void 0);
      });
  };

  useImperativeHandle(ref, () => {
    return {
      updateLogic: (cb) => {
        const nextLogics = getLogicEffectHookData(graph);

        const { logics } = logicEffectHooks.find((cur) => cur.pageCode === activeKey);
        infoModal({
          title: `${activeKey} 页面逻辑改动如下`,
          width: 800,
          content: (
            <DiffMonacoEditor
              original={JSON.stringify(logics, null, 2)}
              modified={JSON.stringify(nextLogics, null, 2)}
              height={400}
              language="json"
            />
          ),
          onOk: () => {
            updateLogic(cb);
          },
        });
      },
    };
  });

  const checkLogicChange = (cb: () => void) => {
    const nextLogics = getLogicEffectHookData(graph);

    const { logics } = logicEffectHooks.find((cur) => cur.pageCode === activeKey);

    const logicsEqual = isEqual(nextLogics, logics);

    if (!logicsEqual) {
      confirmModal({
        title: `${activeKey} 页面逻辑存在改动是否要保存`,
        width: 800,
        content: (
          <DiffMonacoEditor
            original={JSON.stringify(logics, null, 2)}
            modified={JSON.stringify(nextLogics, null, 2)}
            height={400}
            language="json"
          />
        ),
        onOk: () => {
          updateLogic(cb);
        },
        onCancel: () => {
          cb();
        },
      });
    } else {
      cb();
    }
  };

  const getLogicEffectHook = (metaSchema: MetaSchema): LogicEffectHooks => {
    const { code, model, data } = metaSchema;

    return {
      modelCode: model,
      pageCode: code,
      pageDataSource: data.map((item) => {
        const { name, code: fieldCode, type: fieldType } = item;
        return {
          code: fieldCode,
          type: fieldType,
          name,
        };
      }),
      logics: data.reduce((acc, item) => {
        const { logics, code: fieldCode, type: fieldType } = item;
        if (logics) {
          return acc.concat(
            logics.map((cur) => {
              const { effectHook, logicCode } = cur;
              return {
                fieldCode,
                fieldType,
                effectHook,
                logicCode,
              };
            }),
          );
        }

        return acc;
      }, []),
    };
  };

  const handlePatternChange = (e: RadioChangeEvent) => {
    const nextPattern = e.target.value;

    onPatternChange?.(nextPattern);

    if (pattern === 'EDITABLE') {
      checkLogicChange(() => {
        setPattern(nextPattern);
      });
    } else {
      setPattern(nextPattern);
    }
  };

  const handleTabsChange = (nextActiveKey: string) => {
    if (pattern === 'EDITABLE') {
      checkLogicChange(() => {
        setActiveKey(nextActiveKey);
      });
    } else {
      setActiveKey(nextActiveKey);
    }
  };

  const initLogicEffectHooks = (options: TransformsSchemaOptions) => {
    if (options) {
      const { metaSchema } = options;
      if (metaSchema) {
        const { data, code } = metaSchema;

        const pageCodes = [code].concat(
          toArray(data)
            .map((item) => item.pageCode)
            .filter((val) => val),
        );

        getModelPageBatchDetail({
          pageCodes,
        }).then((res) => {
          const { data } = res;
          setLogicEffectHooks(
            pageCodes.map((pageCode) => {
              return getLogicEffectHook(data[pageCode]);
            }),
          );
        });
      }
    }
  };

  const handleGraphMount = (nextGraph) => {
    setGraph(nextGraph);
  };

  useEffect(() => {
    if (options) {
      const { metaSchema } = options;
      if (metaSchema) {
        const { code } = metaSchema;

        initLogicEffectHooks(options);

        setActiveKey(code);
      }
    }
  }, [options]);

  const items = logicEffectHooks.map((item) => {
    const { logics, modelCode, pageCode, pageDataSource } = item || {};

    return {
      label: pageCode,
      key: pageCode,
      children: (
        <LogicEffectHookProcess
          effectHookSource={effectHookSource}
          logics={logics}
          modelCode={modelCode}
          pageCode={pageCode}
          pattern={pattern}
          pageDataSource={pageDataSource}
          onGraphMount={handleGraphMount}
          loading={loading}
        />
      ),
    };
  });

  return logicEffectHooks.length ? (
    <Tabs
      items={items}
      activeKey={activeKey}
      tabPosition="left"
      onChange={handleTabsChange}
      style={{
        height: '100%',
      }}
      destroyInactiveTabPane
      tabBarExtraContent={{
        left: (
          <Space>
            <Radio.Group
              size="small"
              value={pattern}
              onChange={handlePatternChange}
              optionType="button"
              options={LOGIC_PROCESS_PATTERN}
            />
          </Space>
        ),
      }}
    />
  ) : (
    <Empty />
  );
});

export default LogicTabs;
