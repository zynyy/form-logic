import { Fragment } from '@formlogic/code-render';
import { Workspace as WorkspaceCore } from '@formlogic/designer-core';
import { computed, ComputedRef, defineComponent, ref, unref } from 'vue';

import { provideWorkspace } from '@/context';
import { useDesigner } from '@/hooks';

export const DnWorkspace = defineComponent({
  name: 'DnWorkspace',
  props: {
    id: String,
    title: String,
    description: String,
  },
  setup(props, { slots }) {
    const oldId = ref<string>();
    const designerRef = useDesigner();

    const workspace = computed(() => {
      const designer = unref(designerRef);
      if (!designer) return;
      if (oldId.value && oldId.value !== props.id) {
        const old = designer.workbench.findWorkspaceById(oldId.value);
        if (old) old.viewport.detachEvents();
      }
      const workspace = {
        id: props.id || 'index',
        title: props.title,
        description: props.description,
      };
      // 初始化工作引擎
      designer.workbench.ensureWorkspace(workspace);
      oldId.value = workspace.id;
      return workspace;
    });

    provideWorkspace(workspace as ComputedRef<WorkspaceCore>);

    return () => {
      return <Fragment>{slots.default?.()}</Fragment>;
    };
  },
});
