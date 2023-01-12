import { SortableContainer } from './index';

import { useRef, useState } from 'react';

import { SortableBodyContext } from './hooks';

import { Space, Table } from 'antd';
import SortableBodyWrapper from './TableBodyWrapperSortable';
import SortableBodyRow from './TableBodyRowSortable';
import SortableHandle from '@/drag-sort/SortableHandle';
import { ColumnProps } from 'antd/es/table';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'DragSort',
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const Template = ({}) => {
  const containerRef = useRef();

  const columns: ColumnProps<any>[] = [
    {
      title: '排序',
      align: 'center',
      fixed: 'left',
      width: 50,
      render: () => {
        return <SortableHandle />;
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      fixed: 'left',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 500,
    },
    {
      title: '住址',
      dataIndex: 'address',
      fixed: "right",
      width: 100,
    },
  ];

  const [data, setData] = useState(
    Array.from(
      {
        length: 400,
      },
      (_, index) => {
        return {
          code: '2' + index,
          name: '胡彦祖' + index,
          age: 42 + index,
          address: '西湖区湖底公园1号' + index,

        };
      },
    ),
  );

  const defaultRowKey = (record: any) => {
    return data.indexOf(record);
  };

  return (
    <div ref={containerRef}>
      <SortableBodyContext.Provider
        value={{
          list: data,
          start: 0,
          containerRef,
          onSortEnd: (event: { oldIndex: number; newIndex: number }) => {
            const { oldIndex, newIndex } = event;

            if (oldIndex !== newIndex) {
              const oldRecord = data[oldIndex];
              const newRecord = data[newIndex];

              setData(
                data.map((item, index) => {
                  if (index === oldIndex) {
                    return newRecord;
                  }

                  if (index === newIndex) {
                    return oldRecord;
                  }

                  return item;
                }),
              );
            }
          },
        }}
      >
        <Table
          rowKey={defaultRowKey}
          size="small"
          onChange={() => {}}
          pagination={false}
          columns={columns}
          dataSource={data}
          scroll={{
            x: 'max-content',
            y: 900,
          }}
          bordered
          components={{
            body: {
              wrapper: SortableBodyWrapper,
              row: SortableBodyRow,
            },
          }}
        />
      </SortableBodyContext.Provider>
    </div>
  );
};

export const editable = Template.bind({});
