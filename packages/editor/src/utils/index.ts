import JSZip from "jszip";
import {DataUri} from "@antv/x6";

export * from './request';
export * from './analyzeDeps';
export * from './validateGraph';
export * from './compile-code'


export const scaleFormatter = (scale: number): string => {
  return (scale * 100).toFixed(0) + "%";
};

export const arrayToNestJson = (arr: string[], value: any) => {
  const { length } = arr;
  let temp = {};
  let result: {
    [key: string]: any;
  } = {};
  const lastIndex = length - 1;
  let index = lastIndex;
  while (index >= 0) {
    const key = arr[index];
    result[key] = index === lastIndex ? value : temp;
    if (index > 0) {
      temp = result;
      result = {};
    }
    index = index - 1;
  }
  return result;
};

export const toArray = <T>(arr: T | readonly T[]): T[] => {
  if (arr === undefined || arr === null) {
    return [];
  }
  return (Array.isArray(arr) ? arr : [arr]) as T[];
};

const HEX = "zyxwvutsrqponmlkjihgfedcba9876543210";

export const uid = (len?: number) => {
  let str = "";
  let num = len || 6;

  while (num--) {
    str += HEX[(Math.random() * 36) | 0];
  }
  return str;
};

export const getGraphId = (prefix: string) => {
  return `${prefix || "cell"}-${uid(8)}`;
};

const recursiveZip = (root: JSZip, json: any) => {
  if (typeof json !== "object" || json === null) {
    return;
  }
  for (const key in json) {
    const val = json[key];
    if (typeof val === "string") {
      root.file(key, val);
    } else {
      const dir = root.folder(key) as JSZip;
      recursiveZip(dir, val);
    }
  }
};

export const downloadZip = (content: any, fileName: string) => {
  const zip = new JSZip();

  recursiveZip(zip, content);
  zip.generateAsync({ type: "blob" }).then((blob) => {
    DataUri.downloadBlob(blob, `${fileName || "logic"}.zip`);
  });
};

export type DataIndex = string | number | readonly (string | number)[];

export const getPathValue = <ValueType, ObjectType extends object>(
  record: ObjectType,
  path?: DataIndex
): ValueType | null => {
  // Skip if path is empty
  if (!path && typeof path !== "number") {
    return (record as unknown) as ValueType;
  }

  const pathList = toArray(path);

  let current: ValueType | ObjectType = record;

  for (let i = 0; i < pathList.length; i += 1) {
    if (!current) {
      return null;
    }

    const prop = pathList[i];
    // @ts-ignore
    current = current[prop];
  }

  return current as ValueType;
};
