const loaderUtils = require("loader-utils");

module.exports = function (content) {
  // 1. 根据文件内容生成一个带hash名的文件名
  let interpolateName = loaderUtils.interpolateName(
    this,
    "[hash].[ext][query]",
    {
      content,
    }
  );
  interpolateName = `images/${interpolateName}`;
  // console.log(interpolateName);
  // 2. 将文件输出出去
  this.emitFile(interpolateName, content);
  // 3. 返回： module.exports = "文件路径（文件名）"
  return `module.exports = "${interpolateName}"`;
};
// 处理图片，字体等文件，他们是Buffer数据
// 需要使用raw loader才能处理
module.exports.raw = true;
