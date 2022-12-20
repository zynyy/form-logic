import qs from 'qs';

export const getPageQuery = (search) => qs.parse(search, { ignoreQueryPrefix: true });

/**
 * 笛卡尔乘积
 * @param chunks
 * @returns {[]}
 * @constructor
 */
export const CartesianProduct = (...chunks) => {
  const result = [];

  const { length } = chunks;

  const lastIndex = length - 1;

  const helper = (chunkIndex, prev) => {
    const chunk = chunks[chunkIndex];
    const isLast = chunkIndex === lastIndex;

    chunk.forEach((item) => {
      const current = prev.concat(item);
      if (isLast) {
        result.push(current);
      } else {
        helper(chunkIndex + 1, current);
      }
    });
  };

  helper(0, []);

  return result;
};

export const getTag = (value) => Object.prototype.toString.call(value);

export const compareSimilarity = (
  inputString,
  targetString,
  insertion?: number,
  substitution?: number,
  removal?: number,
) => {
  if (inputString === targetString) return 0;

  const removalCost = removal || 1; // 删除权重
  const insertionCost = insertion || 1; // 插入权重
  const substitutionCost = substitution || 1; // 替换权重

  const { length: inputLength } = inputString;
  const { length: targetLength } = targetString;

  if (!inputLength) {
    return inputLength * insertionCost;
  }

  if (!targetLength) {
    return targetLength * removalCost;
  }

  const inputArray = inputString.split('');
  const targetArray = targetString.split('');

  let weight = 0;

  let input = inputArray.shift();
  let target = targetArray.shift();

  while (input && target) {
    if (input !== target) {
      weight += substitutionCost;
    }
    input = inputArray.shift();
    target = targetArray.shift();
  }

  if (inputLength > targetLength) {
    const removeLength = inputLength - targetLength;
    weight += removeLength * removalCost;
  } else if (inputLength < targetLength) {
    const insertLength = targetLength - inputLength;
    weight += insertLength * insertionCost;
  }

  return weight;
};


export const getQueryUrl = (url, query) => {
  return `${url}?${qs.stringify(query)}`
}
