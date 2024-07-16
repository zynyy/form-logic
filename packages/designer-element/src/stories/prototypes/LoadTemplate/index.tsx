import type { VueComponent } from '@formlogic/render-vue2';
import type { CSSProperties, VNode } from '@vue/runtime-dom';
import { defineComponent } from 'vue';

import { NodeActionsWidget } from '@/views/designer-formily/designable';

export interface ITemplateAction {
  title: VNode;
  tooltip?: VNode;
  icon?: string | VNode;
  onClick: () => void;
}

export interface ILoadTemplateProps {
  className?: string;
  style?: CSSProperties;
  actions?: ITemplateAction[];
}

export const LoadTemplate: VueComponent = defineComponent({
  props: { actions: Array },
  setup(props: ILoadTemplateProps, { attrs, slots }) {
    return () => {
      return (
        <NodeActionsWidget>
          {props.actions?.map((action, key) => {
            return <NodeActionsWidget.Action props={action} key={key} onClick={action.onClick} />;
          })}
        </NodeActionsWidget>
      );
    };
  },
});
