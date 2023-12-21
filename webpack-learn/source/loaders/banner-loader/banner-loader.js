const schema = require("./schema");
module.exports = function (content) {
  // schema对options的验证规则
  // schema符合JSON Schema规范
  const options = this.getOptions(schema);
  const prefix = `/*
    *author : ${options.author}
    */ 
 `;
  return prefix + content;
};
