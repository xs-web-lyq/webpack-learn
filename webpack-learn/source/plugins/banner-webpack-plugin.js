class BannerWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "BannerWebpackPlugin",
      (compilation, callback) => {
        debugger;
        const assets = Object.keys(compilation.assets).filter((item) => {
          return /\.js$/.test(item) || /\.css$/.test(item);
        });
        // 1. 获取即将输出的资源文件，compliation.assets
        // 2. 过滤只保留js和css资源
        // 3. 遍历剩下的资源文件，并对其进行处理

        const prefix = `
      /*
      * author : liuyongqi
      */
     `;

        assets.forEach((asset) => {
          // 获取资源文件内容
          const source = compilation.assets[asset];
          const content = prefix + source;
          // 重新设置资源文件内容
          compilation.assets[asset] = {
            // 最终资源输出时，调用source方法， source方法的返回值就是资源的具体内容。
            source() {
              return content;
            },
            // 资源大小
            size() {
              return content.length;
            },
          };
        });
        callback();
      }
    );
  }
}

module.exports = BannerWebpackPlugin;
