// 创建style标签 --- 并将style标签插入head中

module.exports = function (content) {
  //     /**
  //      * 1. 直接使用自定义style-loader只能处理样式，不能处理样式中引入的其他资源
  //      * use: ["./loaders/style-loader"],
  //      * 2. 借助css-loader解决样式中引入其他的资源，
  //      * use: ["./loaders/style-loader", "css-loader"],
  //      * 问题：css-loader暴露了一段js代码，style-loader需要执行js代码，得到返回值，再动态创建style标签，插入到页面上，不好操作
  //      * 官方使用patch-loader解决
  //      */
  //     const script = `const styleEl = document.createElement('style');
  //     styleEl.innerHTML = ${JSON.stringify(content)};
  //     document.head.appendChild(styleEl);
  //     `;
  //     return script;
};

module.exports.pitch = function (remainingRequest) {
  // 剩下还需要处理的loader
  // console.log(remainingRequest);//D:\webpack-learn\source\node_modules\css-loader\dist\cjs.js!D:\webpack-learn\source\src\css\index.css
  // 1. 将remainingRequest中的绝对路径改为相对路径（因为后面只能使用相对路径操作）
  //D:..\..\node_modules\css-loader\dist\cjs.js!..\..\src\css\index.css
  const relativePath = remainingRequest
    .split("!")
    .map((absolutePath) => {
      return this.utils.contextify(this.context, absolutePath);
    })
    .join("!");
  // console.log(relativePath); //../../node_modules/css-loader/dist/cjs.js!./index.css
  const script = `
    import style from "!!${relativePath}";
    const styleEl = document.createElement('style');
    styleEl.innerHTML = style;
    document.head.appendChild(styleEl);
    `;
  // 在此时进行熔断操作，终止后面的loader执行 --- 在script中通过相对路径引入了css-loader进行line-loader处理，所以我们也需要终止css-loader触发熔断终止后面的loader执行
  return script;
};
