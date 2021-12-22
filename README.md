# qiankun

## 主应用

主应用不限技术栈，只需要提供一个容器 DOM，然后注册微应用并 start 即可

安装 qiankun ：

```bash
yarn add qiankun # 或者 npm i qiankun -S
```

注册微应用并启动：

```bash
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'reactApp',
    entry: '//localhost:3000',
    container: '#container',
    activeRule: '/app-react',
  },
  {
    name: 'vueApp',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app-vue',
  },
  {
    name: 'angularApp',
    entry: '//localhost:4200',
    container: '#container',
    activeRule: '/app-angular',
  },
]);
// 启动 qiankun
start();
```

## 微应用

```bash
微应用分为有 webpack 构建和无 webpack 构建项目，有 webpack 的微应用（主要是指 Vue、React、Angular）需要做的事情有：

新增 public-path.js 文件，用于修改运行时的 publicPath。什么是运行时的 publicPath ？。
注意：运行时的 publicPath 和构建时的 publicPath 是不同的，两者不能等价替代。
微应用建议使用 history 模式的路由，需要设置路由 base，值和它的 activeRule 是一样的。
在入口文件最顶部引入 public-path.js，修改并导出三个生命周期函数。
修改 webpack 打包，允许开发环境跨域和 umd 打包。
主要的修改就是以上四个，可能会根据项目的不同情况而改变。例如，你的项目是 index.html 和其他的所有文件分开部署的，说明你们已经将构建时的 publicPath 设置为了完整路径，则不用修改运行时的 publicPath （第一步操作可省）。

无 webpack 构建的微应用直接将 lifecycles 挂载到 window 上即可。
```

## 微应用react

安装 qiankun ：

```bash
npx create-react-app name
```

src目录增加public-path.js

```bash
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
如果__webpack_public_path__未定义，需要在.eslintrc文件设置 "globals": { "__webpack_public_path__": true }，不能使用window.__webpack_public_path__否则页面加载会出错
```

入口文件index.js

```bash
import './public-path'

function render(props) {
  const { container } = props
  ReactDOM.render(<App />, container ? container.querySelector('#root') : document.querySelector('#root'))
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

export async function bootstrap() {
  console.log('[react] react app bootstraped');
}

export async function mount(props) {
  console.log('[react] props from main framework', props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
```

修改 webpack 配置

```bash
安装插件 @rescripts/cli，当然也可以选择其他的插件，例如 react-app-rewired。
npm i -D @rescripts/cli
```

根目录新增 .rescriptsrc.js：

```bash
const { name } = require('./package');

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.jsonpFunction = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';

    return config;
  },

  devServer: (_) => {
    const config = _;

    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    config.historyApiFallback = true;
    config.hot = false;
    config.watchContentBase = false;
    config.liveReload = false;

    return config;
  },
};

由于版本
jsonpFunction -> chunkLoadingGlobal
watchContentBase -> static
```

修改package.json

```bash
-   "start": "react-scripts start",
+   "start": "rescripts start",
-   "build": "react-scripts build",
+   "build": "rescripts build",
-   "test": "react-scripts test",
+   "test": "rescripts test",
-   "eject": "react-scripts eject"
```

## 微应用vue2

新建项目

```bash
vue create vue2
```

src目录增加public-path.js

```bash
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
如果__webpack_public_path__未定义，需要在.eslintrc文件设置 "globals": { "__webpack_public_path__": true }，不能使用window.__webpack_public_path__否则页面加载会出错
```

入口文件 main.js 修改，为了避免根 id #app 与其他的 DOM 冲突，需要限制查找范围

```bash
import './public-path';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './router';
import store from './store';

Vue.config.productionTip = false;

let router = null;
let instance = null;
function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/',
    mode: 'history',
    routes,
  });

  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}
```

打包配置修改（vue.config.js）：

```bash
const { name } = require('./package');
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
```

## 微应用vue3-ts

新建项目

```bash
vue create vue3
```

src目录增加public-path.js

```bash
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
如果__webpack_public_path__未定义，需要在.eslintrc文件设置 "globals": { "__webpack_public_path__": true }，不能使用window.__webpack_public_path__否则页面加载会出错
```

入口文件 main.js 修改，为了避免根 id #app 与其他的 DOM 冲突，需要限制查找范围

