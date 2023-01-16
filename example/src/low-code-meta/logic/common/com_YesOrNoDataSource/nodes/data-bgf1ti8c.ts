// 数据节点
export default async function (ctx) {
  const { payload } = ctx || {};
  const { field } = payload || {};

  field.setComponentProps({
    data: [
      {
        code: '1',
        name: '是',
      },
      {
        code: '0',
        name: '否',
      },
    ],
  });
  return {};
}
