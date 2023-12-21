const HtmlWebpackPlugin = require("safe-require")("html-webpack-plugin");

class InlineChunkWebpackPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "InlineChunkWebpackPlugin",
      (compilation) => {
        // 1. 获取htmlWebpackPlugin的钩子
        const hooks = HtmlWebpackPlugin.getHooks(compilation);
        // 2. 注册一个新的钩子
        // 3. 从里面将script的runtime文件，变成inline script
        hooks.alterAssetTagGroups.tap("InlineChunkWebpackPlugin", (assets) => {
          // console.log(headTags, bodyTags);
          assets.headTags = this.getInlineChunk(
            assets.headTags,
            compilation.assets
          );
          assets.bodyTags = this.getInlineChunk(
            assets.bodyTags,
            compilation.assets
          );
        });
        hooks.afterEmit.tap("InlineChunkWebpackPlugin", () => {
          Object.keys(compilation.assets).forEach((filepath) => {
            if (this.options.some((item) => item.test(filepath))) {
              delete compilation.assets[filepath];
            }
          });
        });
      }
    );
  }
  getInlineChunk(tags, assets) {
    /**
             *  当前 ：{
                  tagName: 'script',
                  voidTag: false,
                  meta: { plugin: 'html-webpack-plugin' },
                  attributes: { defer: true, src: 'js/runtime~main.js.js' }
                },
                修改为：{
                  tagName:'script',
                  innerHTML:runtime文件的内容
                  closeTag:true
                }
             */
    return tags.map((tag) => {
      if (tag.tagName !== "script") return tag;
      // 获取文件资源路径
      const filepath = tag.attributes.src;
      if (!this.options.some((item) => item.test(filepath))) return tag;
      return {
        tagName: "script",
        innerHTML: assets[filepath].source(),
        closeTag: true,
      };
    });
  }
}

module.exports = InlineChunkWebpackPlugin;
