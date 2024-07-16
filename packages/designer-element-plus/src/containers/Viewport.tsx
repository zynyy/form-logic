import { requestIdle, Viewport as ViewportType } from '@formlogic/designer-core';
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import { usePrefix, useStyle, useViewport } from '@/hooks';
import { AuxToolWidget } from '@/widgets';

export const DnViewport = defineComponent({
  name: 'DnViewport',
  props: {
    placeholder: {},
    dragTipsDirection: String,
  },
  setup(props, { slots, attrs }) {
    const loaded = ref(false);
    const prefixRef = usePrefix('viewport');
    const viewportHookRef = useViewport();

    const containerRef = ref<HTMLDivElement>();
    // 该组件内部缓存的ref
    const viewportRef = ref<ViewportType>();
    const isFrameRef = ref(false);

    onMounted(() => {
      const frameElement = containerRef.value?.querySelector('iframe');
      if (!viewportHookRef.value) return;
      if (viewportRef.value && viewportRef.value !== viewportHookRef.value) {
        viewportRef.value.onUnmount();
      }
      if (frameElement) {
        frameElement.addEventListener('load', () => {
          //@ts-ignore
          viewportHookRef.value.onMount(frameElement, frameElement.contentWindow);
          requestIdle(() => {
            isFrameRef.value = true;
            loaded.value = true;
          });
        });
      } else {
        //@ts-ignore
        viewportHookRef.value.onMount(containerRef.value, window);
        requestIdle(() => {
          isFrameRef.value = false;
          loaded.value = true;
        });
      }
      viewportRef.value = viewportHookRef.value;
    });

    onBeforeUnmount(() => {
      viewportHookRef.value.onUnmount();
    });

    const style = useStyle();

    return () => {
      return (
        <div
          ref={containerRef}
          {...{
            attrs,
          }}
          class={prefixRef.value}
          style={{
            opacity: !loaded.value ? 0 : 1,
            'overflow-x': 'hidden',
            padding: '10px 10px',
            ...style,
          }}
        >
          {slots.default?.()}
          <AuxToolWidget />

          {/*<EmptyWidget dragTipsDirection={props.dragTipsDirection}>{props.placeholder}</EmptyWidget>*/}
        </div>
      );
    };
  },
});
