import { Input, Option, Select } from 'element-ui';
import Vue, { computed, defineComponent, ref, watch } from 'vue';

import { formatComponentProps } from '@/utils';

import { getSelectProps, SelectProps } from './interface';

Vue.use(Input);

const CubeSelect = defineComponent({
  name: 'CubeSelect',
  inheritAttrs: false,
  props: getSelectProps(),
  setup(props: SelectProps, { listeners, emit }) {
    const loading = ref(false);
    const selectRef = ref();

    const getStaticData = () => {
      if (props.dataSource?.length) {
        return props.dataSource;
      }

      if (props.defaultOptions?.length) {
        return props.defaultOptions;
      }

      return [];
    };

    watch(
      () => {
        return getStaticData();
      },
      (data) => {
        console.log('dataChange', data);
      },
    );

    const options = ref<any[]>(getStaticData());

    const { onChange } = formatComponentProps({
      on: listeners,
    });

    watch(
      () => {
        return props.apiConfig;
      },
      () => {
        console.log(props.apiConfig, 'changeApiConfig');
      },
    );

    const findRecord = (val: string): undefined | Record<string, any> => {
      return val ? options.value.find((item: any) => item.value === val) : undefined;
    };

    const getAllRecord = (
      data: string | string[],
    ): Record<string, any> | undefined | Array<Record<string, any>> => {
      return Array.isArray(data)
        ? data
            .map((val) => {
              return findRecord(val);
            })
            .filter((val) => val)
        : findRecord(data);
    };

    watch(
      () => {
        return props.value;
      },
      () => {
        console.log(props.value, 'changeNum');
      },
    );

    const triggerChange = (changedValue: any) => {
      emit('change', 111);
      emit('input', 111);
      onChange?.(changedValue, getAllRecord(changedValue));
    };

    const defaultOptions = computed(() => {
      const filterData = props.filterData;

      const includeData = props.includeData;

      if (includeData?.length) {
        return options.value.filter((item) => {
          if (includeData.includes(item.value)) {
            return !(filterData || []).includes(item.value);
          }

          return false;
        });
      }

      if (filterData?.length) {
        return options.value.filter((item: any) => {
          return !(filterData || []).includes(item.value);
        });
      }
      return options.value;
    });

    const handleChange = (val: string | string[]) => {
      triggerChange(val);
    };

    const selectValue = computed(() => {
      if (props.multiple && !Array.isArray(props.value)) {
        return [props.value].filter((val) => val === 0 || val);
      }

      if (!props.multiple && Array.isArray(props.value)) {
        return props.value[0];
      }

      return props.value;
    });

    return () => {
      return (
        <Select
          attrs={props}
          value={selectValue.value}
          filterable
          clearable
          loading={loading.value}
          on={{
            ...listeners,
            change: handleChange,
            input: handleChange,
          }}
          ref={selectRef}
        >
          {defaultOptions.value.map((item) => {
            return <Option value={item.value}>{item.label} </Option>;
          })}
        </Select>
      );
    };
  },
});
export default CubeSelect;
