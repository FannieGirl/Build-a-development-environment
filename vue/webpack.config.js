var path = require('path');
var webpack = require('webpack');
// 将样式提取到单独的css文件中，而不是打包到js文件或使用style标签插入在head标签中
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 生成自动引用js文件的HTML
var HtmlWebpackPlugin = require('html-webpack-plugin');
var glob = require('glob');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var entries = getEntry('./src/app/**/*.js'); // 获得入口js文件
var chunks = Object.keys(entries);

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'), // html,css,js,图片等资源文件的输出路径，将所有资源文件放在Public目录
    publicPath: '',                  // html,css,js,图片等资源文件的server上的路径
    filename: 'js/[name].[hash].js',         // 每个入口js文件的生成配置
    chunkFilename: 'js/[id].[hash].js'
  },
  resolve: {
      alias: {
          'config':path.resolve(__dirname, './src/config'),
          'services':path.resolve(__dirname, './src/services'),
          'library':path.resolve(__dirname, './src/library'),
          'assets': path.resolve(__dirname, './src/assets'),
          'components': path.resolve(__dirname, './src/components'),
          'plugin':path.resolve(__dirname, './src/plugin')
      },
      extensions: ['', '.js', '.vue']
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        // 使用提取css文件的插件，能帮我们提取webpack中引用的和vue组件中使用的样式
        loader: ExtractTextPlugin.extract('style', 'css', {publicPath:'../../'})
      },
      {
        // vue-loader，加载vue组件
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        // 使用es6开发，这个加载器帮我们处理
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        // 图片加载器，较小的图片转成base64
        loader: 'file',
        query: {
          limit: 100,
          name: 'imgs/[name].[ext]?[hash:7]',

        }
      }
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  vue: { // vue的配置
    loaders: {
      js: 'babel',
      css: ExtractTextPlugin.extract('vue-style-loader', 'css-loader')
    }
  },
  plugins: [
    // 提取公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 公共模块的名称
      chunks: chunks,  // chunks是需要提取的模块
      minChunks: chunks.length
    }),
    // 配置提取出的样式文件
    new ExtractTextPlugin('css/[name].css'),

    new CleanWebpackPlugin(['dist'], {
        root: path.resolve(__dirname),
        verbose: true,
        dry: false,
        exclude: ['shared.js']
    })
  ]
};

var prod = process.env.NODE_ENV === 'production';
module.exports.plugins = (module.exports.plugins || []);
if (prod) {
  module.exports.plugins = module.exports.plugins.concat([
    // 借鉴vue官方的生成环境配置
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
} else {
  module.exports.devtool = 'eval-source-map';
  module.exports.output.publicPath = '/';
}

for (var pathname in entries) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: prod? '../dist/' + pathname + '.html' : pathname + '.html', // html文件输出路径
    template: prod? './index.html':'./index-test.html', // 模板路径
    inject: true,              // js插入位置
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  };
  if (pathname in module.exports.entry) {
    conf.chunks = ['vendors', pathname];
    conf.hash = false;
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}

// 根据项目具体需求，输出正确的js和html路径
function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });
  return entries;
}
