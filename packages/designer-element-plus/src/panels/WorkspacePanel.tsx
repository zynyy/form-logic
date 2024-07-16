import { defineComponent } from 'vue';

import { usePrefix, useStyle } from '@/hooks';
import { composeExport } from '@/utils';

const WorkspacePanelComponent = defineComponent({
  name: 'DnWorkspacePanel',
  setup(props, { slots }) {
    const prefix = usePrefix('workspace-panel');
    return () => <div class={prefix.value}>{slots.default?.()}</div>;
  },
});

const WorkspacePanelItem = defineComponent({
  name: 'DnWorkspacePanelItem',
  props: ['flexable'],
  setup(props, { slots }) {
    const prefix = usePrefix('workspace-panel-item');
    return () => {
      const style = useStyle();
      return (
        <div
          class={prefix.value}
          style={{
            ...style,
            flexGrow: props.flexable ? 1 : 0,
            flexShrink: props.flexable ? 1 : 0,
          }}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});

export const WorkspacePanel = composeExport(WorkspacePanelComponent, {
  Item: WorkspacePanelItem,
});
