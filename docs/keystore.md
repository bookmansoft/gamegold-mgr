进行Android项目开发中想要将androidapp导出为apk的时候需要选择一个数字证书，即keystore文件（android.keystore）
它用来对我们的APP进行签名，是导出APP的一个钥匙，一般需要我们自己生成android.keystore文件

利用JDK下的keytool工具生成, 步骤：
1：使用keytool命令， 该命令位于JDK文件下的子目录bin中
2：在命令窗口中使用keytool命令：
    ```
    keytool -genkey -alias test -keyalg RSA -validity 20000 -keystore android.keystore
    ```
    回车并依次填写相关信息,参数说明：
    -genkey 生成文件
    -alias 别名
    -keyalg 加密算法
    -validity 有效期
    -keystore 文件名

3、查看证书库
    keytool -list -keystore android.keystore

4、删除证书条目
    keytool -delete -keystore android.keystore -alias test

5、导出证书内容
    keytool -export -alias test -file test.crt -keystore android.keystore

6、导入证书内容
    keytool -import -keystore android.keystore -file test.crt 

7、查看证书内容
    keytool -printcert -file "test.crt"   

8、修改证书条目的口令
    keytool -keypasswd -alias test -keystore android.keystore 

使用该证书，在Android Studio中签名打包时，有两种选择：
1、V1(Jar Signature)
2、V2(Full APK Signature)
实践中，采用 V1 生成的包，可以在华为Android6.0上顺利安装，采用 v2 生成的包被拒(找不到签名)
