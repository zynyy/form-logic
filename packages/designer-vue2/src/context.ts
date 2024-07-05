import { Engine, TreeNode, Workspace } from '@formlogic/designer-core';
import { ComputedRef, InjectionKey, Ref, computed, inject, provide, ref } from 'vue';

import { IDesignerComponents, IDesignerLayoutContext, IWorkspaceContext } from './types';
export * from './types';

export const DesignerComponentsSymbol: InjectionKey<Ref<IDesignerComponents>> = Symbol(
  'DesignerComponentsSymbol',
);

export const DesignerLayoutSymbol: InjectionKey<Ref<IDesignerLayoutContext>> =
  Symbol('DesignerLayoutSymbol');

export const DesignerEngineSymbol: InjectionKey<Ref<Engine>> = Symbol('DesignerEngineSymbol');

export const TreeNodeSymbol: InjectionKey<Ref<TreeNode>> = Symbol('TreeNodeSymbol');

export const WorkspaceSymbol: InjectionKey<Ref<IWorkspaceContext>> = Symbol('WorkspaceSymbol');

export function useContext<T>(key: InjectionKey<Ref<T>>) {
  return inject(key, ref());
}

export const useDesignerEngine = (): Ref<Engine> => {
  return useContext(DesignerEngineSymbol) as Ref<Engine>;
};

export const useWorkspaceId = () => {
  const workspaceRef = useContext(WorkspaceSymbol);

  return computed(() => {
    return workspaceRef.value?.id;
  });
};

export const provideWorkspace = (workspace: ComputedRef<Workspace>) => {
  provide(WorkspaceSymbol, workspace);
};
