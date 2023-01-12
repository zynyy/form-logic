import { Button, Table } from 'antd';

import { FlowChartDetailDrawer } from '@formlogic/editor';
import { FC, useEffect, useRef, useState } from 'react';
import { ExecLogicListItem } from '@/interface';

import { EyeOutlined } from '@ant-design/icons';
import { useOpen } from '@/hooks';
import { DEFAULT_TABLE_PAGINATION } from '@/utils/constant';
import { ColumnProps } from 'antd/es/table';
import { useSettingDrawerStyle } from '@/components/setting-drawer/hooks';
import cls from 'classnames';

export interface ExecLogicHistoryProps {
  dataSource: ExecLogicListItem[];
}

const ExecLogicHistory: FC<ExecLogicHistoryProps> = ({ dataSource }) => {
  const [logicCode, setLogicCode] = useState('');
  const [warpSSR, hashId, prefixCls] = useSettingDrawerStyle();

  const [open, show, hidden] = useOpen();

  const wrapRef = useRef<HTMLDivElement>();

  const [scrollY, setScrollY] = useState(500);

  const getFilters = (column: string) => {
    return Array.from(new Set(dataSource?.map((item) => item[column]) || []))
      .filter((val) => val)
      .map((text) => {
        return {
          text,
          value: text,
        };
      });
  };

  const columns: ColumnProps<any>[] = [
    {
      title: '序号',
      width: 50,
      fixed: 'left',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: '页面编码',
      dataIndex: 'pageCode',
      width: 120,
      fixed: 'left',
      filters: getFilters('pageCode'),
      onFilter: (value: string, record) => record.pageCode?.indexOf(value) === 0,
    },

    {
      title: '字段',
      dataIndex: 'fieldCode',
      filters: getFilters('fieldCode'),
      width: 100,
      onFilter: (value: string, record) => record.fieldCode?.indexOf(value) === 0,
    },
    {
      title: '事件',
      dataIndex: 'effectHook',
      filters: getFilters('effectHook'),
      width: 100,
      onFilter: (value: string, record) => record.effectHook?.indexOf(value) === 0,
    },
    {
      title: '逻辑编码',
      dataIndex: 'logicCode',
      filters: getFilters('logicCode'),
      width: 120,
      onFilter: (value: string, record) => record.logicCode?.indexOf(value) === 0,
      render: (text) => {
        return (
          <Button
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              setLogicCode(text);

              show();
            }}
          >
            {text}
          </Button>
        );
      },
    },
    {
      title: '开始执行',
      dataIndex: 'createTime',
      width: 120,
      sorter: (a, b) => a.time - b.time,
    },
    {
      title: '执行完成',
      dataIndex: 'doneTime',
      width: 120,
    },
    {
      title: '表单id',
      dataIndex: 'formId',
      width: 100,
    },
  ];

  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record);
  };

  useEffect(() => {
    if (wrapRef.current) {
      const { height } = wrapRef.current.getBoundingClientRect();

      setScrollY(height - 80);
    }
  }, []);

  return warpSSR(
    <div
      style={{
        height: '100%',
      }}
      ref={wrapRef}
    >
      <Table
        columns={columns}
        rowKey={defaultRowKey}
        dataSource={dataSource}
        scroll={{
          scrollToFirstRowOnChange: true,
          x: 'max-content',
          y: scrollY,
        }}
        size="small"
        bordered
        pagination={DEFAULT_TABLE_PAGINATION}
        className={cls(hashId, `${prefixCls}-exec-logic-history-table`)}
      />

      <FlowChartDetailDrawer logicCode={logicCode} open={open} onClose={hidden} />
    </div>,
  );
};

export default ExecLogicHistory;
