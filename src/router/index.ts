// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import SearchRepositories from '../components/SearchRepositories.vue';

const routes = [
  {
    path: '/',
    component: SearchRepositories,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
