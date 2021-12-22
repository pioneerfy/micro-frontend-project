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
