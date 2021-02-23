import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vueMoment from 'vue-moment';
import Vuelidate from 'vuelidate';
import { MdButton, MdDatepicker, MdDialog } from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.css';
import 'vue-material/dist/theme/default.css';

Vue.config.productionTip = false;

Vue.use(vueMoment);
Vue.use(Vuelidate);
Vue.use(MdButton);
Vue.use(MdDatepicker);
Vue.use(MdDialog);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
