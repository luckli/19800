var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
   entry: {
      app: './src/main.js'
   },
   output: {
      path: config.build.assetsRoot,
      publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
      filename: '[name].js'
   },
   resolve: {
      extensions: ['', '.js', '.vue','.css','.less'],
      fallback: [path.join(__dirname, '../node_modules')],
      alias: {
         'vue$': 'vue/dist/vue',
         'src': path.resolve(__dirname, '../src'),
         'assets': path.resolve(__dirname, '../src/assets'),
         'components': path.resolve(__dirname, '../src/components'),
         'custom': path.resolve('./src/assets/js/custom.js'),
         'page': path.resolve('./src/components/include/Page'),
         'vuex': path.resolve('./src/assets/lib/vuex.min.js'),
         'jquery': path.resolve('./src/assets/lib/jquery-1.9.1.min.js'),
         'jForm': path.resolve('./src/assets/lib/jquery.form.js'),
         'kindEditor': path.resolve('./src/components/include/KindEditor')
      }
   },/*
   externals: {
     'jquery': 'jquery',
     'App': 'App'
   },*/
   resolveLoader: {
      fallback: [path.join(__dirname, '../node_modules')]
   },
   module: {
      loaders: [
         {
            test: /\.vue$/,
            loader: 'vue'
         },
         {
            test: /\.js$/,
            loader: 'babel',
            include: projectRoot,
            exclude: /node_modules/
         },
         {
            test: /\.json$/,
            loader: 'json'
         },
         {
            test: /\.less$/,
            loader: "less-loader"
         },
         {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
               limit: 8000,
               name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
         },
         {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url',
            query: {
               limit: 10000,
               name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
         }
      ]
   },
   vue: {
      loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
      postcss: [
         require('autoprefixer')({
            browsers: ['last 2 versions']
         })
      ]
   }
}
