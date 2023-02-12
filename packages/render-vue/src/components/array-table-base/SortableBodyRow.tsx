import { defineComponent, h } from 'vue';
import { SlickItem } from 'vue-slicksort';

const SortableBodyRow = defineComponent({
  setup(props, { slots, attrs }) {
    return () => {
      return h(
        SlickItem,
        {
          ...attrs,
          index: attrs.index ?? 0,
          tag: 'tr',
          class: `${attrs.class} slick-item-${attrs.index ?? 0}`,
        },
        slots,
      );
    };
  },
});

export default SortableBodyRow;
