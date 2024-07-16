export enum FileSizeUnit {
  B = 1,
  KB = 1024,
  MB = 1024 ** 2,
  GB = 1024 ** 3,
  TB = 1024 ** 4,
  PB = 1024 ** 5,
  EB = 1024 ** 6,
  ZB = 1024 ** 7,
  YB = 1024 ** 8,
}

export type FileSizeUnitType = keyof typeof FileSizeUnit;

export const parseFileSize = (size: number, unit?: FileSizeUnitType): number => {
  return size * (FileSizeUnit[unit ?? 'B'] ?? FileSizeUnit.B);
};
