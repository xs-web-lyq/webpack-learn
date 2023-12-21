const path = require("path"); // node.js 核心模块
const os = require("os"); // node.js 核心模块
// 导入esLint插件
const ESLintPlugin = require("eslint-webpack-plugin");

// 导入html-webpack-plugin插件
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 导入压缩css插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// 导入压缩js插件
const TerserPlugin = require("terser-webpack-plugin");

// 图片压缩

// 获取计算机核数
const threads = os.cpus().length;

// 也可以将其他loader以参数形式传入
function getStyleLoader() {
  return [
    MiniCssExtractPlugin.loader, // 将css提取到单独的文件中
    "css-loader", // 将css,资源编译成commonjs模块到js中
    {
      // 需要将postcss-loader放在css-loader后面，less-loader的前面
      loader: "postcss-loader",
      options: {
        // 给loader添加配置项
        postcssOptions: {
          plugins: [
            [
              "postcss-preset-env", // 可以解决大部分样式兼容问题 --- 需要在package.json中设置兼容性。来指定兼容的浏览器版本打包出符合的css文件
            ],
          ],
        },
      },
    },
  ];
}

module.exports = {
  entry: "./src/main.js",
  output: {
    // 所有文件的输出目录
    // __dirname node.js变量 当前文件所在目录的绝对路径
    path: path.resolve(__dirname, "../dist"),
    // 入口文件打包输出文件名
    filename: "static/js/[name].[contenthash:8].js",
    // 自动情况上一次打包结果 --- webpack4需要使用clean-webpack-plugin插件
    // 原理：在打包前将path目录下的文件删除，在进行打包
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
    essetModuleFilename: "static/media/[hash:10][ext][query]",
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      {
        oneOf: [
          // loader 配置
          {
            test: /\.css$/, // 执行顺序，从 右到左，从下到上
            use: getStyleLoader(),
          },
          {
            test: /\.less$/,
            // loader:'xxx', // 只能按照一个loader
            use: [
              // use 可以按照多个loader
              // compiles Less to CSS
              ...getStyleLoader(),
              "less-loader",
            ],
          },
          {
            test: /\.s[ac]ss$/, // 匹配 .scss 和 .sass
            use: [
              // 将 JS 字符串生成为 style 节点
              ...getStyleLoader(),
              // 将 Sass 编译成 CSS
              "sass-loader",
            ],
          },
          {
            test: /\.styl$/,
            use: [...getStyleLoader(), "stylus-loader"], // 将 Stylus 文件编译为 CSS
          },
          {
            test: /\.(png|jpe?g|webp|gif|svg)$/,
            type: "asset", // 当文件小于一定值可以转base64格式
            parser: {
              dataUrlCondition: {
                // 图片小于10kb，则将图片编译成base64格式----减少请求数量，但是会增大体积---小图可以使用只是增大一点点，大图不可以会使页面渲染慢
                maxSize: 10 * 1024, // 4kb
              },
            },
            generator: {
              // 图片输出目录与名称
              // [hash:10] 图片hash值取前10位]
              filename: "static/images/[hash:10][ext][query]",
            },
          },
          {
            test: /\.(ttf|woff2?|map3|map4|avi)$/, // 因为需要原封不动的将媒体音视频输出所有需要可以通过此配置实现，因为webpack没有处理音视频的loader
            type: "asset/resource", // 字体文件 不会转为base64格式
            generator: {
              // 图片输出目录与名称
              // [hash:10] 图片hash值取前10位]
              filename: "static/media/[hash:10][ext][query]",
            },
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules目录
            include: path.resolve(__dirname, "../src"), // 指定检查的目录
            use: [
              {
                loader: "thread-loader", // 多线程加载器
                options: {
                  workers: threads, // 指定线程数
                },
              },
              {
                loader: "babel-loader",
                // 可以在此设置babel的配置文件，优先级高于.babelrc
                options: {
                  // presets: ["@babel/preset-env"],
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false, // 关闭压缩 --- 压缩会影响打包速度
                  plugins: ["@babel/plugin-transform-runtime"], // 开启babel运行时插件
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    // eslint 插件
    new ESLintPlugin({
      // 指定检查的文件
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 排除检查node_modules目录
      cache: true, // 开启缓存
      // cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslint"), // 指定缓存目录
      threads: threads, // 指定线程数
    }),
    new HtmlWebpackPlugin({
      // 指定模板文件 , 以public/index.html文件创建新的html文件
      // 新的html文件特点：1.结构和原来一致，2.自动引入打包输出的js文件 3.自动引入打包输出的css文件
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }), //创建插件用于-- 将css提取到单独的文件中
    // new CssMinimizerPlugin(), // 压缩css
  ],
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      `...`, // 相当于new TerserPlugin() 压缩js -- 因为在生产环境下默认开启html和js压缩---不需要重复配置
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        // 开启并行压缩
        parallel: threads, // 指定线程数
      }), // 压缩js
    ],
  },
  mode: "production",
  devtool: "source-map", // 生成source-map文件，方便调试
};
