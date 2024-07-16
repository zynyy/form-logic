import { Fragment, observer } from '@formlogic/render-vue2';
import { defineComponent } from 'vue';

const NodeTitleWidgetComponent = defineComponent({
  name: 'DnNodeTitleWidget',
  props: ['node', 'title'],
  setup(props) {
    const takeNode = () => {
      const node = props.node;
      if (node.componentName === '$$ResourceNode$$') {
        return node.children[0];
      }
      return node;
    };
    return () => {
      const node = takeNode();

      return <Fragment>{props.title || node.getMessage('title') || node.componentName}</Fragment>;
    };
  },
});
export const NodeTitleWidget = observer(NodeTitleWidgetComponent);
