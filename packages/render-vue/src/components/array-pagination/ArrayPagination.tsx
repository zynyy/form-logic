import { defineComponent, ref, watch } from 'vue';
import { Pagination, Space } from 'ant-design-vue';
import cls from 'classnames';
import PaginationStatusSelect from '@/components/pagination-status-select';
import { STYLE_PREFIX } from '@/utils/constant';
import {
  ArrayPaginationProps,
  getArrayPaginationProps,
} from '@/components/array-pagination/interface';

const prefixCls = `${STYLE_PREFIX}-array-pagination`;

const ArrayPagination = defineComponent({
  props: getArrayPaginationProps(),
  setup(props: ArrayPaginationProps, { slots }) {
    const current = ref(1);
    const pageSize = props.pageSize || 10;

    const handleChange = (nextCurrent: number) => {
      current.value = nextCurrent;
      props.onChange?.(current.value, pageSize);
    };

    watch(
      () => props.dataSource,
      (nextDataSource) => {
        const total = nextDataSource?.length || 0;
        const totalPage = Math.ceil(total / pageSize);

        if (totalPage > 0 && totalPage < current.value) {
          handleChange(totalPage);
        }
      },
    );

    return () => {
      const {
        pageSize: propsPageSize,
        size: propsSize,
        dataSource: propsDataSource,
        onChange,
        ...restProps
      } = props;

      const size = props.size || 'small';
      const dataSource = props.dataSource || [];
      const startIndex = (current.value - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      const total = dataSource?.length || 0;
      const totalPage = Math.ceil(total / pageSize);

      const pages = Array.from(new Array(totalPage)).map((_, index) => {
        const page = index + 1;
        return {
          label: page,
          value: page,
        };
      });

      const renderPagination = () => {
        if (totalPage <= 1) return;
        return (
          <div class={cls(`${prefixCls}`)}>
            <Space>
              <PaginationStatusSelect
                value={current.value}
                pageSize={pageSize}
                onChange={handleChange}
                options={pages}
              />
              <Pagination
                {...restProps}
                pageSize={pageSize}
                current={current.value}
                total={dataSource.length}
                size={size}
                showSizeChanger={false}
                onChange={handleChange}
                hideOnSinglePage
              />
            </Space>
          </div>
        );
      };

      return slots.default(dataSource?.slice(startIndex, endIndex + 1), renderPagination(), {
        startIndex,
        endIndex,
      });
    };
  },
});

export default ArrayPagination;
