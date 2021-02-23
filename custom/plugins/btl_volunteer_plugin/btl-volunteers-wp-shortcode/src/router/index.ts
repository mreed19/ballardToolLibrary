import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import VolunteerHours from '@/views/VolunteerHours.vue';
import VolunteerList from '@/views/Volunteers/List.vue';
import CreateVolunteer from '@/views/Volunteers/Create.vue';
import EditVolunteer from '@/views/Volunteers/Edit.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Volunteer Hours',
    component: VolunteerHours
  },
  {
    path: '/volunteers/',
    name: 'Volunteers',
    component: VolunteerList
  },
  {
    path: '/volunteers/create',
    name: 'Create Volunteer',
    component: CreateVolunteer
  },
  {
    path: '/volunteers/:id',
    name: 'Edit Volunteer',
    component: EditVolunteer
  }
];

const router = new VueRouter({
  routes
});

export default router;
