import JSZip from 'jszip';
import { DataUri } from '@antv/x6';

export * from './analyzeDeps';
export * from './validateGraph';
export * from './compile-code';

export const scaleFormatter = (scale: number): string => {
  return (scale * 100).toFixed(0) + '%';
};


export const toArray = <T>(arr: T | readonly T[]): T[] => {
  if (arr === undefined || arr === null) {
    return [];
  }
  return (Array.isArray(arr) ? arr : [arr]) as T[];
};

const HEX = 'zyxwvutsrqponmlkjihgfedcba9876543210';

export const uid = (len?: number) => {
  let str = '';
  let num = len || 6;

  while (num--) {
    str += HEX[(Math.random() * 36) | 0];
  }
  return str;
};

export const getGraphId = (prefix: string) => {
  return `${prefix || 'cell'}-${uid(8)}`;
};

const recursiveZip = (root: JSZip, json: any) => {
  if (typeof json !== 'object' || json === null) {
    return;
  }
  for (const key in json) {
    const val = json[key];
    if (typeof val === 'string') {
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
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    DataUri.downloadBlob(blob, `${fileName || 'logic'}.zip`);
  });
};
