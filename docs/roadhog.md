# roadhog

roadhog底层封装了webpack，cordova底层不确定使用了何种打包工具。目前打包过程存在冲突，需要谨慎处理：
1、确保在".roadhogrc"中配置了 "publicPath": "./"，这样打包出来的html中，包含的js和css会被加上"./"字头，否则在真机上运行时会因为找不到文件而白屏。
2、确保在".roadhogrc"中配置了 "outputPath": "www", 这样roadhog的输出刚好成为cordova的输入。
3、要求js或jsx文件中采用相对路径引用图片，并将这些图片统一保存于public目录下，roadhog打包时会将public目录下文件拷贝到www目录，运行时根据相对路径匹配www目录下的文件。如果采用绝对路径，真机运行时会找不到对应文件
4、要求css、less样式表中采用相对路径引用图片，并将这些图片统一保存于style目录下，roadhog打包首先检查该相对路径上文件真实存在，然后抽取该文件拷贝到 www/static 下，但并不会将整个style目录拷贝至www
2、cordova打包中，凡是引用 www 下的本地文件，只能使用相对路径，如访问"www/img/1.jpg"，则需写成"img/1.jpg"，不能使用绝对路径。所以要避免 roadhog 和 cordova 打包时（因为是独立的两次打包）出现冲突
Q: 在 .roadhogrc.mock.js 中，将
  'POST /api/execute': {
    "content": "hello"
  },
  改写为
  'POST /api/execute': 'http://localhost:8000/',
  或者
  'POST /api/execute/*': 'http://localhost:8000/',
  并没有起到切换目标服务器的作用
A: 不能直接修改 .roadhogrc.mock.js, 应该在 .webpackrc.js 的 proxy 字段中配置：

    ```js
    // 在 .webpackrc.js 中配置 proxy 属性，将请求代理到其他服务器
    proxy: {
        "/api/execute": 
        {
          "target": "http://localhost:17332",           // 目标服务器
          "changeOrigin": true,                         // 修改
          "pathRewrite": { "^/api/execute" : "" }       // 路径改写
        }
    },
    ```

    roadhog 官方说两种方式都支持的。。。我还是相信自己吧:)
    @补充(2018.10.20): 现改为在 config/config.js 文件中配置

配置文件 .webpackrc(1.X时是.roadhogrc)部分字段释义：
1、"outputPath": 输出路径，目前设置为"www"
2、"publicPath": 输出文件的路径前缀
      存在的问题：roadhog打包时，publicPath需要设置成"/",而Cordova打包时需要设置为"./"，否则会因为文件定位不到而白屏，或者显示一个目录列表
      解决办法：
        1、不同的打包模式下，手工修改publicPath；
        2、不修改publicPath，在www目录下，手工将引用文件的前缀由"/"改为"./"。目前倾向于第二种方式

@补充(2018.10.20)：andtpro当前版本，已经采用umi替代了roadhog，不喜欢这么换来换取的，被人牵着鼻子走，然而无可奈何。。。
