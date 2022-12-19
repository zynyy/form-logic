module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        shippedProposals: true,
        useBuiltIns: 'usage',
        corejs: '3.22',
        modules: false,
        targets: { chrome: '100' },
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
};
