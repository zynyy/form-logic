import './styles.less';

import { observer, provideSchemaComponents } from '@formlogic/code-render';
import { GlobalRegistry, TreeNode } from '@formlogic/designer-core';
import cls from 'classnames';
import { defineComponent, provide, toRef } from 'vue';

import { DesignerComponentsSymbol, TreeNodeSymbol } from '@/context';
import { useComponents, useDesigner, usePrefix, useTree } from '@/hooks';
import { IDesignerComponents } from '@/types';
import { composeExport } from '@/utils';

export interface IComponentTreeWidgetProps {
  components: IDesignerComponents;
}

export interface ITreeNodeWidgetProps {
  node: TreeNode;
}

export const TreeNodeProvide = defineComponent({
  name: 'DnTreeNodeProvide',
  props: ['node'],
  setup(props, { slots }) {
    provide(TreeNodeSymbol, toRef(props, 'node'));
    return () => {
      return slots.default?.();
    };
  },
});

export const TreeNodeWidgetComponent = defineComponent({
  name: 'DnTreeNodeWidget',
  props: {
    node: Object,
  },
  setup(props) {
    const designerRef = useDesigner(props.node?.designerProps?.effects);
    const componentsRef = useComponents();

    return () => {
      const node = props.node as TreeNode;
      const renderChildren = () => {
        if (node?.designerProps?.selfRenderChildren) return [];
        return node?.children?.map((child: TreeNode) => {
          return <TreeNodeWidget props={{ node: child }} key={child.id} />;
        });
      };

      // may need to change
      const renderProps = (extendsProps: any = {}) => {
        return {
          ...node.designerProps?.defaultProps,
          ...extendsProps,
          ...node.props,
          ...node.designerProps?.getComponentProps?.(node),
        };
      };

      const renderComponent = () => {
        const componentName = node.componentName;
        const Component = componentsRef.value?.[componentName];

        const dataId: Record<string, string> = {};
        if (Component) {
          if (designerRef.value) {
            const nodeIdAttrName = designerRef.value?.props?.nodeIdAttrName;
            dataId[nodeIdAttrName] = node.id;
          }
          const { style, ...attrs } = renderProps(dataId);
          return (
            //@ts-ignore
            <Component attrs={attrs} key={node.id} style={style}>
              {renderChildren()}
            </Component>
          );
        } else {
          if (node?.children?.length) {
            return <span>{renderChildren()}</span>;
          }
        }
      };
      if (!node) return null;
      if (node.hidden) return null;

      return <TreeNodeProvide node={props.node}>{renderComponent()}</TreeNodeProvide>;
    };
  },
});

export const TreeNodeWidget = observer(TreeNodeWidgetComponent);

const DnComponentTreeWidget = defineComponent({
  name: 'DnComponentTreeWidget',
  props: { components: [Object] },
  setup(props) {
    const treeRef = useTree();
    const prefixRef = usePrefix('component-tree');
    const designerRef = useDesigner();

    GlobalRegistry.registerDesignerBehaviors(props.components as any);

    const componentsRef = toRef(props, 'components');

    provide(DesignerComponentsSymbol, componentsRef);

    provideSchemaComponents(componentsRef as any);

    return () => {
      const dataId: Record<string, string> = {};
      if (designerRef.value && treeRef.value) {
        const nodeIdAttrName = designerRef.value?.props?.nodeIdAttrName as string;

        dataId[nodeIdAttrName] = treeRef.value.id;
      }
      return (
        //@ts-ignore
        <div class={cls(prefixRef.value)} attrs={dataId}>
          <TreeNodeWidget props={{ node: treeRef.value }} />
        </div>
      );
    };
  },
});

export const ComponentTreeWidgetComponent = observer(DnComponentTreeWidget);

export const ComponentTreeWidget = composeExport(ComponentTreeWidgetComponent, {});
