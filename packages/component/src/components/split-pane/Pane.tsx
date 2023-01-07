import { CSSProperties, FC, ReactNode } from 'react';
import { Size, Split } from '@/components/split-pane/interface';

export interface PaneProps {
  className?: string;
  size?: Size;
  split?: Split;
  style?: CSSProperties;
  eleRef?: (el: HTMLDivElement) => void;
  children?: ReactNode;
}

const Pane: FC<PaneProps> = ({ className, split, style: styleProps, size, eleRef, children }) => {
  const classes = ['pane', split, className].join(' ');

  let style: CSSProperties = {
    flex: 1,
    position: 'relative',
    outline: 'none',
  };

  if (size !== undefined) {
    if (split === 'vertical') {
      style.width = size;
    } else {
      style.height = size;
      style.display = 'flex';
    }
    style.flex = 'none';
  }

  style = Object.assign({}, style, styleProps || {});

  return (
    <div ref={eleRef} className={classes} style={style}>
      {children}
    </div>
  );
};

export default Pane;
