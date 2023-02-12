import { markRaw } from '@formily/reactive';

import { Grid } from '@formily/grid';

import { useFormLayoutContext } from '@/components/form-layout/hooks';

import { defineComponent, ref, onMounted, watchEffect, computed } from 'vue';

import { FormGridProps, formGridProps } from '@/components/form-grid/interface';
import { observer } from '@/utils/observer';

const FormGrid = observer(
  defineComponent({
    name: 'FormGrid',
    inheritAttrs: false,
    props: formGridProps,
    setup(props: FormGridProps, { slots, attrs }) {
      const layout = useFormLayoutContext();

      const gridInstance = computed(() => {
        const options = {
          columnGap: layout?.gridColumnGap ?? 8,
          rowGap: layout?.gridRowGap ?? 4,
          ...props,
        };
        return markRaw(new Grid(options));
      });

      const domRef = ref<HTMLDivElement>();

      onMounted(() => {
        watchEffect((onCleanup) => {
          const dispose = gridInstance.value.connect(domRef.value);
          onCleanup(() => {
            dispose();
          });
        });
      });

      return () => {
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: gridInstance.value.templateColumns,
              gap: gridInstance.value.gap,
            }}
            ref={domRef}
          >
            {slots?.default()}
          </div>
        );
      };
    },
  }),
);

export default FormGrid;
