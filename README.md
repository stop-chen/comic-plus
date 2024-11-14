<p align="center">
 <img width="200px" src="./logo.png"/> 
</p>

<p align="center">Comic Plus | 一个vue3 + ts的UI框架</p>

<p align="center">
 <img src="https://img.shields.io/badge/license-MIT-green"/>
 <img src="https://img.shields.io/badge/version-1.8.3-red"/>
 <img src="https://img.shields.io/badge/npm-v2.8.3-green"/>
 <img src="https://img.shields.io/badge/typescript-^5.6.2-blue"/>
 <img src="https://img.shields.io/badge/extension for-VsCode-purple"/>
</p>

## 安装教程

```shell
$ npm install comic-plus

# 指定版本
$ npm install comic-plus@version
```

## 使用说明

```JavaScript
//建议前往官网查看详细使用方式

//完整引入
import { createApp } from 'vue';
import ComicPlus from 'comic-plus';
import 'comic-plus/theme/index.css'; //导入全局css

const app = createApp(App);
app.use(ComicPlus)

app.mount('#app')

//按需引入
//main.js | main.ts
import 'comic-plus/theme/index.css';

//pages
import { /* 组件名 */ } from 'comic-plus';

```

## 组件库官网

<a href="http://comicui.cn">http://comicui.cn</a>

## 组件库使用示例

<a href="http://comicui.cn/admin">http://comicui.cn/admin</a>

## 参与贡献

<p>
  <a href="https://github.com/neishuishui" align="center">
    <img  width="40px" src="https://avatars.githubusercontent.com/u/72653133?v=4" />
  </a>
</p>
