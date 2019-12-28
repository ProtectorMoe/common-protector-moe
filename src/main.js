import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Store from "./store.js"
import App from './App.vue'

Vue.config.productionTip = false;
const bus = new Vue();
Vue.prototype.bus = bus;
Vue.use(ElementUI);


new Vue({
  render: h => h(App),
  store: Store
}).$mount('#app');
