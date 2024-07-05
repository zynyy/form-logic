import { ElInput, ElSelect } from 'element-plus';

import { connect, mapProps, mapReadOnly } from '@/utils';

const CubeSelect = connect(
  ElSelect,
  mapProps(() => {
    return {};
  }),
  mapReadOnly(ElInput, {
    disabled: true,
  }),
);

export default CubeSelect;
