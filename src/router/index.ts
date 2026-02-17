import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BookingView from '@/views/BookingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ServicesView from '@/views/ServicesView.vue';
import AboutView from '@/views/AboutView.vue';
import AdminView from '@/views/AdminView.vue';
import AppointmentsView from '@/views/AppointmentsView.vue';

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
    path: '/appointments',
    name: 'Appointments',
    component: AppointmentsView,
  },
  {
    path: '/services',
    name: 'Services',
    component: ServicesView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
