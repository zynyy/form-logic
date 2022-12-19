import {Children, ReactNode} from "react";
import {Size} from "./interface";

export const unFocus = (document: Document) => {
  document.getSelection()?.removeAllRanges();
};

export const getDefaultSize = (
  defaultSize: Size | undefined,
  minSize: Size | undefined,
  maxSize: Size | undefined,
  draggedSize: Size | undefined
) => {
  if (typeof draggedSize === "number") {
    const min = typeof minSize === "number" ? minSize : 0;
    const max =
      typeof maxSize === "number" && maxSize >= 0 ? maxSize : Infinity;
    return Math.max(min, Math.min(max, draggedSize));
  }
  if (defaultSize !== undefined) {
    return defaultSize;
  }
  return minSize;
};

export const removeNullChildren = (children: ReactNode) => {
  return Children.toArray(children).filter((c) => c);
};

export const getUnit = (size: string) => {
  if (size.endsWith("px")) {
    return "px";
  }

  if (size.endsWith("%")) {
    return "%";
  }

  return "ratio";
};

export const convertSizeToCssValue = (value: string, resizersSize: string) => {
  if (getUnit(value) !== "%") {
    return value;
  }

  if (!resizersSize) {
    return value;
  }

  const idx = value.search("%");
  const percent = Number(value.slice(0, idx)) / 100;
  if (percent === 0) {
    return value;
  }

  return `calc(${value} - ${resizersSize}px*${percent})`;
};

const convertToUnit = (size: number, unit: string, containerSize: number) => {
  switch (unit) {
    case "%":
      return `${((size / containerSize) * 100).toFixed(2)}%`;
    case "px":
      return `${size.toFixed(2)}px`;
    case "ratio":
      return (size * 100).toFixed(0);
  }
};
