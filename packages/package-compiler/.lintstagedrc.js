module.exports = {
  '*.{ts,tsx,js,jsx,json,less,css,scss,md,vue}': (filenames) => {
    const files = filenames.join(' ');
    return [`npx eslint --fix ${files}`, `npx prettier --write ${files}`, `git add ${files}`];
  },
};
