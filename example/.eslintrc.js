const path = require("path");
module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['prettier'],
  plugins: ['react', 'react-hooks'],

  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      "typescript": {
        "alwaysTryTypes": true,
        "project": path.join(__dirname,'./tsconfig.json'),
      }
    },
  },
  // https://cloud.tencent.com/developer/chapter/12618
  // https://eslint.org/
  rules: {
    'no-console': [2, { allow: ['warn', 'error', 'log'] }],
    'no-param-reassign': 0,
    'no-restricted-globals': ['error', 'event']
  },
};
