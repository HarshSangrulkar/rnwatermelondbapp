module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
  ],
};
