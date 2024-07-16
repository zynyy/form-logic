import { observer } from '@formlogic/render-vue2';
import cls from 'classnames';
import { Button } from 'element-ui';
import { defineComponent } from 'vue';

import { usePrefix, useSelected, useTreeNode } from '@/hooks';
import { composeExport } from '@/utils';
import { IconWidget, TextWidget } from '@/widgets';

const NodeActionsWidgetComponent = observer(
  defineComponent({
    name: 'DnNodeActions',
    props: ['activeShown'],
    setup(props, { slots }) {
      const nodeRef = useTreeNode();
      const prefixRef = usePrefix('node-actions');
      const selectedRef = useSelected();
      return () => {
        if (selectedRef.value.indexOf(nodeRef.value.id) === -1 && props.activeShown) {
          return null;
        }
        return (
          <div class={cls(prefixRef.value)}>
            <div class={prefixRef.value + '-content'}>{slots.default?.()}</div>
          </div>
        );
      };
    },
  }),
);

const ActionComponent = defineComponent({
  name: 'DnNodeAction',
  props: ['icon', 'title', 'onClick'],
  setup(props, { attrs, emit }) {
    const prefixRef = usePrefix('node-actions-item');
    return () => {
      return (
        <Button
          type="text"
          attrs={attrs}
          class={cls(prefixRef.value)}
          data-click-stop-propagation="true"
          onClick={() => {
            emit('click');
          }}
        >
          <span class={prefixRef.value + '-text'}>
            <IconWidget infer={props.icon} />
            <TextWidget>{props.title}</TextWidget>
          </span>
        </Button>
      );
    };
  },
});
export const NodeActionsWidget = composeExport(NodeActionsWidgetComponent, {
  Action: ActionComponent,
});
