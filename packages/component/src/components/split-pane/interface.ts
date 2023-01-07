import {CSSProperties, MouseEvent, ReactNode, TouchEvent} from "react";

export type Size = string | number;

export type Split = "vertical" | "horizontal";



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


