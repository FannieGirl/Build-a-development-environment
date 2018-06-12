# 在多页面项目下使用Webpack+Vue

---

## 前言

webpack+vue能很好的完成单页面应用的开发，官方也提供了很多例子和教程。但使用webpack能不能用到多页面项目中，同时又能使用vue进行模块组件化开发呢？

这里将结合具体的项目，说明一下我是如何配置的。我们希望能在项目里做到

 - 在每个业务模块下会有很多页面，每个页面都是一个文件夹，所需的资源文件也都放在这个文件夹下
 - 采用vue + es6的方式进行组件模块化开发
 - 生成自动引用webpack打包好的js文件到项目需要的目录
 - 具有良好的开发支持，拥有如sourseMap，vue模块的热替换

下面是我们项目的目录结构

## 项目目录结构

    ├─Application (thinkphp后台配置下的结构,可以结合自己项目做修改)
    │  └─Home
    │      └─View (线上用户访问的.html目录)
    │         └─index (生成的一个模块）
    │             ├─index.html (同一模块的模板放在一个模块目录下)
    │             └─info.html
    ├─Public (线上资源文件目录)
    │  ├─css
    │  ├─imgs
    │  ├─js
    │  └─...
    └─source (前端开发目录)
        ├─another (一个业务模块,每个业务下可能有多个页面)
        │  └─index
        │      ├─app.vue
        │      ├─index.html
        │      ├─index.js
        │      └─static (资源文件)
        ├─components (vue组件目录)
        │  ├─A
        │  │ ├─A.vue
        │  │      
        │  └─B
        │    ├─B.vue
        │          
        └─index (一个业务模块,每个业务下可能有多个页面)
            ├─index
            │  ├─app.vue
            │  ├─index.html
            │  ├─index.js
            │  └─static
            └─info
               └─info.html

## 页面文件

每个页面都是一个文件夹，所需的资源文件也都放在这个文件夹下，不需要这个页面时，也只需要删除这个文件夹。

下面是index模块下的index页面

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>index - Vue Webpack Example</title>
    <!-- webpack会将入口JS文件引入的CSS或者vue组件中的css生成style标签或者生成独立的css文件并使用Link标签加载它 -->
  </head>
  <body>
    <app></app>
    <!-- webpack的HtmlWebpackPlugin插件会根据入口JS文件生成script标签并插入在这里或实现按需加载 -->
  </body>
</html>
```

上面是index页面的html模板，我们无需引入任何css和js，webpack会自动帮我打包引入。

其中的app标签是我们的vue组件，webpack的加载器会帮我们处理js文件中引入的vue组件,这样就能正确处理这个标签。

下面index页面对应的js入口文件

```
import Vue from 'vue'
import App from './app'

new Vue({
  el: 'body',
  components: { App }
})
```

## Webpack配置文件
下面是webpack的配置文件webpack.config.js，其中用注释指出了关键配置。

```
var path = require('path');
var webpack = require('webpack');
// 将样式提取到单独的css文件中，而不是打包到js文件或使用style标签插入在head标签中
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 生成自动引用js文件的HTML
var HtmlWebpackPlugin = require('html-webpack-plugin');
var glob = require('glob');

var entries = getEntry('./source/**/*.js'); // 获得入口js文件
var chunks = Object.keys(entries);

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'Public'), // html,css,js,图片等资源文件的输出路径，将所有资源文件放在Public目录
    publicPath: '/Public/',                  // html,css,js,图片等资源文件的server上的路径
    filename: 'js/[name].[hash].js',         // 每个入口js文件的生成配置
    chunkFilename: 'js/[id].[hash].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue']
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        // 使用提取css文件的插件，能帮我们提取webpack中引用的和vue组件中使用的样式
        loader: ExtractTextPlugin.extract('style', 'css')
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
        loader: 'url',
        query: {
          limit: 10000,
          name: './imgs/[name].[ext]?[hash:7]'
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
    new ExtractTextPlugin('css/[name].css')
  ]
};

var prod = process.env.NODE_ENV === 'production';
module.exports.plugins = (module.exports.plugins || []);
if (prod) {
  module.exports.devtool = 'source-map';
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
  module.exports.output.publicPath = '/View/';
}

var pages = getEntry('./source/**/*.html');
for (var pathname in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: prod? '../Application/Home/View/' + pathname + '.html' : pathname + '.html', // html文件输出路径
    template: pages[pathname], // 模板路径
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

// 根据项目具体需求，具体可以看上面的项目目录，输出正确的js和html路径
// 针对不同的需求可以做修改
function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });
  console.log(entries);
  return entries;
```

使用`npm install`安装相关依赖后，使用`webpack build`或`npm run build`打包，可以看到Application/Home/View目录下成功生成了按模块分组的html文件，这正是项目需要的。

如 Application/Home/View/index 下的index.html文件

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>index - Vue Webpack Example</title>
    
  <link href="/Public/css/vendors.css" rel="stylesheet"><link href="/Public/css/index/index.css" rel="stylesheet"></head>
  <body>
    <app></app>
    
  <script src="/Public/js/vendors.91e0fac1fd8493060c99.js"></script><script src="/Public/js/index/index.91e0fac1fd8493060c99.js"></script></body>
</html>
```

venders.css和venders.js文件是webpack插件帮我们自动生成的公共样式模块和公共js模块。打开页面，还能看到其他资源文件也都被正确处理了。

开发环境中使用`npm run dev`命令，访问 localhost:8080/View/index/index.html 可以得到webpack-dev-server开发服务器下的其中一个页面，由于支持热替换，修改源代码可以看到页面发生了变化

## 总结

总结一下webpack帮我们做了下面几件事

 - 使用vue-loader使我们能进行组件化开发。
 - 根据项目需求自动生成按模块分组的html文件。
 - 自动提取样式文件，并和打包后的js文件加入到自动生成的html文件。
 - 将js打包为不同的入口文件，并使用插件抽取公用模块。
 - 为开发调试提供需要的环境，包括热替换，sourceMap。




