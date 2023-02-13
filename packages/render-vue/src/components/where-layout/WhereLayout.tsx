import { defineComponent, ref, watch } from 'vue';
import cls from 'classnames';
import { useStylePrefixCls } from '@/components/style/hooks';
import { ClearOutlined, DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons-vue';
import { Button, Divider, Space } from 'ant-design-vue';
import Buttons from '@/components/buttons';
import { getWhereLayoutProps, WhereLayoutProps } from '@/components/where-layout/interface';

const WhereLayout = defineComponent({
  name: 'WhereLayout',
  props: getWhereLayoutProps(),
  setup(props: WhereLayoutProps, { slots }) {
    const prefixCls = useStylePrefixCls('where-layout');

    const expand = ref(false);

    const handleClick = () => {
      const nowExpand = !expand;

      const { onCollapsedClick } = props;

      expand.value = nowExpand;
      onCollapsedClick?.(nowExpand);
    };

    watch(
      () => props.collapsed,
      (nextCollapsed) => {
        expand.value = nextCollapsed;
      },
    );

    const renderHeader = () => {
      if (!props.title) {
        return null;
      }

      return (
        <div class={cls(`${prefixCls}-title-warp`)}>
          <SearchOutlined class={cls(`${prefixCls}-icon`)} />
          <span class={cls(`${prefixCls}-title`)}>{props.title}</span>
        </div>
      );
    };

    const renderCollapseButton = () => {
      const { hasCollapsed } = props;

      if (!hasCollapsed) {
        return null;
      }

      return (
        <>
          <Divider type="vertical" />
          {expand ? (
            <Button type="link" onClick={handleClick}>
              收起
              <UpOutlined />
            </Button>
          ) : (
            <Button type="link" onClick={handleClick}>
              展开
              <DownOutlined />
            </Button>
          )}
        </>
      );
    };

    const renderButtons = () => {
      const {
        hasRestButton,
        hasSearchButton,
        buttons,
        onButtonItemClick,
        onSearchClick,
        onRestClick,
      } = props;

      return (
        <div class={cls(`${prefixCls}-right-button`)}>
          <Space>
            <Buttons buttons={buttons} onClick={onButtonItemClick} />

            {hasRestButton ? (
              <Button
                v-slots={{
                  icon: () => <ClearOutlined />,
                }}
                type="dashed"
                onClick={onRestClick}
              >
                重置
              </Button>
            ) : null}

            {hasSearchButton ? (
              <Button
                v-slots={{
                  icon: () => <SearchOutlined />,
                }}
                type="primary"
                onClick={onSearchClick}
              >
                搜索
              </Button>
            ) : null}

            {renderCollapseButton()}
          </Space>
        </div>
      );
    };

    return () => {
      return (
        <div class={cls(`${prefixCls}-wrapper`)}>
          {renderHeader()}
          <div class={cls(`${prefixCls}-body`)}>{slots.default?.()}</div>
          {renderButtons()}
        </div>
      );
    };
  },
});

export default WhereLayout;
