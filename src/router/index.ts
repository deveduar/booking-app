import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BookingView from '@/views/BookingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import HistoryView from '@/views/HistoryView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/booking',
    name: 'Booking',
    component: BookingView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;