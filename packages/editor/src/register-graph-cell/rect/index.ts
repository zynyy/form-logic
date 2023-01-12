import {Graph} from '@antv/x6';
import { RECT_NODE } from '@/utils/constant';

const registerRect = () => {
  Graph.registerNode(
    RECT_NODE,
    {
      inherit: 'rect',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
    },
    true,
  );
};

export default registerRect;
