const HYPHEN_DELIMITED = '-';

const LOWER_REG_EXP = new RegExp(`(${HYPHEN_DELIMITED})[a-z]`, 'g');
const UPPER_REG_EXP = new RegExp(`(^|${HYPHEN_DELIMITED})[a-z]`, 'g');

/**
 * 大驼峰转连字符 eg: Aa => a-a; AAA => a-a-a
 * @param str
 */
export const camelCaseToHyphen = (str: string) => {
  return str ? str.replace(/(?<=[A-Za-z0-9])(?=[A-Z])/g, HYPHEN_DELIMITED).toLowerCase() : '';
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

/**
 * 连字符转下划线
 * @param str
 * @example camelCaseToUppercase('foo-bar') foo_bar camelCaseToUppercase('john-smith') john_smith
 */
export const camelCaseToUppercase = (str: string) => {
  return str ? str.split(HYPHEN_DELIMITED).join('_').toUpperCase() : '';
};

export const camelize = (str: string): string => {
  return str.replace(/[\W_]$/, '').replace(/[\W_]([a-zA-Z0-9])/g, (_, x) => x.toUpperCase());
};

/**
 * 帕斯卡命名法
 * @param str
 * @example toPascalCase('foo bar') FooBar toPascalCase('john-smith') JohnSmith
 */
export const toPascalCase = (str: string): string => {
  const trimmed = str.trim();
  return trimmed.substring(0, 1).toUpperCase() + camelize(trimmed.substring(1));
};

export const decamelize = (str: string, sep = '-') => {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
    .replace(/([A-Z])([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
    .toLowerCase();
};
