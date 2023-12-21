const path = require("path"); // node.js 核心模块
const os = require("os"); // node.js 核心模块
// 导入esLint插件
const ESLintPlugin = require("eslint-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const threads = os.cpus().length; // 获取cpu核数

module.exports = {
  entry: "./src/main.js",
  output: {
    // 所有文件的输出目录
    // __dirname node.js变量 当前文件所在目录的绝对路径
    path: path.resolve(__dirname, "../dist"),
    // 入口文件打包输出文件名
    filename: "js/bundle.js",
  },
  // 加载器
  module: {
    rules: [
      {
        // 每个文件只会被其中一个组loader处理，匹配成功之后就不在继续匹配其他loader
        oneOf: [
          // loader 配置
          {
            test: /\.css$/, // 执行顺序，从 右到左，从下到上
            use: [
              "style-loader", // style-loader 通过常见style标签插入html文件中生效
              "css-loader", // 将css,资源编译成commonjs模块到js中
            ],
          },
          {
            test: /\.less$/,
            // loader:'xxx', // 只能按照一个loader
            use: [
              // use 可以按照多个loader
              // compiles Less to CSS
              "style-loader",
              "css-loader",
              "less-loader",
            ],
          },
          {
            test: /\.s[ac]ss$/, // 匹配 .scss 和 .sass
            use: [
              // 将 JS 字符串生成为 style 节点
              "style-loader",
              // 将 CSS 转化成 CommonJS 模块
              "css-loader",
              // 将 Sass 编译成 CSS
              "sass-loader",
            ],
          },
          {
            test: /\.styl$/,
            use: ["style-loader", "css-loader", "stylus-loader"], // 将 Stylus 文件编译为 CSS
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
            include: path.resolve(__dirname, "../src"), // 指定目录，只处理指定目录
            use: [
              {
                loader: "thread-loader",
                options: {
                  workers: threads, // 指定线程数
                },
              },
              {
                loader: "babel-loader",
                // 可以在此设置babel的配置文件，优先级高于.babelrc
                options: {
                  // presets: ["@babel/preset-env"],
                  cacheDirectory: true, // 开启缓存，下次打包直接使用缓存
                  cacheCompression: false, // 关闭缓存压缩
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
      exclude: "node_modules", // 排除node_modules目录
      threads, // 指定线程数
    }),
    new HtmlWebpackPlugin({
      // 指定模板文件 , 以public/index.html文件创建新的html文件
      // 新的html文件特点：1.结构和原来一致，2.自动引入打包输出的js文件
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],

  // 开发服务器 --- 开发模式不会输出文件
  devServer: {
    host: "127.0.0.1",
    // 端口号
    port: 5000,
    // 自动打开浏览器
    open: true,
    // 热更新
    hot: true,
  },
  mode: "development",
  // 因为在开发模式中，错误提示是编译后的，所有需要配置source-map源代码和编译后代码映射关系，定位错误
  devtool: "cheap-module-source-map", // 生成一个map文件，方便调试 -- 开发模式行数错误提示
};
