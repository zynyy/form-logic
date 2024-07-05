const HYPHEN_DELIMITED = '-';

const LOWER_REG_EXP = new RegExp(`(${HYPHEN_DELIMITED})[a-z]`, 'g');
const UPPER_REG_EXP = new RegExp(`(^|${HYPHEN_DELIMITED})[a-z]`, 'g');

/**
 * 大驼峰转连字符 eg: Aa => a-a; AAA => a-a-a
 * @param str
 */
export const camelCaseToHyphen = (str: string) => {
  return str
    ? str.replace(/(?<=[A-Za-z0-9])(?=[A-Z])/g, HYPHEN_DELIMITED).toLowerCase()
    : '';
};

/**
 * 首字母大写 eg: aa => Aa;
 * @param str
 */

export const toFirstUpperCase = (str: string) => {
  return str ? str.replace(/(^)[a-z]/, (val) => val.toLocaleUpperCase()) : '';
};

/**
 * 连字符转小驼峰
 * @param str
 */
export const hyphenToLowerCamelCase = (str: string) => {
  return str
    ? str
        .toLowerCase()
        .replace(LOWER_REG_EXP, (val) => val.toUpperCase())
        .split(HYPHEN_DELIMITED)
        .join('')
    : '';
};

/**
 * 连字符转大驼峰
 * @param str
 */

export const hyphenToUpperCamelCase = (str: string) => {
  return str
    ? str
        .toLowerCase()
        .replace(UPPER_REG_EXP, (val) => val.toUpperCase())
        .split(HYPHEN_DELIMITED)
        .join('')
    : '';
};

export const camelCaseToUppercase = (str: string) => {
  return str ? str.split(HYPHEN_DELIMITED).join('_').toUpperCase() : '';
};
