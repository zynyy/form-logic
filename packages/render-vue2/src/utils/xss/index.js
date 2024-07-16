export const ENTITY_MAP = {
  escape: {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  },
  unescape: {
    '&amp;': '&',
    '&apos;': "'",
    '&gt;': '>',
    '&lt;': '<',
    '&quot;': '"',
  },
};

export const ENTITY_REG = {
  escape: new RegExp(`[${Object.keys(ENTITY_MAP.escape).join('')}]`, 'g'),
  unescape: new RegExp(`(${Object.keys(ENTITY_MAP.unescape).join('|')})`, 'g'),
};

export const escapeSequence = (val) => {
  if (typeof val === 'string') {
    return val.replace(ENTITY_REG.escape, function (match) {
      return ENTITY_MAP.escape[match];
    });
  }

  if (Array.isArray(val)) {
    return val.map((item) => escapeSequence(item));
  }

  if (Object.prototype.toString.call(val) === '[object Object]') {
    const newVal = {};

    Object.keys(val).forEach((key) => {
      newVal[key] = escapeSequence(val[key]);
    });

    return newVal;
  }

  return val;
};

export const unescapeSequence = (val) => {
  if (typeof val === 'string') {
    return val.replace(ENTITY_REG.unescape, function (match) {
      return ENTITY_MAP.unescape[match];
    });
  }

  if (Array.isArray(val)) {
    return val.map((item) => unescapeSequence(item));
  }

  if (Object.prototype.toString.call(val) === '[object Object]') {
    const newVal = {};

    Object.keys(val).forEach((key) => {
      newVal[key] = unescapeSequence(val[key]);
    });

    return newVal;
  }

  return val;
};
