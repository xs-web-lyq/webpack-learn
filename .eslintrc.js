module.exports = {
  extends: ["eslint:recommended"],
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器全局变量
  },
  parserOptions: {
    ecmaVersion: 6, // 指定ECMA的版本
    sourceType: "module", // 指定源码的类型，script还是module
  },
  rules: {
    "no-var": 2, // 禁用var
  },
};
