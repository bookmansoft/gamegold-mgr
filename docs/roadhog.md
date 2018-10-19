配置文件 .webpackrc(1.X时是.roadhogrc)部分字段释义：
1、"outputPath": 输出路径，目前设置为"www"
2、"publicPath": 输出文件的路径前缀
      存在的问题：roadhog打包时，publicPath需要设置成"/",而Cordova打包时需要设置为"./"，否则会因为文件定位不到而白屏，或者显示一个目录列表
      解决办法：
        1、不同的打包模式下，手工修改publicPath；
        2、不修改publicPath，在www目录下，手工将引用文件的前缀由"/"改为"./"。目前倾向于第二种方式
