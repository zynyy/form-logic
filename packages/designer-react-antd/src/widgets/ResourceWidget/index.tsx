import './styles.less';

import { observer } from '@formlogic/render-vue2';
import { isResourceHost, isResourceList } from '@formlogic/designer-core';
import cls from 'classnames';
import { defineComponent, toRef, unref } from 'vue';

import { usePrefix } from '@/hooks';
import { IconWidget } from '@/widgets/IconWidget';
import { TextWidget } from '@/widgets/TextWidget';

export const ResourceWidget = observer(
  defineComponent({
    name: 'DnResource',
    props: {
      defaultExpand: { type: Boolean, default: true },
      sources: { type: Array, default: () => [] },
      className: String,
      title: String,
    },
    setup(props, { slots }) {
      const prefixRef = usePrefix('resource');
      const expand = toRef(props, 'defaultExpand');

      const renderNode = (source: any) => {
        const prefix = unref(prefixRef);
        const { node, icon, title, thumb, span } = source;

        return (
          <div
            class={prefix + '-item'}
            style={{ gridColumnStart: `span ${span || 1}` }}
            {...{
              attrs: {
                key: node.id,
                'data-designer-source-id': node.id,
              },
            }}
          >
            {thumb && <img class={prefix + '-item-thumb'} src={thumb} alt="缩略图" />}
            {icon && (
              <IconWidget
                class={prefix + '-item-icon'}
                infer={icon}
                style={{ width: '150px', height: '20px' }}
              />
            )}
            <span class={prefix + '-item-text'}>
              <TextWidget>{title || node.children[0]?.getMessage('title')}</TextWidget>
            </span>
          </div>
        );
      };

      const sources = props.sources.reduce((buf: any[], source: any) => {
        if (isResourceList(source)) {
          return buf.concat(source);
        } else if (isResourceHost(source)) {
          return buf.concat(source.Resource);
        }
        return buf;
      }, []);

      const remainItems =
        sources.reduce((length, source) => {
          return length + (source.span ?? 1);
        }, 0) % 3;

      return () => {
        const prefix = unref(prefixRef);

        return (
          <div
            class={cls(prefix, {
              expand: expand.value,
            })}
          >
            <div
              class={prefix + '-header'}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                expand.value = !expand.value;
              }}
            >
              <div class={prefix + '-header-expand'}>
                <IconWidget infer="Expand" size={'10px'} />
              </div>
              <div class={prefix + '-header-content'}>
                <TextWidget>{props.title}</TextWidget>
              </div>
            </div>
            <div class={prefix + '-content-wrapper'}>
              <div class={prefix + '-content'}>
                {sources.map(renderNode)}
                {remainItems ? (
                  <div
                    class={prefix + '-item-remain'}
                    style={{ gridColumnStart: `span ${3 - remainItems}` }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      };
    },
  }),
);
