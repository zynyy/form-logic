import { CSSProperties, FC, PropsWithChildren } from 'react';

import cn from 'classnames';

import './style/index.css';

interface SchemaLayoutProps extends PropsWithChildren {
  footer?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  height?: number;
}

const SchemaLayout: FC<SchemaLayoutProps> = ({
  header,
  footer,
  children,
  className,
  height,
  style,
}) => {
  const renderHeader = () => {
    if (!header) {
      return null;
    }

    return <div className="schema-layout-content-header">{header}</div>;
  };

  const renderFooter = () => {
    if (!footer) {
      return null;
    }

    return <div className="schema-layout-content-footer">{footer}</div>;
  };

  return (
    <div className={cn(className, 'schema-layout-content-wrapper')} style={{ ...style, height }}>
      {renderHeader()}
      <div className="schema-layout-content-body">{children}</div>
      {renderFooter()}
    </div>
  );
};

export default SchemaLayout;
