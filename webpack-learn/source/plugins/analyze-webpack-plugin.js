class AnalyzeWebpackPlugin {
  apply(compiler) {
    debugger;
    compiler.hooks.emit.tap("AnayzeWebpackPlugin", (compilation) => {
      // 获取文件列表
      const assets = Object.entries(compilation.assets);
      // 定义表格前缀
      let content = `| 资源名称 | 资源大小 |
| --- | --- |`;
      // 遍历文件列表-- 构造表格
      assets.forEach(([name, asset]) => {
        content += `\n| ${name} | ${Math.ceil(asset.size() / 1024)}kb |`;
      });
      // 添加到assets中
      compilation.assets["analyze.md"] = {
        source: () => content,
        size: () => content.length,
      };
    });
  }
}

module.exports = AnalyzeWebpackPlugin;
