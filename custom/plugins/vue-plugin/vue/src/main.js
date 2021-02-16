import Vue from "vue";
import Router from 'vue-router';
import App from "./App.vue";
import TestPage from './components/TestPage.vue';
import VolunteerPage from './components/VolunteerPage.vue';

Vue.config.productionTip = false;

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'testPage',
      component: TestPage
    },
    {
      path: '/volunteers',
      name: 'volunteers',
      component: VolunteerPage
    }
  ]
});

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
