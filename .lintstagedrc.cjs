module.exports = {
  '*.{ts,tsx,js,jsx,json,less,css,scss,md,vue}': (filenames) => {
    const files = filenames.join(' ');
    return [`npx prettier --write ${files}`, `npx eslint --fix ${files}`, `git add ${files}`];
  },
};
