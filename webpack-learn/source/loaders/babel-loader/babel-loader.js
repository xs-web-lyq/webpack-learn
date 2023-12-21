const babel = require("@babel/core");
const schema = require("./schema.json");
module.exports = function (content) {
  const options = this.getOptions(schema);
  // 异步loader
  const callback = this.async();

  // 使用babel对代码进行编译转换
  babel.transform(content, options, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result.code);
    }
  });
};
