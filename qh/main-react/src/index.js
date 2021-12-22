import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'zone.js';
import { registerMicroApps, start } from 'qiankun'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

registerMicroApps([
  {
    name: 'reactApp',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: '/app-react'
  },
  {
    name: 'vue2App',
    entry: '//localhost:4000',
    container: '#subapp-container',
    activeRule: '/app-vue2'
  },
  {
    name: 'vue3App',
    entry: '//localhost:5000',
    container: '#subapp-container',
    activeRule: '/app-vue3'
  },
  {
    name: 'angular',
    entry: '//localhost:4200',
    container: '#subapp-container',
    activeRule: '/app-angular'
  },
  // {
  //   name: 'menhu',
  //   entry: '//localhost:8080',
  //   container: '#subapp-container',
  //   activeRule: '/views/index.html',
  // },
  {
    name: 'purehtml',
    entry: '//localhost:7000',
    container: '#subapp-container',
    activeRule: '/purehtml',
  }
])

/* 启动qiankun */
start({ singular: false })
