import {CSSProperties, MouseEvent, ReactNode, TouchEvent} from "react";

export type Size = string | number;

export type Split = "vertical" | "horizontal";

export interface SplitPaneProps {
  allowResize?: boolean;
  className?: string;
  primary?: "first" | "second";
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
  paneStyle?: CSSProperties;
  pane1Style?: CSSProperties;
  pane2Style?: CSSProperties;
  resizerClassName?: string;
  paneClassName?: string;
  pane1ClassName?: string;
  pane2ClassName?: string;
  step?: number;
  children?: ReactNode;
}

export interface ResizerProps {
  className: string;
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  onDoubleClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  onMouseDown: (event: MouseEvent<HTMLSpanElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLSpanElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLSpanElement>) => void;

  split: Split;
  style: CSSProperties;
}

export interface PaneProps {
  className?: string;
  size?: Size;
  split?: Split;
  style?: CSSProperties;
  eleRef?: (el: HTMLDivElement) => void;
  children?: ReactNode;
}
