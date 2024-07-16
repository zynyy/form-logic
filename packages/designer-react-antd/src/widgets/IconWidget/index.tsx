import './styles.less';

import { Fragment, observer } from '@formlogic/render-vue2';
import { isFn, isObj, isPlainObj, isStr } from '@formlogic/designer-core';
import cls from 'classnames';
import { Tooltip, Tooltip as TooltipProps } from 'element-ui';
import { computed, defineComponent, onBeforeUnmount, onMounted, provide, ref, unref } from 'vue';

import { useContext } from '@/context';
import { usePrefix, useRegistry, useStyle, useTheme } from '@/hooks';
import { cloneElement, composeExport, isVNode, isVueComponent } from '@/utils';

const IconSymbol = Symbol('icon'); // createContext<IconProviderProps>(null)

const isNumSize = (val: any) => {
  return /^[\d.]+$/.test(val);
};

export interface IconProviderProps {
  tooltip?: boolean;
}

export interface IShadowSVGProps {
  content?: string;
  width?: number | string;
  height?: number | string;
}
export interface IIconWidgetProps extends HTMLElement {
  tooltip?: TooltipProps;
  infer: any;
  size?: number | string;
}

const getInnerIconWidgetInnerProps = () => {
  return {
    tooltip: { type: Object },
    infer: { type: [String, Function, Object] },
    size: { type: [Number, String] },
  };
};

const InnerIconWidgetInner = defineComponent({
  name: 'DnIconWidget',
  props: getInnerIconWidgetInnerProps(),
  setup(props, { attrs: _attrs, listeners, emit }) {
    const themeRef = useTheme();
    const IconContextRef = useContext(IconSymbol);
    const registry = useRegistry();
    const prefixRef = usePrefix('icon');

    return () => {
      const size = isNumSize(props.size) ? `${props.size}px` : props.size || '1em';
      const attrs = _attrs as unknown as HTMLElement;
      const style = useStyle();
      const height = style?.height || size;
      const width = style?.width || size;
      const takeIcon: any = (infer: any) => {
        const theme = unref(themeRef);
        if (isStr(infer)) {
          const finded = registry.getDesignerIcon(infer);
          if (finded) {
            return takeIcon(finded);
          }
          return <img src={infer} height={height} width={width} alt={infer} />;
        } else if (isFn(infer) || isVueComponent(infer)) {
          return (
            <infer
              attrs={{ height: height, width: width, fill: 'currentColor' }}
              fill="currentColor"
            />
          );
        } else if (isVNode(infer)) {
          if (infer.tag === 'svg') {
            return cloneElement(infer, {
              height,
              width,
              fill: 'currentColor',
              viewBox: infer.data?.attrs?.viewBox || '0 0 1024 1024',
              focusable: 'false',
              'aria-hidden': 'true',
            });
          } else if (infer.tag === 'path' || infer.tag === 'g') {
            return (
              <svg
                viewBox="0 0 1024 1024"
                height={height}
                width={width}
                fill="currentColor"
                focusable="false"
                aria-hidden="true"
              >
                {infer}
              </svg>
            );
          } else if (infer.componentOptions?.propsData?.content) {
            // 判断是不是 shadowSVG === IconWidget.ShadowSVG 写死了看看后续怎么修改
            return (
              <ShadowSVG
                //@ts-ignore
                attrs={{
                  content: infer.componentOptions.propsData.content,
                  height,
                  width,
                }}
              />
            );
          }
          return infer;
        } else if (isPlainObj(infer)) {
          //@ts-ignore
          if (theme && infer[theme]) {
            //@ts-ignore
            return takeIcon(infer[theme]);
          }
        }
      };

      const renderTooltips = (children: any) => {
        const IconContext: any = unref(IconContextRef);
        if (!isStr(props.infer) && IconContext && IconContext.tooltip) {
          return children;
        }
        const tooltip = props.tooltip || registry.getDesignerMessage(`icons.${props.infer}`);
        if (tooltip) {
          const props = isObj(tooltip) ? tooltip : { content: tooltip };
          return <Tooltip {...{ props: { ...props, 'open-delay': 200 } }}>{children}</Tooltip>;
        }
        return children;
      };

      return renderTooltips(
        <span
          {...{ attrs: { ...attrs, infer: isStr(props.infer) && props.infer } }}
          class={cls(prefixRef.value)}
          style={{
            ...style,
            cursor: listeners.click ? 'pointer' : attrs.style?.cursor,
          }}
          onClick={() => emit('click')}
        >
          {takeIcon(props.infer)}
        </span>,
      );
    };
  },
});

const IconWidgetInner = observer(InnerIconWidgetInner);

const ShadowSVG = defineComponent({
  name: 'DnShadowSVG',
  props: {
    width: [Number, String],
    height: [Number, String],
    content: String,
  },
  setup(props) {
    const refInstance = ref<HTMLDivElement>();
    const width = isNumSize(props.width) ? `${props.width}px` : props.width;
    const height = isNumSize(props.height) ? `${props.height}px` : props.height;

    onMounted(() => {
      if (refInstance.value) {
        const root = refInstance.value.attachShadow({
          mode: 'open',
        });
        root.innerHTML = `<svg viewBox="0 0 1024 1024" style="width:${width};height:${height}">${props.content}</svg>`;
      }
    });

    onBeforeUnmount(() => {
      // TODO::报错
      // if (!refInstance.value) return
      // refInstance.value.attachShadow({
      //   mode: 'closed',
      // })
    });

    return () => <div ref={refInstance}></div>;
  },
});

const Provider = defineComponent({
  name: 'DnIconProvider',
  props: { tooltip: Boolean },
  setup(props, { slots }) {
    provide(
      IconSymbol,
      computed(() => props),
    );
    return () => {
      return <Fragment>{slots.default?.()}</Fragment>;
    };
  },
});

export const IconWidget = composeExport(IconWidgetInner, {
  ShadowSVG,
  Provider,
});
