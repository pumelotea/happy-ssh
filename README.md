# HappySSH
 > 基于Electron+vue3+ts+ssh2实现的ssh连接工具

## 本地运行

```SHELL
cd client
yarn electron:serve
cd server
yarn run
```

## 打包编译
修改`client/src/background.ts`取消`// require('./agent')`注释
```SHELL
yarn electron:build
```
