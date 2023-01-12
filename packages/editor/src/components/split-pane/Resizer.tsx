import { FC } from 'react';

import { ResizerProps } from './interface';

const Resizer: FC<ResizerProps> = ({
  style,
  split,
  className,
  onMouseDown,
  onTouchStart,
  onTouchEnd,

  onClick,
  onDoubleClick,
}) => {
  const classes = ['resizer', split, className].join(' ');

  return (
    <span
      role="presentation"
      className={classes}
      style={style}
      onMouseDown={(event) => onMouseDown(event)}
      onTouchStart={(event) => {
        event.preventDefault();
        onTouchStart(event);
      }}
      onTouchEnd={(event) => {
        event.preventDefault();
        onTouchEnd(event);
      }}
      onClick={(event) => {
        if (onClick) {
          event.preventDefault();
          onClick(event);
        }
      }}
      onDoubleClick={(event) => {
        if (onDoubleClick) {
          event.preventDefault();
          onDoubleClick(event);
        }
      }}
    />
  );
};

export default Resizer;
