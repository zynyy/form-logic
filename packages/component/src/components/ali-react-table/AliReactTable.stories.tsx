import { ArtTable, useTablePipeline, features, useForceUpdate } from './index';
import { useEffect } from 'react';

export default {
  title: 'ali-react-art-table',
  component: ArtTable,
  argTypes: {},
};

const data = [
  { prov: '湖北省', confirmed: 54406, cured: 4793, dead: 1457, t: '2020-02-15 19:52:02' },
  { prov: '广东省', confirmed: 1294, cured: 409, dead: 2, t: '2020-02-15 19:52:02' },
  { prov: '河南省', confirmed: 1212, cured: 390, dead: 13, t: '2020-02-15 19:52:02' },
  { prov: '浙江省', confirmed: 1162, cured: 428, dead: 0, t: '2020-02-15 19:52:02' },
  { prov: '湖南省', confirmed: 1001, cured: 417, dead: 2, t: '2020-02-15 19:52:02' },
];

const footerData = [
  { prov: '湖北省', confirmed: 54406, cured: 4793, dead: 1457, t: '2020-02-15 19:52:02' },
];

const column = [
  { code: 'prov', name: '省份' },
  { code: 'confirmed', name: '确诊' },
  { code: 'cured', name: '治愈' },
  { code: 'dead', name: '死亡' },
  { code: 't', name: '最后更新时间' },
];

const Template = (args) => <ArtTable {...args} />;

export const Init = Template.bind({});
Init.args = {
  dataSource: data,
  columns: column,
  loading: false,
  footerDataSource: footerData,
};

export const empty = Template.bind({});

empty.args = {
  dataSource: [],
  columns: column,
};

const ResizeTemplate = ({ dataSource, columns, ...restProps }) => {
  const pipeline = useTablePipeline({})
    .input({ dataSource, columns })
    .use(
      features.columnResize({
        fallbackSize: 120,
      }),
    )
    .use(features.columnRangeHover());

  const tableProps = pipeline.getProps();

  return <ArtTable {...restProps} {...tableProps} />;
};

export const columnResize = ResizeTemplate.bind({});

columnResize.args = {
  dataSource: data,
  columns: column,
};
