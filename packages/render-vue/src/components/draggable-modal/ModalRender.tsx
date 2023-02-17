import { computed, CSSProperties, defineComponent, ref, watch, watchEffect } from 'vue';
import cls from 'classnames';
import { DragOutlined } from '@ant-design/icons-vue';
import useDOMHover from '@/hooks/dom/useDOMHover';
import { useStylePrefixCls } from '@/components/style/hooks';

import { Teleport } from 'vue';
import { getModalRenderProps } from './interface';
import { useDraggable } from '@vueuse/core';

const ModalRender = defineComponent({
  name: 'ModalRender',
  props: getModalRenderProps(),

  setup(props, { slots }) {
    const [hover, domHoverRef] = useDOMHover();

    const portalContainer = ref();

    const draggableRef = ref<HTMLDivElement>(null);

    const prefixCls = useStylePrefixCls('draggable-modal-render');

    watchEffect(() => {
      if (draggableRef.value) {
        portalContainer.value = draggableRef.value.querySelector('.ant-modal-content');
      }
    });

    const { x, y, isDragging } = useDraggable(domHoverRef);

    const startX = ref<number>(0);
    const startY = ref<number>(0);
    const startedDrag = ref(false);
    const transformX = ref(0);
    const transformY = ref(0);
    const preTransformX = ref(0);
    const preTransformY = ref(0);
    const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
    watch([x, y], () => {
      if (!startedDrag.value) {
        startX.value = x.value;
        startY.value = y.value;
        const bodyRect = document.body.getBoundingClientRect();
        const titleRect = domHoverRef.value.getBoundingClientRect();
        dragRect.value.right = bodyRect.width - titleRect.width;
        dragRect.value.bottom = bodyRect.height - titleRect.height;
        preTransformX.value = transformX.value;
        preTransformY.value = transformY.value;
      }
      startedDrag.value = true;
    });
    watch(isDragging, () => {
      if (!isDragging) {
        startedDrag.value = false;
      }
    });

    watchEffect(() => {
      if (startedDrag.value) {
        transformX.value =
          preTransformX.value +
          Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
          startX.value;
        transformY.value =
          preTransformY.value +
          Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
          startY.value;
      }
    });

    const transformStyle = computed<CSSProperties>(() => {
      return {
        transform: `translate(${transformX.value}px, ${transformY.value}px)`,
      };
    });

    return () => {
      const { hasDrag } = props;

      return (
        <div ref={draggableRef} style={transformStyle.value}>
          {hasDrag && portalContainer.value ? (
            <Teleport to={portalContainer.value}>
              <DragOutlined ref={domHoverRef} class={cls(`${prefixCls}-drag`)} />
            </Teleport>
          ) : null}

          {slots.default()}
        </div>
      );
    };
  },
});

export default ModalRender;
