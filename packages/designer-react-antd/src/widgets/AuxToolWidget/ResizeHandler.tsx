import { Fragment } from '@formlogic/render-vue2';
import type { TreeNode } from '@formlogic/designer-core';
import cls from 'classnames';
import { defineComponent } from 'vue';

import { useDesigner, usePrefix } from '@/hooks';

export interface IResizeHandlerProps {
  node: TreeNode;
}

export const ResizeHandler = defineComponent({
  name: 'DnResizeHandler',
  props: ['node'],
  setup(props) {
    const designerRef = useDesigner();
    const prefixRef = usePrefix('aux-node-resize-handler');

    return () => {
      const allowResize = props.node.allowResize();
      if (!allowResize) return null;
      const allowX = allowResize.includes('x');
      const allowY = allowResize.includes('y');

      const createHandler = (value: string) => {
        return {
          [designerRef.value.props.nodeResizeHandlerAttrName!]: value,
          class: cls({
            [prefixRef.value]: true,
            [value]: true,
          }),
        };
      };

      return (
        <Fragment>
          {allowX ? (
            <div
              style=""
              {...{
                attrs: createHandler('left-center'),
              }}
            />
          ) : null}

          {allowX ? (
            <div
              style=""
              {...{
                attrs: createHandler('right-center'),
              }}
            />
          ) : null}

          {allowY ? (
            <div
              style=""
              {...{
                attrs: createHandler('center-top'),
              }}
            />
          ) : null}
          {allowY ? (
            <div
              style=""
              {...{
                attrs: createHandler('center-bottom'),
              }}
            />
          ) : null}

          {allowX && allowY ? (
            <div
              style=""
              {...{
                attrs: createHandler('left-top'),
              }}
            />
          ) : null}
          {allowX && allowY ? (
            <div
              style=""
              {...{
                attrs: createHandler('right-top'),
              }}
            />
          ) : null}

          {allowX && allowY ? (
            <div
              style=""
              {...{
                attrs: createHandler('left-bottom'),
              }}
            />
          ) : null}

          {allowX && allowY ? (
            <div
              style=""
              {...{
                attrs: createHandler('right-bottom'),
              }}
            />
          ) : null}
        </Fragment>
      );
    };
  },
});
