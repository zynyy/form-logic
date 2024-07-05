import { defineComponent } from 'vue';
import { Fragment as FragmentV2 } from 'vue-frag';

const Fragment = defineComponent({
  functional: true,
  render(h, context) {
    // @ts-ignore
    return h(FragmentV2, context.data, context.children);
  },
});

export default Fragment;
