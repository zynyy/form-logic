import {
  CSSProperties,
  FC,
  MouseEvent,
  ReactNode,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import Pane from './Pane';
import Resizer from './Resizer';
import { getDefaultSize, removeNullChildren, unFocus } from './util';
import { Size, Split } from './interface';

export interface SplitPaneProps {
  allowResize?: boolean;
  className?: string;
  primary?: 'left' | 'right';
  minSize: Size;
  maxSize: Size;
  defaultSize?: Size;
  size?: Size;
  split?: Split;
  onDragStarted?: () => void;
  onDragFinished?: (newSize: Size) => void;
  onChange?: (newSize: Size) => void;
  onResizerClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  onResizerDoubleClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  style?: CSSProperties;
  resizerStyle?: CSSProperties;
  resizerClassName?: string;
  step?: number;
  children?: ReactNode;
}

const SplitPane: FC<SplitPaneProps> = ({
  size,
  onDragFinished,
  primary,
  defaultSize,
  allowResize,
  onDragStarted,
  maxSize,
  minSize = 50,
  onChange,
  split,
  step,
  children,
  resizerClassName,
  resizerStyle,
  className,
  onResizerClick,
  onResizerDoubleClick,
  style: styleProps,
}) => {
  const [active, setActive] = useState(false);

  const [position, setPosition] = useState(0);

  const [draggedSize, setDraggedSize] = useState<Size>(0);

  const [paneLeftSize, setPaneLeftSize] = useState<Size | undefined>(undefined);
  const [paneRightSize, setPaneRightSize] = useState<Size | undefined>(undefined);

  const splitPaneRef = useRef<HTMLDivElement | null>(null);
  const paneLeftRef = useRef<HTMLDivElement | null>(null);
  const paneRightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initialSize =
      size !== undefined ? size : getDefaultSize(defaultSize, minSize, maxSize, undefined);
    const isPanelLeftPrimary = primary === 'left';

    if (isPanelLeftPrimary) {
      setPaneLeftSize(initialSize);
      setPaneRightSize(undefined);
    } else {
      setPaneLeftSize(undefined);
      setPaneRightSize(initialSize);
    }
  }, [size, primary]);

  const onMouseDown = (event: MouseEvent<HTMLSpanElement>) => {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    // @ts-ignore
    onTouchStart(eventWithTouches);
  };

  const onTouchStart = (event: TouchEvent<HTMLSpanElement>) => {
    if (allowResize) {
      unFocus(document);

      if (typeof onDragStarted === 'function') {
        onDragStarted();
      }
      setPosition(split === 'vertical' ? event.touches[0].clientX : event.touches[0].clientY);
      setActive(true);
    }
  };

  const onMouseMove = (event: MouseEvent<HTMLSpanElement>) => {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    // @ts-ignore
    onTouchMove(eventWithTouches);
  };

  const onTouchMove = (event: TouchEvent<HTMLSpanElement>) => {
    if (allowResize && active) {
      const isPrimaryFirst = primary === 'left';
      const ref = isPrimaryFirst ? paneLeftRef.current : paneRightRef.current;
      const ref2 = isPrimaryFirst ? paneRightRef.current : paneLeftRef.current;
      if (ref) {
        const node = ref;
        if (node.getBoundingClientRect) {
          const width = node.getBoundingClientRect().width;
          const height = node.getBoundingClientRect().height;
          const current =
            split === 'vertical' ? event.touches[0].clientX : event.touches[0].clientY;
          const size = split === 'vertical' ? width : height;
          let positionDelta = position - current;
          if (step) {
            if (Math.abs(positionDelta) < step) {
              return;
            }
            // Integer division
            // eslint-disable-next-line no-bitwise
            positionDelta = ~~(positionDelta / step) * step;
          }
          let sizeDelta = isPrimaryFirst ? positionDelta : -positionDelta;

          const pane1Order = parseInt(window.getComputedStyle(node).order);
          const pane2Order = ref2 ? parseInt(window.getComputedStyle(ref2).order) : 0;
          if (pane1Order > pane2Order) {
            sizeDelta = -sizeDelta;
          }

          let newMaxSize = maxSize;
          if (maxSize !== undefined && maxSize <= 0 && splitPaneRef.current) {
            const splitPane = splitPaneRef.current;

            if (split === 'vertical') {
              newMaxSize = splitPane.getBoundingClientRect().width + Number(maxSize);
            } else {
              newMaxSize = splitPane.getBoundingClientRect().height + Number(maxSize);
            }
          }

          let newSize: Size = size - sizeDelta;
          const newPosition = position - positionDelta;

          if (newSize < minSize) {
            newSize = minSize;
          } else if (maxSize !== undefined && newSize > newMaxSize) {
            newSize = newMaxSize;
          } else {
            setPosition(newPosition);
          }

          onChange?.(newSize);

          setDraggedSize(newSize);

          if (isPrimaryFirst) {
            setPaneLeftSize(newSize);
          } else {
            setPaneRightSize(newSize);
          }
        }
      }
    }
  };

  const onMouseUp = () => {
    if (allowResize && active) {
      if (typeof onDragFinished === 'function') {
        onDragFinished(draggedSize);
      }

      setActive(false);
    }
  };

  const disabledClass = allowResize ? '' : 'disabled';

  const notNullChildren = removeNullChildren(children);

  const style: CSSProperties = {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    outline: 'none',
    overflow: 'hidden',
    MozUserSelect: 'text',
    WebkitUserSelect: 'text',
    msUserSelect: 'text',
    userSelect: 'text',
    height: '100%',
    ...styleProps,
  };

  if (split === 'vertical') {
    Object.assign(style, {
      flexDirection: 'row',
      left: 0,
      right: 0,
    });
  } else {
    Object.assign(style, {
      bottom: 0,
      flexDirection: 'column',
      minHeight: '100%',
      top: 0,
      width: '100%',
    });
  }

  const classes = ['split-pane', className, split, disabledClass];

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    // @ts-ignore
    document.addEventListener('mousemove', onMouseMove);
    // @ts-ignore
    document.addEventListener('touchmove', onTouchMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      // @ts-ignore
      document.removeEventListener('mousemove', onMouseMove);
      // @ts-ignore
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [active, position]);

  return (
    <div className={classes.join(' ')} ref={splitPaneRef} style={style}>
      <Pane
        eleRef={(node) => {
          paneLeftRef.current = node;
        }}
        size={paneLeftSize}
        split={split}
        className="pane-left"
      >
        {notNullChildren[0]}
      </Pane>
      <Resizer
        className={[disabledClass, resizerClassName].join(' ')}
        onClick={onResizerClick}
        onDoubleClick={onResizerDoubleClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onMouseUp}
        split={split || 'vertical'}
        style={resizerStyle || {}}
      />
      <Pane
        eleRef={(node) => {
          paneRightRef.current = node;
        }}
        size={paneRightSize}
        split={split}
        className="pane-right"
      >
        {notNullChildren[1]}
      </Pane>
    </div>
  );
};

SplitPane.defaultProps = {
  allowResize: true,
  minSize: 50,
  primary: 'left',
  split: 'vertical',
};

export default SplitPane;
