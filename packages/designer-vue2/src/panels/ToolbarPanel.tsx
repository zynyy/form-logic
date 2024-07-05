import { defineComponent } from 'vue';

import { useStyle } from '@/hooks';

import { WorkspacePanel } from './WorkspacePanel';

export const ToolbarPanel = defineComponent({
  name: 'DnToolbarPanel',
  setup(props, { slots }) {
    const style = useStyle();
    return () => (
      <WorkspacePanel.Item
        {...{ attrs: props }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
          padding: '0 4px',
          ...style,
        }}
      >
        {slots.default?.()}
      </WorkspacePanel.Item>
    );
  },
});
