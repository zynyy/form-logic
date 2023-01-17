import { CSSProperties, FC, PropsWithChildren, useEffect, useState } from 'react';

import { Divider, Button, Space } from 'antd';

import { ClearOutlined, DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { useWhereLayoutStyle } from '@/components/schema-layout/hooks';
import cls from 'classnames';
import { EventsObject, LogicConfig, MetaSchemaData } from '@/interface';
import Buttons, { ButtonsProps } from '@/components/buttons';

export interface WhereLayoutProps extends PropsWithChildren {
  title?: React.ReactNode;
  buttons?: MetaSchemaData[];
  className?: string;
  style?: CSSProperties;
  collapsed?: boolean;
  hasCollapsed?: boolean;
  hasRestButton?: boolean;
  hasSearchButton?: boolean;
  onCollapsedClick?: (collapsed: Boolean) => void;
  onRestClick?: () => void;
  onSearchClick?: () => void;
  onButtonItemClick?: ButtonsProps['onClick'];
  getLogicConfig?: LogicConfig;
  events?: EventsObject;
}

const WhereLayout: FC<WhereLayoutProps> = ({
  hasCollapsed,
  title,
  buttons,
  children,
  className,
  style,
  collapsed,
  onCollapsedClick,
  onRestClick,
  onSearchClick,
  onButtonItemClick,
  hasRestButton,
  hasSearchButton,
}) => {
  const [expand, setExpand] = useState(false);

  const [warpSSR, hashId, prefixCls] = useWhereLayoutStyle();

  const handleClick = () => {
    const nowExpand = !expand;
    setExpand(nowExpand);
    onCollapsedClick?.(nowExpand);
  };

  useEffect(() => {
    setExpand(collapsed);
  }, [collapsed]);

  const renderHeader = () => {
    if (!title) {
      return null;
    }

    return (
      <div className={cls(`${prefixCls}-title-warp`, hashId)}>
        <SearchOutlined className={cls(`${prefixCls}-icon`, hashId)} />
        <span className={cls(`${prefixCls}-title`, hashId)}>{title}</span>
      </div>
    );
  };

  const renderCollapseButton = () => {
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
    return (
      <div className={cls(`${prefixCls}-right-button`, hashId)}>
        <Space>
          <Buttons buttons={buttons} onClick={onButtonItemClick} />

          {hasRestButton ? (
            <Button icon={<ClearOutlined />} type="dashed" onClick={onRestClick}>
              重置
            </Button>
          ) : null}

          {hasSearchButton ? (
            <Button icon={<SearchOutlined />} type="primary" onClick={onSearchClick}>
              搜索
            </Button>
          ) : null}

          {renderCollapseButton()}
        </Space>
      </div>
    );
  };

  return warpSSR(
    <div className={cls(className, hashId, `${prefixCls}-wrapper`)} style={style}>
      {renderHeader()}
      <div className={cls(`${prefixCls}-body`, hashId)}>{children}</div>
      {renderButtons()}
    </div>,
  );
};

WhereLayout.defaultProps = {
  hasCollapsed: true,
  hasRestButton: true,
  hasSearchButton: true,
};

export default WhereLayout;
