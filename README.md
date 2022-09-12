# 项目说明

## front

前台页面，主要分为 3 部分：

1. PV
   点击有`data-spm-pv`属性标记的按钮，跳转到详情页，进入详情页时上报 spm 信息
2. 点击
   点击有`data-spm-click`属性标记的按钮，上报 spm 信息
3. 曝光
   滑动到有`data-spm-exposure`属性标记的元素，该元素展示 30%（可配置比例），并停留 3S（可配置时间）后，上报 spm 信息

```
cd front
npm i
npm run dev
```

## server

服务端，提供`/record`接口，按对象或数组格式接收上报信息，并将其按类型写入`/log`文件夹下的文件中

```
cd server
npm i
npm start
```

## puppeteer

自动模拟 PV、点击、曝光，并收集数据

```
cd puppeteer
npm i
# 模拟PV
npm run pv
# 模拟点击
npm run click
# 模拟曝光
npm run exposure
```

# backend

后台页面，展示收集的数据（待完成）
