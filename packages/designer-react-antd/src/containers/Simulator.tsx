import { observer } from '@formlogic/render-vue2';
import { ScreenType } from '@formlogic/designer-core';
import { defineComponent } from 'vue';

import { useScreen } from '@/hooks';
import { MobileSimulator, PCSimulator, ResponsiveSimulator } from '@/simulators';

const SimulatorComponent = defineComponent({
  name: 'DnSimulator',
  setup(props, { attrs, slots }) {
    const screenRef = useScreen();
    return () => {
      if (screenRef.value.type === ScreenType.PC) {
        //@ts-ignore
        return <PCSimulator attrs={attrs}>{slots.default?.()}</PCSimulator>;
      }
      if (screenRef.value.type === ScreenType.Mobile) {
        //@ts-ignore
        return <MobileSimulator attrs={attrs}>{slots.default?.()}</MobileSimulator>;
      }
      if (screenRef.value.type === ScreenType.Responsive) {
        return <ResponsiveSimulator attrs={attrs}>{slots.default?.()}</ResponsiveSimulator>;
      }
      //@ts-ignore
      return <PCSimulator attrs={attrs}>{slots.default?.()}</PCSimulator>;
    };
  },
});

export const Simulator = observer(SimulatorComponent);
