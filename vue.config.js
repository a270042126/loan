
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  chainWebpack: config => {
    // 入口文件
    // config.entry.app = ['babel-polyfill', './src/main.js']
    config.resolve.alias
      .set('@', resolve('src'))
      .set('js', resolve('src/assets/js'))
      .set('less', resolve('src/assets/less'))
      .set('images', resolve('src/assets/images'))
      .set('assets', resolve('src/assets'))
    // svg rule loader
    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    // 压缩图片
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      }).end()
  },
  publicPath: './',
  // 将构建好的文件输出到哪里
  outputDir: 'dist',
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  css: {
    // // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // // 开启 CSS source maps?
    sourceMap: true,
    // // 启用 CSS modules for all css / pre-processor files.
    // modules: false,
    // css预设器配置项
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_debugger: true,
              drop_console: true
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  }
}
