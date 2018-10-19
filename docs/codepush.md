为项目添加基于code push的热更新功能

1、安装codepush cli
npm i code-push-cli -g

2、创建codepush账户
code-push register
在浏览器界面上使用微软账户登录后，会得到Authentication码，输入到行命令中确认，将在本地生成对应的session

3、向codepush server注册app

code-push app add gamegold-android android cordova

| Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ 87tlBFgARph6UJdDlgAh3C0Pqr-Z4d0fde28-2775-4c5b-8796-dce8513476e5 │ 产品发布阶段使用
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ KLl4j0xBXKZ3TIzuCcC2_jYWUOYd4d0fde28-2775-4c5b-8796-dce8513476e5 │ 开发测试阶段使用

@note 如果你的应用分为Android和iOS版，那么在向CodePush注册应用的时候需要注册两个App获取两套deployment key
@noet 相关指令
code-push app add 在账号里面添加一个新的app
code-push app remove 或者 rm 在账号里移除一个app
code-push app rename 重命名一个存在app
code-push app list 或则 ls 列出账号下面的所有app
code-push app transfer 把app的所有权转移到另外一个账号

4、安装cordova-plugin-file，version > 4.3.0
cordova plugin add cordova-plugin-file

@noet 查看已安装插件
cordova plugin ls

5、安装cordova codepush插件
cordova plugin add cordova-plugin-code-push

6、添加 Deployment Key 到 config.xml文件中
    <platform name="android">
            <preference name="CodePushDeploymentKey" value="KLl4j0xBXKZ3TIzuCcC2_jYWUOYd4d0fde28-2775-4c5b-8796-dce8513476e5" />
    </platform>

    @note 注意这里配置的 value 决定了是测试包还是发布包，后续发布更新时只有匹配的包才能收到更新通知

7、确认config.xml里有 
    <access origin="*">
作为替代方式，可以添加如下语句
    <access origin="https://codepush.azurewebsites.net" />
    <access origin="https://codepush.blob.core.windows.net" />
    <access origin="https://codepushupdates.azureedge.net" />

8、确认安装 cordova-plugin-whitelist：
    cordova plugin add cordova-plugin-whitelist

9、模式选择
    1、静默模式：自动下载更新，app进入后台2分钟后再resume进行安装，或者下次app重启时安装生效
    2、激活模式
// 静默模式
```
document.addEventListener('deviceready', function () {
    window.codePush.sync(null, {
        installMode: window.InstallMode.ON_NEXT_RESUME, 
        minimumBackgroundDuration: 60 * 2
    });
},false);
```

// 热更新模式：
```
document.addEventListener('deviceready', function () {
    let container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return;
    let onSyncStatusChange = function(status) {
      switch (status) {
        case SyncStatus.DOWNLOADING_PACKAGE:
          showProgressbar(container, 0, 'green');
          break;
        case SyncStatus.INSTALLING_UPDATE:
          hideProgressbar(container);
          alert('下载完成，即将安装重启APP','提示信息');
          break;
      }
    };
    let downloadProgress = function(downloadProgress) {
      if (downloadProgress) {
        let progress = (downloadProgress.receivedBytes / downloadProgress.totalBytes) * 100;
        setProgressbar(container, progress);
      }
    };
    window.codePush.sync(onSyncStatusChange, {
      updateDialog: {
        mandatoryUpdateMessage: '有更新了，此更新必须下载安装。',
        mandatoryContinueButtonLabel: '继续',
        updateTitle: '更新',
        optionalUpdateMessage: '有更新了. 需要下载安装吗?',
        optionalIgnoreButtonLabel: '取消',
        optionalInstallButtonLabel: '安装'
      },
      installMode: window.InstallMode.IMMEDIATE
    },downloadProgress);
  },false);
```

10、开始部署更新，首先登录codepush
  code-push login
或者直接输入
  code-push login --accessKey ***

11、发布热更新
code-push release-cordova gamegold-android android --description "Modified something for test"
#-m选项说明：设置mandatory为false，则app用户可以选择是否热更新，默认为true：强制更新
-m false 
#-t选项说明：设置本次更新针对的版本号，可以模糊匹配。注意该版本号匹配安装于用户手机上的APP版本号，和当前编译版本的版本号无关
--targetBinaryVersion "~1.1.0"
#通过如下命令查询部署情况
code-push deployment ls gamegold-android
#当以上测试完可正常热更新后，将位于Staging里的版本提升到Production里，通过以下命令
code-push promote gamegold-android Staging Production

12、回滚版本
code-push rollback gamegold-android Staging --targetRelease v34

13、查看发布历史
code-push deployment history gamegold-android Staging

14、清除发布历史
code-push deployment clear gamegold-android Staging

15、参考链接：
1、http://microsoft.github.io/code-push/docs/getting-started.html
2、https://github.com/Microsoft/cordova-plugin-code-push
3、http://cordova.axuer.com/docs/zh-cn/latest/reference/cordova-plugin-file/index.html
