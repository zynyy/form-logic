import { defineComponent, h } from 'vue';
import { SlickList } from 'vue-slicksort';
import { useField } from '@/formily-vue';
import { ArrayField } from '@formily/core';
import { useSortableContext } from '@/components/array-table-base/hooks';
import { uid } from '@formily/shared';

const SortableBodyWrapper = defineComponent({
  setup(props, { slots }) {
    const fieldRef = useField<ArrayField>();

    const sortableContextRef = useSortableContext();

    const addTdStyles = (node: HTMLDivElement, index: number) => {
      const helper = node.querySelector('.sort-helper');

      if (helper) {
        const tds = node?.querySelectorAll('td');
        if (tds) {
          requestAnimationFrame(() => {
            document
              .querySelector(`body>tr.slick-item-${index}`)
              .querySelectorAll('td')
              .forEach((td, index) => {
                if (tds[index]) {
                  td.style.width = getComputedStyle(tds[index]).width;
                  td.style.zIndex = String(9999);
                }
              });
          });
        }
      }
    };

    const handleSortStart = ({ node, index }) => {
      addTdStyles(node, index);
    };

    const handleSortEnd = ({ newIndex, oldIndex }) => {
      if (oldIndex !== newIndex) {
        const { startIndex } = sortableContextRef.value;

        fieldRef.value.move(oldIndex + startIndex, newIndex + startIndex).then(() => void 0);
      }
    };

    const compoenentKey = uid();

    return () => {
      return h(
        SlickList,
        {
          axis: 'y',
          lockAxis: 'y',
          list: sortableContextRef.value.list,
          hideSortableGhost: true,
          useWindowAsScrollContainer: true,
          useDragHandle: true,
          tag: 'tbody',
          onSortStart: handleSortStart,
          onSortEnd: handleSortEnd,
          helperClass: 'helper',
          key: compoenentKey,
        },
        slots,
      );
    };
  },
});

export default SortableBodyWrapper;
