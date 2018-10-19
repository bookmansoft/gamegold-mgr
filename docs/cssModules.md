#1 CSS的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。产生局部作用域的唯一方法，就是使用一个独一无二的class的名字，不会与其他选择器重名。这就是 CSS Modules 的做法。
下面是一个React组件App.js。
```
import React from 'react';
import style from './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World
    </h1>
  );
};
```

上面代码中，我们将样式文件App.css输入到style对象，然后引用style.title代表一个class。
.title {
  color: red;
}

构建工具会将类名style.title编译成一个哈希字符串。

<h1 class="_3zyde4l1yATCOkgn-DBWEL">
  Hello World
</h1>

App.css也会同时被编译。

._3zyde4l1yATCOkgn-DBWEL {
  color: red;
}

这样一来，这个类名就变成独一无二了，只对App组件有效。

#2 CSS Modules 允许使用:global(.className)的语法，声明一个全局规则。凡是这样声明的class，都不会被编译成哈希字符串。

App.css加入一个全局class。

.title {
  color: red;
}

:global(.title) {
  color: green;
}

App.js使用普通的class的写法，就会引用全局class。

```
import React from 'react';
import styles from './App.css';

export default () => {
  return (
    <h1 className="title">
      Hello World
    </h1>
  );
};
```

#3 在 CSS Modules 中，一个选择器可以继承另一个选择器的规则，这称为"组合"（"composition"）。
在App.css中，让.title继承.className 。

.className {
  background-color: blue;
}

.title {
  composes: className;
  color: red;
}

#4 选择器也可以继承其他CSS文件里面的规则。
another.css
.className {
  background-color: blue;
}

App.css可以继承another.css里面的规则。
.title {
  composes: className from './another.css';
  color: red;
}

#5 CSS Modules 支持使用变量，不过需要安装 PostCSS 和 postcss-modules-values。
$ npm install --save postcss-loader postcss-modules-values
把postcss-loader加入webpack.config.js。
var values = require('postcss-modules-values');
module.exports = {
  entry: __dirname + '/index.js',
  output: {
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules!postcss-loader"
      },
    ]
  },
  postcss: [
    values
  ]
};

接着，在colors.css里面定义变量。
@value blue: #0c77f8;
@value red: #ff0000;
@value green: #aaf200;

App.css可以引用这些变量。
@value colors: "./colors.css";
@value blue, red, green from colors;

.title {
  color: red;
  background-color: blue;
}



由于antd3.0默认开启 css modules，导致ant motion（基于antd2.3.16）的less导入失效。

可能的处理方式有：
1、node_modules 下的 css 不会做 css modules 处理，所以如果是依赖里的 css 可以直接引入
2、css 文件放 public 目录，然后在 html 里直接引用，如果是less需要在less文件后引入less解析脚本
3、改 css 文件，加 :global 前缀

目前的处理方式是使用方法1:
LocalCSS目录中，集中存储routes目录下、各同名子目录中控件的样式表，这些样式表不需要应用 CSS Modules。
需要手工将LocalCSS目录拷贝到 node_modules 下，程序中直接引用该地址下的样式表，而本目录用于版本管理
