# cordova开发手记：

添加系统变量 ANDROID_HOME E:\Android\sdk

添加路径：
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools

已知的可执行路径：
1、使用roadhog打包js到www目录，其中 www 在 .roadhogrc 中设置
    ```
    roadhog build
    ```
2、使用Android Studio打开位于platforms/android下的工程，打成APK，然后安装到手机上

## 如何使用 https://motion.ant.design/edit/ 在线编辑系统
1. 将导出的 Home 文件包直接拷到 routes 文件夹下。
2. 修改 router.js 里的 IndexPage 的路径:
    import IndexPage from './routes/Home';

roadhog:
1、2.X并非如官方所说那么容易升级，所以目前还是先用1.3
2、未来还是回退到原生webpack下比较稳妥，roadhog这么一层层封装，完全弄不懂一件简单事情的来龙去脉了。

## 查看Cordova中的WebWebview控制台输出
chrome://inspect/#devices
