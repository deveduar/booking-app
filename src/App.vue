<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="(item, index) in navItems"
          :key="index"
          :to="item.to"
          link
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Header -->
    <Header @toggle-drawer="toggleDrawer" />

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

// Estado del drawer
const drawer = ref(false);

// Ítems de navegación
const navItems = [
  { title: 'Home', to: '/' },
  { title: 'Booking', to: '/booking' },
  { title: 'Services', to: '/services' },
  { title: 'History', to: '/history' },
  { title: 'Sing In', to: '/login' },
  { title: 'Sing Up', to: '/register' },
  { title: 'About', to: '/about' },

];

// Método para alternar el drawer
function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>
