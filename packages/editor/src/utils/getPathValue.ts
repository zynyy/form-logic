import { toArray } from '@/utils/index';
import { DataIndex } from '@/interface';

export const getPathValue = <ValueType, ObjectType extends object>(
  record: ObjectType,
  path?: DataIndex,
): ValueType | null => {
  // Skip if path is empty
  if (!path && typeof path !== 'number') {
    return record as unknown as ValueType;
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
