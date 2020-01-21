import Vue from 'vue'
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import Store from "./store.js"
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
Vue.use(ElementUI);



new Vue({
  render: h => h(App),
  router,
  store: Store
}).$mount('#app');
