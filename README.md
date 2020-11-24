# hongqi_build

**概要**

使用electron打包换新视频会议，生成可安装程序，可以在Win7以上或mac上运行。

## 项目介绍 ##

红旗直播客户端打包项目：
```
在项目中配置红旗直播客户端web项目地址，然后打包成客户端安装包
```

## 使用技术 ##

electron

## 目录说明 ##

resources\icons 客户端图标  
release 打包成功后安装包文件  
devtools 配置文件  
main.js 主进程  
renderer.js 渲染进程  

## 安装运行 ##

安装依赖包
```
npm install
```
本地运行
```
npm run start
```
window环境打包客户端
```
npm run build-b
```
mac环境打包客户端
```
npm run dist-mac
```