```bash
import './public-path';
import { createApp } from 'vue';
import App from './App.vue';
import routes from './router';
import store from './store';
import { createRouter, createWebHistory } from 'vue-router';

let router = null;
let instance: any = null;
let history = null;

function render(props: any = {}) {
  const { container } = props;
  history = createWebHistory((window as any).__POWERED_BY_QIANKUN__ ? '/app-vue3' : '');
  router = createRouter({
    history,
    routes,
  });

  instance = createApp(App);
  instance.use(router);
  instance.use(store);
  instance.mount(container ? container.querySelector('#app') : '#app');
}

/* 独立运行 */
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('%c ', 'color: green;', 'vue3.0 app bootstraped');
}

function storeTest(props: any) {
  props.onGlobalStateChange && props.onGlobalStateChange((value: string, prev: any) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev), true);
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    });
}

export async function mount(props: any) {
  storeTest(props);
  console.log('[vue] props from main framework', props);
  render(props);
  instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange;
  instance.config.globalProperties.$setGlobalState = props.setGlobalState;
}

export async function unmount() {
  instance.unmount();
  instance._container.innerHTML = '';
  instance = null;
  router = null;
  instance.destroy();
}
```

## 微应用angular

1、新建项目

```bash
ng new angular
```

2、src目录增加public-path.js

```bash
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

3、设置 history 模式路由的 base，src/app/app-routing.module.ts 文件：

```bash
+ import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // @ts-ignore
+  providers: [{ provide: APP_BASE_HREF, useValue: window.__POWERED_BY_QIANKUN__ ? '/app-angular' : '/' }]
})
```

4、入口文件main.ts

```bash
import './public-path';
import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

let app: void | NgModuleRef<AppModule>;
async function render() {
  app = await platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap(props: Object) {
  console.log(props);
}

export async function mount(props: Object) {
  render();
}

export async function unmount(props: Object) {
  console.log(props);
  // @ts-ignore
  app.destroy();
}
```

5、修改 webpack 打包配置

```bash
先安装 @angular-builders/custom-webpack 插件，注意：angular 9 项目只能安装 9.x 版本，angular 10 项目可以安装最新版
npm i @angular-builders/custom-webpack@9.2.0 -D

在根目录增加 custom-webpack.config.js ，内容为：

const appName = require('./package.json').name;
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    library: `${appName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${appName}`,
  },
};

jsonpFunction -> chunkLoadingGlobal
```

修改 angular.json，将 [packageName] > architect > build > builder 的值改为我们安装的插件，将我们的打包配置文件加入到 [packageName] > architect > build > options

```bash
- "builder": "@angular-devkit/build-angular:browser",
+ "builder": "@angular-builders/custom-webpack:browser",
  "options": {
+    "customWebpackConfig": {
+      "path": "./custom-webpack.config.js"
+    }
  }
```

[packageName] > architect > serve > builder

```bash
- "builder": "@angular-devkit/build-angular:dev-server",
+ "builder": "@angular-builders/custom-webpack:dev-server",
```

6、angular微应用解决 zone.js 的问题

```bash
在父应用引入 zone.js，需要在 import qiankun 之前引入。
+ import 'zone.js/dist/zone';

将微应用的 src/polyfills.ts 里面的引入 zone.js 代码删掉。
- import 'zone.js/dist/zone';

在微应用的 src/index.html 里面的 <head> 标签加上下面内容，微应用独立访问时使用。
<!-- 也可以使用其他的CDN/本地的包 -->
<script src="https://unpkg.com/zone.js" ignore></script>
```

7、修正 ng build 打包报错问题，修改 tsconfig.json 文件

```bash
- "target": "es2015",
+ "target": "es5",
+ "typeRoots": [
+   "node_modules/@types"
+ ],
```

8、为了防止主应用或其他微应用也为 angular 时，<app-root></app-root> 会冲突的问题，建议给<app-root> 加上一个唯一的 id，比如说当前应用名称

```bash
src/index.html ：
- <app-root></app-root>
+ <app-root id="angular9"></app-root>

src/app/app.component.ts ：
- selector: 'app-root',
+ selector: '#angular9 app-root',
```

## 非webpack构建的微应用

新建项目

```bash
npm init
npm i -D cross-env http-server
```

修改启动脚本 package.json -> scripts

```bash
+ "start": "cross-env PORT=7000 http-server . --cors"
```

根目录创建index.html

```bash
index.html引入
<script src="//cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
<script src="//localhost:7104/entry.js" entry></script>
```

根目录创建entry.js

```bash
const render = ($) => {
  $('#purehtml-container').html('Hello, render with jQuery');
  return Promise.resolve();
};

((global) => {
  global['menhu'] = {
    bootstrap: () => {
      console.log('purehtml bootstrap');
      return Promise.resolve();
    },
    mount: () => {
      console.log('purehtml mount');
      return render($);
    },
    unmount: () => {
      console.log('purehtml unmount');
      return Promise.resolve();
    },
  };
})(window);

```
