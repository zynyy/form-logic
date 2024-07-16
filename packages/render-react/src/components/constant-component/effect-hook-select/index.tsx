import { FC } from 'react';

import { EFFECT_HOOK_GROUP } from '@/utils/constant';
import { StaticSelect, StaticSelectProps } from '@formlogic/component';

export interface EffectHookSelectProps extends StaticSelectProps {}

const EffectHookSelect: FC<EffectHookSelectProps> = ({ ...restProps }) => {
  return (
    <StaticSelect labelTemplateKey="{{code}}-{{name}}" {...restProps} data={EFFECT_HOOK_GROUP} />
  );
};

export default EffectHookSelect;
