class CleanWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    // 获取输出路径
    const outputPath = compiler.options.output.path;
    // 拿到fs
    const fs = compiler.outputFileSystem;
    // console.log(outputPath);
    // 注册钩子，在打包输出之前emit
    compiler.hooks.emit.tap("CleanWebpackPlugin", (compilation) => {
      // 通过fs删除打包输出的目录下的所有文件
      this.removeFiles(fs, outputPath);
    });
  }
  removeFiles(fs, filePath) {
    // 想要删除打包输出目录下所有资源，需要先将目录下的资源删除，才能删除这个目录
    // 1. 读取当前目录下所有资源
    const files = fs.readdirSync(filePath);
    // console.log(files); //[ 'images', 'index.html', 'js' ]
    // 2. 遍历所有文件
    files.forEach((file) => {
      // 判断当前文件是否是文件夹
      const path = `${filePath}/${file}`;
      // 获取当前文件的状态
      const fileStat = fs.statSync(path);
      if (fileStat.isDirectory()) {
        // 如果是文件夹，递归调用removeFiles方法
        this.removeFiles(fs, path);
      } else {
        // 如果是文件，直接删除
        fs.unlinkSync(path);
      }
    });
  }
}

module.exports = CleanWebpackPlugin;
