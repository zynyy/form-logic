import { defineComponent, withDirectives, h, watch, shallowRef } from 'vue';

import type { ArrayField } from '@formily/core';

import { DragOutlined } from '@ant-design/icons-vue';

import { HandleDirective } from 'vue-slicksort';
import { useField, observer } from '@/formily-vue';

import {
  provideArrayContext,
  provideArrayItemContext,
  useArrayContext,
  useArrayIndex,
  useArrayItemRecord,
} from '@/components/array-base/hooks';

import {
  ArrayBaseItemProps,
  ArrayBaseProps,
  getArrayBaseItemProps,
  getArrayBaseProps,
  getPreviewTextProps,
  PreviewTextProps,
} from './interface';
import { STYLE_PREFIX } from '@/utils/constant';
import {
  Addition,
  BatchRemove,
  Copy,
  Detail,
  Edit,
  MoveDown,
  MoveUp,
  Remove,
  Upload,
} from '@/components/array-base/buttons';

const stylePrefix = `${STYLE_PREFIX}`;

const ArrayBaseInner = defineComponent({
  name: 'ArrayBase',
  inheritAttrs: false,
  props: getArrayBaseProps(),
  setup(props: ArrayBaseProps, { slots }) {
    const field = useField<ArrayField>();

    provideArrayContext({
      props,
      fieldAddress: field.value.address.toString(),
    });

    return () => {
      return slots?.default();
    };
  },
});

const ArrayBaseItem = observer<ArrayBaseItemProps>(
  defineComponent({
    name: 'ArrayBaseItem',
    inheritAttrs: false,
    props: getArrayBaseItemProps(),
    setup(props: ArrayBaseItemProps, { slots }) {
      const arrayItemContextRef = shallowRef({
        index: props.index,
        record: props.record,
      });

      watch(
        () => {
          return {
            index: props.index,
            record: props.record,
          };
        },
        (nextArrayItemContext) => {
          arrayItemContextRef.value = nextArrayItemContext;
        },
      );

      provideArrayItemContext(arrayItemContextRef);

      return () => {
        return slots?.default();
      };
    },
  }),
);

const SortHandle = defineComponent({
  name: 'ArrayBaseSortHandle',
  props: ['index'],
  setup(props, { attrs }) {
    const array = useArrayContext();
    const prefixCls = `${stylePrefix}-array-base`;

    return () => {
      if (!array || !['editable'].includes(array.field?.pattern)) {
        return null;
      }
      return withDirectives(
        h(DragOutlined, {
          ...attrs,
          class: [`${prefixCls}-sort-handle`, 'sort-helper'],
        }),
        [[HandleDirective]],
      );
    };
  },
});

const ArrayBaseIndex = observer(
  defineComponent({
    name: 'ArrayBaseIndex',
    inheritAttrs: false,
    setup() {
      const indexRef = useArrayIndex();
      const prefixCls = `${stylePrefix}-array-base`;
      return () => {
        return <span class={`${prefixCls}-index`}>{`#${indexRef.value + 1}`}</span>;
      };
    },
  }),
);

const PreviewText = defineComponent({
  props: getPreviewTextProps(),
  setup(props: PreviewTextProps) {
    const record = useArrayItemRecord();

    const prefixCls = `${stylePrefix}-array-base-preview-text`;

    return () => {
      const { colDataIndex, value } = props;

      const val = colDataIndex ? record.value[colDataIndex] : value;

      return <div class={prefixCls}>{val}</div>;
    };
  },
});

export const ArrayBase = Object.assign(ArrayBaseInner, {
  Item: ArrayBaseItem,
  Index: ArrayBaseIndex,
  SortHandle,
  Addition,
  Edit,
  Detail,
  Upload,
  Copy,
  Remove,
  BatchRemove,
  MoveDown,
  MoveUp,
  useArray: useArrayContext,
  useIndex: useArrayIndex,
  useRecord: useArrayItemRecord,
  PreviewText,
});

export default ArrayBase;
