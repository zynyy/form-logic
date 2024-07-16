export const checkHit = (
  data: any[],
  key: string,
  keyword: string,
): boolean => {
  if (!Array.isArray(data)) {
    return false;
  }
  const { length } = data;
  let index = 0;
  while (index < length) {
    const item = data[index];
    const { children } = item;
    if (item[key]?.includes(keyword)) {
      return item;
    }
    if (Array.isArray(children) && children.length) {
      const findChildrenItem = checkHit(children, key, keyword);
      if (findChildrenItem) {
        return true;
      }
    }
    index += 1;
  }
  return false;
};

export const filterTree = <T = any>(
  data: any[],
  key: string,
  keyword: string,
): T[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.reduce((acc, item) => {
    const { children } = item;

    const isHit = checkHit([item], key, keyword);

    const next = isHit
      ? {
          ...item,
          children: filterTree(children, key, keyword),
        }
      : [];

    return acc.concat(next);
  }, []);
};
