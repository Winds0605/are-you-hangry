import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import Axios from "./https"
import store from './store'
import Qs from 'qs'
import 'normalize.css/normalize.css'
import 'iview/dist/styles/iview.css';

// 配置axios请求根路径

// 电脑服务器
// Axios.defaults.baseURL = "https://192.168.123.132:443"
// Vue.prototype.$baseUrl = 'https://192.168.123.132:443'
// 远程服务器
Axios.defaults.baseURL = "http://101.37.245.209:8081"
Vue.prototype.$baseUrl = 'http://101.37.245.209:8081'
Vue.config.productionTip = false
Vue.use(iView);

Vue.prototype.$axios = Axios;
Vue.prototype.$qs = Qs;
Vue.prototype.$Message.config({
  top: 70,
  duration: 2
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
