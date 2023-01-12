import { register } from '@antv/x6-react-shape';

import ModelPage from './model-page';
import PageData from './page-data';
import EffectHook from './effect-hook';
import LogicProcess from './logic-process';
import { EFFECT_HOOK_NODE, LOGIC_PROCESS_NODE, MODEL_PAGE_NODE, PAGE_DATA_NODE } from '@/utils/constant';

const registerReactNode = () => {
  register({
    shape: MODEL_PAGE_NODE,
    component: ModelPage,
  });

  register({
    shape: PAGE_DATA_NODE,
    component: PageData,
  });

  register({
    shape: EFFECT_HOOK_NODE,
    component: EffectHook,
  });

  register({
    shape: LOGIC_PROCESS_NODE,
    component: LogicProcess,
  });
};

export default registerReactNode;
