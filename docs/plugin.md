1、添加插件是一件比较复杂的事情，很有可能添加一个插件后，系统就无法正常编译了，此时只有删除插件尝试恢复系统正常运行
2、插件和包名有一定程度的捆绑，当修改了包名后，检查 plugins/android.json 中，插件是否和当前包名正确绑定
3、在config.xml中修改AndroidManifest.xml时，例如
    <config-file parent="/*" target="AndroidManifest.xml">
                <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
                <uses-permission android:name="android.permission.CAMERA" />
    </config-file>
    编译时会报错：
    error: Error parsing XML: unbound prefix
    此时需要在widget标签引入xmlns:android="http://schemas.android.com/apk/res/android"：
    <widget id="com.bookman.demo" version="1.1.0.0" 
        xmlns="http://www.w3.org/ns/widgets" 
        xmlns:android="http://schemas.android.com/apk/res/android" 
        xmlns:cdv="http://cordova.apache.org/ns/1.0">
