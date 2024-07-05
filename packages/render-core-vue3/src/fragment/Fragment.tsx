import { defineComponent } from 'vue';

const Fragment = defineComponent({
  name: 'Fragment',
  inheritAttrs: false,
  setup(props, { slots }) {
    return () => {
      return slots.default?.();
    };
  },
});

export default Fragment;
