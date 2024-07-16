import { TreeNode } from '@formlogic/designer-core';
import { Button } from 'element-ui';
import { defineComponent } from 'vue';

import { usePrefix, useStyle } from '@/hooks';
import { composeExport } from '@/utils';
import { IconWidget } from '@/widgets';

const CopyComponent = defineComponent({
  props: ['node'],
  setup(props) {
    const prefixRef = usePrefix('aux-copy');
    const style = useStyle();
    return () => {
      if (props.node === props.node.root) return null;
      return (
        <Button
          class={prefixRef.value}
          style={style}
          type="primary"
          onClick={() => {
            TreeNode.clone([props.node]);
          }}
        >
          <IconWidget infer="Clone" />
        </Button>
      );
    };
  },
});

export const Copy = composeExport(CopyComponent, { displayName: 'Copy' });
