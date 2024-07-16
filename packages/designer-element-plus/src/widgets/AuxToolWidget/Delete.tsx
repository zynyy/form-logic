import { TreeNode } from '@formlogic/designer-core';
import { Button } from 'element-ui';
import { defineComponent } from 'vue';

import { usePrefix } from '@/hooks';
import { composeExport } from '@/utils';
import { IconWidget } from '@/widgets';

const DeleteComponent = defineComponent({
  name: 'DnDelete',
  props: ['node'],
  setup(props) {
    const prefixRef = usePrefix('aux-copy');
    return () => {
      if (props.node === props.node.root) return null;
      return (
        <Button
          class={prefixRef.value}
          type="primary"
          onClick={() => {
            TreeNode.remove([props.node]);
          }}
        >
          <IconWidget infer="Remove" />
        </Button>
      );
    };
  },
});
export const Delete = composeExport(DeleteComponent, { displayName: 'Delete' });
