/**
 * @description 用于测试的插件
 * @class TestPlugin
 * 1. webpack 加载webpack.config.js中所有的配置，此时就会new TestPlugin(), 执行插件的构造方法constructor
 * 2. webpack 创建compiler对象，调用插件的apply方法
 * 3. 遍历所有的plugins中的插件，调用插件的apply方法
 * 4. 编译流程，触发各个hooks事件
 */

module.exports = class TestPlugin {
  constructor() {
    console.log("TestPlugin constructor");
  }
  apply(compiler) {
    debugger;
    console.log(compiler);
    console.log("TestPlugin apply");
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      console.log(compilation);
      setTimeout(() => {
        console.log("TestPlugin make 111");
        callback();
      }, 1000);
    });
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("TestPlugin make 333");
        callback();
      }, 3000);
    });
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("TestPlugin make 222");
        callback();
      }, 2000);
    });
  }
};
