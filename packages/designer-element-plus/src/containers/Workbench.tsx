import { observer } from '@formlogic/render-vue2';
import { defineComponent } from 'vue';

import { useWorkbench } from '@/hooks';

import { DnWorkspace } from './Workspace';

const WorkbenchComponent = defineComponent({
  name: 'DnWorkbench',
  setup(props, { slots }) {
    const workbench = useWorkbench();

    return () => {
      return (
        <DnWorkspace id={workbench.value.currentWorkspace?.id}>{slots.default?.()}</DnWorkspace>
      );
    };
  },
});
export const DnWorkbench = observer(WorkbenchComponent);
