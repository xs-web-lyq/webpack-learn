const path = require("path"); // node.js 核心模块
const os = require("os"); // node.js 核心模块

// 导入esLint插件
const ESLintPlugin = require("eslint-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 抽离css文件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 压缩css文件
const TerserPlugin = require("terser-webpack-plugin"); // 压缩js文件

const threads = os.cpus().length; // 获取cpu核数

const getStyleLoaders = (pre) => {
  return [
    MiniCssExtractPlugin.loader, // style-loader 通过常见style标签插入html文件中生效
    "css-loader", // 将css,资源编译成commonjs模块到js中
    {
      // 需要将postcss-loader放在css-loader后面，less-loader的前面
      // 需要配合package.json中browserslist来设置兼容性
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
    pre,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    // 所有文件的输出目录
    // __dirname node.js变量 当前文件所在目录的绝对路径
    path: path.resolve(__dirname, "../dist"),
    // 入口文件打包输出文件名
    filename: "static/js/[name].[contenthash:10].js",
    chunkFilename: "static/js/[name].[contenthash:10].chunk.js", // 动态导入打包文件名
    assetModuleFilename: "static/media/[hash:10][ext][query]", // 图片等文件名
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
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            // loader:'xxx', // 只能按照一个loader
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/, // 匹配 .scss 和 .sass
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"), // 将 Stylus 文件编译为 CSS
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
          },
          {
            test: /\.(ttf|woff2?|map3|map4|avi)$/, // 因为需要原封不动的将媒体音视频输出所有需要可以通过此配置实现，因为webpack没有处理音视频的loader
            type: "asset/resource", // 字体文件 不会转为base64格式
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
      threads, // 指定线程数 --- 根据代码量决定是否启用多进程打包因为开启进程也需要一定时间
      cache: true, // 开启缓存，下次打包直接使用缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ), // 指定缓存目录
    }),
    new HtmlWebpackPlugin({
      // 指定模板文件 , 以public/index.html文件创建新的html文件
      // 新的html文件特点：1.结构和原来一致，2.自动引入打包输出的js文件
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css文件为单独文件
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
  ],

  mode: "production",
  // 因为在开发模式中，错误提示是编译后的，所有需要配置source-map源代码和编译后代码映射关系，定位错误
  devtool: "cheap-module-source-map", // 生成一个map文件，方便调试 -- 开发模式行数错误提示
  optimization: {
    splitChunks: {
      chunks: "all", // 默认值，自动拆分代码块
    },
    // 运行时代码块--防止重复打包
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}.js`,
    },
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css文件
      new TerserPlugin(), // 压缩js文件
    ],
  },
  // webpack解析模块加载选项
  resolve: {
    // 自动补全文件拓展名
    extensions: [".vue", ".js", ".json"],
  },
};
