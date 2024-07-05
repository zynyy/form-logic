import { observer } from '@formlogic/code-render';
import { defineComponent } from 'vue';

import { DnViewport } from '@/containers';
import { useTree, useWorkbench } from '@/hooks';

const ViewPanelComponent = defineComponent({
  name: 'DnViewPanel',
  props: {
    type: String,
    scrollable: { type: Boolean, default: true },
    dragTipsDirection: { type: String },
  },
  setup(props, { slots }) {
    const workbenchRef = useWorkbench();
    const treeRef = useTree();

    return () => {
      if (workbenchRef.value.type !== props.type) return null;
      const render = () => {
        return slots.default?.(treeRef.value, (payload: any) => {
          treeRef.value.from(payload);
          treeRef.value.takeSnapshot();
        });
      };

      if (workbenchRef.value.type === 'DESIGNABLE') {
        return <DnViewport dragTipsDirection={props.dragTipsDirection}>{render()}</DnViewport>;
      }

      return (
        <div
          style={{
            overflow: props.scrollable ? 'overlay' : 'hidden',
            height: '100%',
            cursor: 'auto',
            userSelect: 'text',
          }}
        >
          {render()}
        </div>
      );
    };
  },
});
export const ViewPanel = observer(ViewPanelComponent);
