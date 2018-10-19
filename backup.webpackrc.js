const path = require('path');

export default {
  // 指定 webpack 入口文件，支持 glob 格式。
  entry: 'src/index.js',
  // 定义额外的 babel plugin 列表，格式为数组
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  // 针对特定的环境进行配置。dev 的环境变量是 development，build 的环境变量是 production
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  // 配置 webpack 的 externals 属性
  externals: {
    '@antv/data-set': 'DataSet',
  },
  // 配置 webpack 的 resolve.alias 属性
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  // 忽略 moment 的 locale 文件，用于减少尺寸
  ignoreMomentLocale: true,
  // 配置主题，实际上是配 less 变量。支持对象和字符串两种类型，字符串需要指向一个返回配置的文件
  theme: './src/theme.js',
  // 配置 html-webpack-plugin 插件
  html: {
    template: './src/index.ejs',
  },
  // 禁用 CSS Modules
  disableCSSModules: false,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  // 禁用 import() 按需加载，全部打包在一个文件里，通过 babel-plugin-dynamic-import-node-sync 实现
  disableDynamicImport: true,
  // 配置 webpack 的 output.publicPath 属性
  publicPath: '/',
  // 配置让构建产物文件名带 hash，通常会和 manifest 配合使用
  hash: true,
  //配置 webpack-dev-server 的 proxy 属性，如果要代理请求到其他服务器
  proxy: {
    "/api/execute": {
      "target": "http://localhost:17332",
      "changeOrigin": true,
      "pathRewrite": { "^/api/execute" : "" }
    }
  },
};
