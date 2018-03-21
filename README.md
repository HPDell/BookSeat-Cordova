> 免责声明：本项目只做交流和学习使用，使用本软件引发的任何后果本人不承担任何责任。
作者不提供任何可执行程序的下载，有需要者请自行编译安装。

# 编译方法

首先安装工具yarn。

然后安装依赖：

``` bash
yarn install
```

运行下面命令编译

``` bash
yarn run build
```

编译的文件会放在与项目根目录同级的 `www` 目录中，请提前建立 Cordova 或 PhoneGap 工程。

# 部署方法

全局安装 Cordova 或 PhoneGap：

``` bash
yarn globle add phonegap
```

建立 PhoneGap 工程：

``` bash
phonegap create BookSeat-Cordova
```

然后删掉建立的工程中的 `www` 目录下的内容。
在工程目录中新建 `app` 文件夹，放入本仓库。
执行编译过程后，`www` 目录会自动出现编译后的文件。

运行下列命令添加平台：

``` bash
phonegap platform add ios # 添加 ios
phonegap platform add android # 添加 Android
```

运行命令检查构建先决条件是否满足：

``` bash
cordova requirements
```

一般安装了 Gradle 和 Android Studio 就可以编译安卓端程序。
iOS 的编译需要在 Mac 下，安装 Xcode，再安装 CocoaPods 。
详见[知乐文章][zhile-page]。

然后运行命令生成工程

``` bash
phonegap build ios # 如果要生成 ios 工程。
phonegap build android # 如果要生成 Android 工程。
```

如果不能自动编译成手机可用的软件，那么打开 Xcode 工程
或 Android Studio 工程，在 IDE 中编译即可。

[zhile-page]:https://www.zhile.name/115.html