import { Fragment, observer } from '@formlogic/render-vue2';
import { GlobalRegistry, isPlainObj, isStr } from '@formlogic/designer-core';
import { defineComponent } from 'vue';

const TextWidgetComponent = defineComponent({
  name: 'DnText',
  props: {
    componentName: String,
    sourceName: String,
    token: String,
    defaultMessage: String,
  },
  setup(props, { slots }) {
    const takeLocale = (message: any) => {
      if (isStr(message)) return message;
      if (isPlainObj(message)) {
        const lang = GlobalRegistry.getDesignerLanguage();
        for (const key in message) {
          if (key.toLocaleLowerCase() === lang) {
            // @ts-ignore
            return message[key];
          }
        }
        return;
      }
      return message;
    };

    const takeMessage = (token: any) => {
      if (!token) return;
      const message = isStr(token) ? GlobalRegistry.getDesignerMessage(token) : token;
      if (message) return takeLocale(message);
      return token;
    };
    /**
     * 子节点为TextNode的vnode
     * 子节点为i18n对象
     */
    return () => {
      return (
        <Fragment>
          {takeMessage(slots.default?.()?.[0].text) ||
            takeMessage(slots.default?.()?.[0]) ||
            takeMessage(props.token) ||
            takeMessage(props.defaultMessage)}
        </Fragment>
      );
    };
  },
});

export const TextWidget = observer(TextWidgetComponent);
