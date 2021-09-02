module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/all',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'arrow-parens': 'off',
  },
};
