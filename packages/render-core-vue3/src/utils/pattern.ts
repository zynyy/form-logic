export const URL_PATTERN = new RegExp(
  // protocol identifier
  '^(?:(?:(?:https?|ftp|rtmp):)?//)' +
    // user:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    // IP address exclusion - private & local networks
    // Reference: https://www.arin.net/knowledge/address_filters.html

    // filter 10.*.*.* and 127.*.*.* addresses
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    // filter 169.254.*.* and 192.168.*.*
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    // filter 172.16.0.0 - 172.31.255.255
    // TODO: add test to validate that it invalidates address in 16-31 range
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broadcast addresses
    // (first & last IP address of each class)

    // filter 1. part for 1-223
    '(?:22[0-3]|2[01]\\d|[1-9]\\d?|1\\d\\d)' +
    // filter 2. and 3. part for 0-255
    '(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d{1,2})){2}' +
    // filter 4. part for 1-254
    '(?:\\.(?:25[0-4]|2[0-4]\\d|1\\d\\d|[1-9]\\d?))' +
    '|' +
    // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9_]-*)*[a-z\\u00a1-\\uffff0-9_]+)' +
    // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9_]-*)*[a-z\\u00a1-\\uffff0-9_]+)*' +
    // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff_]{2,}))' +
    ')' +
    // port number
    '(?::\\d{2,5})?' +
    // resource path
    '(?:/?\\S*)?$',
);

export const EMAIL_PATTERN = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export const NUMBER_PATTERN = /^[+-]?\d+(\.\d+)?$/;
export const DATE_PATTERN =
  /^[0-9]+[./-][0-9]+[./-][0-9]+\s*(?:[0-9]+\s*:\s*[0-9]+\s*:\s*[0-9]+)?$/;

export const PHONE_PATTERN = /^\d{3}-\d{8}$|^\d{4}-\d{7}$|^\d{11}$/;

export const INTEGER_PATTERN = /^[+-]?\d+$/;

export const IP4_PATTERN =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export const IP6_PATTERN =
  /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])$/;

export const ORIGIN_DOMAIN = /^((http|https|ftp):\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}(:[0-9]+)?$/;

export const CODE_PATTERN = /^[a-z.]+$/;

export const PATHNAME = /^\/[a-zA-Z0-9/-]+(\?[a-zA-Z0-9.=&-]+)?$/;

export const START_LETTER_NUM_UNDERLINE = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export const START_LETTER_NUM_SPECIAL_CHARACTERS =
  /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()_+-=,.<>?/\\|[\]{}]*$/;
