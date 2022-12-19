import cn from 'classnames';
import { CSSProperties, FC, PropsWithChildren, useEffect, useState } from 'react';

import { Divider, Button } from 'antd';

import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';

export interface WhereLayoutProps extends PropsWithChildren {
  title?: React.ReactNode;
  buttons?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  collapsed?: boolean;
  hasCollapsed?: boolean;
  onCollapsedClick?: (collapsed: Boolean) => void;
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
}) => {
  const [expand, setExpand] = useState(false);

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
      <div className="where-layout-content-title">
        <SearchOutlined className="where-icon" />
        <span className="where-title">{title}</span>
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
    if (!buttons) {
      return null;
    }

    return (
      <div className="where-layout-content-button">
        {buttons}
        {renderCollapseButton()}
      </div>
    );
  };

  return (
    <div className={cn(className, 'where-layout-content-wrapper')} style={style}>
      {renderHeader()}
      <div className="where-layout-content-body">{children}</div>
      {renderButtons()}
    </div>
  );
};

WhereLayout.defaultProps = {
  hasCollapsed: true,
};

export default WhereLayout;
