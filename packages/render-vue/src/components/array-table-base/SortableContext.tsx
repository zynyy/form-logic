import { defineComponent, ref, watch } from 'vue';
import { provideSortableContext, SortableContext } from './hooks';

const Sortable = defineComponent({
  props: ['list', 'startIndex'],
  setup(props, { slots }) {
    const sortableContextRef = ref<SortableContext>({
      startIndex: props.startIndex,
      list: props.list,
    });

    watch(
      () => {
        return { startIndex: props.startIndex, list: props.list };
      },
      (nextSortableContext) => {
        sortableContextRef.value = nextSortableContext;
      },
    );

    provideSortableContext(sortableContextRef);

    return () => {
      return slots.default();
    };
  },
});

export default Sortable;
